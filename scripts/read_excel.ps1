Add-Type -AssemblyName System.IO.Compression.FileSystem

$xlFile = Get-ChildItem -Path . -Filter "*.xlsm" | Select-Object -First 1
Write-Host "Found file: $($xlFile.FullName)"

$zip = [System.IO.Compression.ZipFile]::OpenRead($xlFile.FullName)
$entry = $zip.Entries | Where-Object { $_.FullName -eq "xl/sharedStrings.xml" }

if ($entry) {
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
    $xmlContent = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    
    [xml]$xmlDoc = $xmlContent
    $strings = $xmlDoc.SelectNodes("//*[local-name()='t']") | ForEach-Object { $_.InnerText }
    Write-Host "Shared Strings Count: $($strings.Count)"
    $strings | ForEach-Object { Write-Host $_ }
}

$zip.Dispose()
