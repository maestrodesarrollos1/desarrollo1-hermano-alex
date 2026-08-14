param([string]$TemplateId)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$config = Get-Content (Join-Path $root "config\plantillas.json") -Raw | ConvertFrom-Json
$templates = @($config.templates)

if (-not $TemplateId) {
    Write-Host ""
    Write-Host "Plantillas Nupia" -ForegroundColor DarkGreen
    for ($index = 0; $index -lt $templates.Count; $index++) {
        Write-Host ("[{0}] {1}" -f ($index + 1), $templates[$index].name)
    }
    $choice = Read-Host "Elige una plantilla"
    $position = 0
    if (-not [int]::TryParse($choice, [ref]$position) -or $position -lt 1 -or $position -gt $templates.Count) {
        throw "Seleccion no valida."
    }
    $template = $templates[$position - 1]
} else {
    $template = $templates | Where-Object { $_.id -eq $TemplateId } | Select-Object -First 1
    if (-not $template) { throw "No existe la plantilla '$TemplateId'." }
}

$source = Join-Path $root $template.path
if (-not (Test-Path (Join-Path $source "node_modules\vite\bin\vite.js"))) {
    throw "Faltan dependencias. Ejecuta primero 01_instalar_requisitos.bat."
}

$url = "http://127.0.0.1:$($template.port)"
$command = "Set-Location -LiteralPath '$source'; npm run dev -- --host 127.0.0.1 --port $($template.port) --strictPort"
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $command
Start-Sleep -Milliseconds 900
Start-Process $url
Write-Host "Abierta: $($template.name) -> $url" -ForegroundColor Green
