Param(
  [Parameter(Mandatory=$true)][string]$username,
  [Parameter(Mandatory=$true)][string]$password,
  [Parameter(Mandatory=$true)][string]$reportZipPath
)


Import-Module "sqlps"

$smo = 'Microsoft.SqlServer.Management.Smo.'
$wmi = new-object ($smo + 'Wmi.ManagedComputer').

# List the object properties, including the instance names.
$Wmi

# Enable the TCP protocol on the default instance.
$uri = "ManagedComputer[@Name='" + (get-item env:\computername).Value + "']/ServerInstance[@Name='MSSQLSERVER']/ServerProtocol[@Name='Tcp']"
$Tcp = $wmi.GetSmoObject($uri)
$Tcp.IsEnabled = $true
$Tcp.Alter()

try {
    RESTART-SERVICE -Force MSSQLSERVER
} catch { }


# ------------------------------------
# Configuration for SSRS

# Open 80 port
netsh advfirewall firewall add rule name="Open Port 80" dir=in action=allow protocol=TCP localport=80

## This script configures a Native mode report server without HTTPS
$ErrorActionPreference = "Stop"

$server = $env:COMPUTERNAME
$HTTPport = 80 # change the value if you used a different port for the private HTTP endpoint when the VM was created.

## Set PowerShell execution policy to be able to run scripts
#Set-ExecutionPolicy RemoteSigned -Force

## ReportServer Database name - this can be changed if needed
$dbName='ReportServer'

## Register for MSReportServer_ConfigurationSetting
## Change the version portion of the path to "v13" to use the script for SQL Server 2016
$RSObject = Get-WmiObject -class "MSReportServer_ConfigurationSetting" -namespace "root\Microsoft\SqlServer\ReportServer\RS_MSSQLSERVER\v13\Admin"

## Report Server Configuration Steps

## Setting the web service URL ##

## SetVirtualDirectory for ReportServer site
    $r = $RSObject.SetVirtualDirectory('ReportServerWebService','ReportServer',1033)

## ReserveURL for ReportServerWebService - port $HTTPport (for local usage)
    $r = $RSObject.ReserveURL('ReportServerWebService',"http://+:$HTTPport",1033)

## GenerateDatabaseScript - for creating the database
    $r = $RSObject.GenerateDatabaseCreationScript($dbName,1033,$false)
    $script = $r.Script

## Execute sql script to create the database
    Import-Module SQLPS              ## this automatically changes to sqlserver provider
    Invoke-SqlCmd -Query $script -Username $username -Password $password

## GenerateGrantRightsScript 
    $DBUser = "NT Service\ReportServer"
    $r = $RSObject.GenerateDatabaseRightsScript($DBUser,$dbName,$false,$true)
    $script = $r.Script

## Execute grant rights script
    Invoke-SqlCmd -Query $script -Username $username -Password $password

## SetDBConnection - uses Windows Service (type 2), username is ignored
    $r = $RSObject.SetDatabaseConnection($server,$dbName,2,'','')

## Setting the Report Manager URL ##

## SetVirtualDirectory for Reports (Report Manager) site. Due a bug in SQL2016, the app is "RepotServerWebApp"

    $r = $RSObject.SetVirtualDirectory('ReportServerWebApp','Reports',1033)

## ReserveURL for ReportManager  - port $HTTPport
    $r = $RSObject.ReserveURL('ReportServerWebApp',"http://+:$HTTPport",1033)

try {
    RESTART-SERVICE -Force ReportServer
} catch { }
    $r = $RSObject.ReserveURL('ReportServerWebApp',"http://+:$HTTPport",1033)

## Deploy SSRS report: download Report.zip file
	Invoke-WebRequest $reportZipPath -OutFile C:\Users\Public\Downloads\Reports.zip

## Deploy SSRS report: unzip file
	Expand-Archive C:\Users\Public\Downloads\Reports.zip -dest C:\Users\Public\Downloads\

## Deploy SSRS report: execute command
	rs -i C:\Users\Public\Downloads\Reports\deploySSRSreports.vb -e Mgmt2005 -s http://localhost/reportserver/ -l 0 -u $username -p $password


# -----------------------------------
### Install R Services
	C:\SQLServer_13.0_Full\Setup.exe /q /ACTION=Install /FEATURES=AdvancedAnalytics /INSTANCENAME=MSSQLSERVER /IAcceptROpenLicenseTerms /IAcceptSQLServerLicenseTerms

## Update SQL Server config to allow using R Services
$con = "Server=Localhost; Database=Master; User=" + $username + "; Password=" + $password
$MSSQl = New-Object System.Data.SqlClient.SqlConnection;
$MSSQl.ConnectionString = $con
$MSSQl.Open()
$query = "EXECUTE sp_configure 'external scripts enabled', 1;RECONFIGURE WITH OVERRIDE;"
$cmd = $MSSQL.CreateCommand()
$cmd.CommandText = $query
$result = $cmd.ExecuteReader()
$MSSQL.Close()

# Restart SQL Server to apply the settings from R. Ensure that the LaunchPad is running
try {
    RESTART-SERVICE -Force MSSQLSERVER
	RESTART-SERVICE -Force MSSQLLaunchPad
} catch { }

# Restart SQL Agent Job to ensture that is running
try{
	RESTART-SERVICE -Force SQLSERVERAGENT
} catch {}
