Add-Type -AssemblyName System.Drawing

$imageFiles = Get-ChildItem "public/images/*.JPG"

foreach ($file in $imageFiles) {
    Write-Host "Processing $($file.Name)..."
    
    # 載入原始相片
    $srcImage = [System.Drawing.Image]::FromFile($file.FullName)
    
    # 計算最大寬度 1200px 比例
    $maxWidth = 1200
    if ($srcImage.Width -gt $maxWidth) {
        $newWidth = $maxWidth
        $newHeight = [int]($srcImage.Height * ($maxWidth / $srcImage.Width))
    } else {
        $newWidth = $srcImage.Width
        $newHeight = $srcImage.Height
    }
    
    # 建立新點陣圖與高品質繪圖物件
    $destBitmap = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $graphics.DrawImage($srcImage, 0, 0, $newWidth, $newHeight)
    
    $srcImage.Dispose()
    $graphics.Dispose()
    
    # 設定 JPEG 壓縮品質 80%
    $encoder = [System.Drawing.Imaging.Encoder]::Quality
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]80)
    $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    
    # 儲存覆蓋成網頁最佳化尺寸
    $tempPath = "$($file.FullName).tmp"
    $destBitmap.Save($tempPath, $jpegCodec, $encoderParams)
    $destBitmap.Dispose()
    
    Remove-Item $file.FullName -Force
    Move-Item $tempPath $file.FullName -Force
    
    $newSize = (Get-Item $file.FullName).Length / 1KB
    Write-Host "Finished $($file.Name) - New Size: $([math]::Round($newSize, 1)) KB"
}
