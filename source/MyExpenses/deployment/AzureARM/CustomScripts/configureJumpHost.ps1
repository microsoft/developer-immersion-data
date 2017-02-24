Param(
  [Parameter(Mandatory=$true)][string]$sourcePath
)

## Download sourcse files
	Invoke-WebRequest $sourcePath -OutFile C:\a\Source.zip

## Decompress sources files in the default a directory
Add-Type -AssemblyName System.IO.Compression.FileSystem
function Unzip
{
    param([string]$zipfile, [string]$outpath)

    [System.IO.Compression.ZipFile]::ExtractToDirectory($zipfile, $outpath)
}

Unzip "C:\a\Source.zip" "C:\a"