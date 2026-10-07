$docxPath = Join-Path $env:USERPROFILE "Desktop\Fake_Product_Identification_Report.docx"
$pdfPath = Join-Path $env:USERPROFILE "Desktop\Fake_Product_Identification_Report.pdf"

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc = $word.Documents.Open($docxPath)
    $doc.SaveAs2($pdfPath, 17)
    $doc.Close()
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    Write-Host "PDF conversion successful!"
} catch {
    Write-Host "PDF conversion note: $_"
}
