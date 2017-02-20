
param(
	[parameter(Mandatory=$TRUE)]
    [String] $webAppName
)

try {
	$uri =  "http://$($webAppName).azurewebsites.net/api/restaurants/1"
	Invoke-WebRequest $uri -ErrorAction Ignore
} catch { }




