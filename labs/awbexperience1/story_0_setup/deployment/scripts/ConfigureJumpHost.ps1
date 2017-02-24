
Write-Verbose 'Extracting Source.zip'

## Deploy SSRS report: unzip file
    Add-Type -AssemblyName 'System.IO.Compression.FileSystem'
    [System.IO.Compression.ZipFile]::ExtractToDirectory('D:\Temp\Source.zip', 'C:\a\')
