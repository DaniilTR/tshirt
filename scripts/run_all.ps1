# Оркестратор для Windows PowerShell
# Поднимает db, backend, frontend, scripts и транслирует логи в текущий терминал.

$ErrorActionPreference = 'Stop'

# Добавим docker в PATH для текущей сессии
$dockerBin = "$Env:ProgramFiles\Docker\Docker\resources\bin"
if (-not ($env:PATH -split ';' | Where-Object { $_ -eq $dockerBin })) {
  $env:PATH = "$dockerBin;$env:PATH"
}

Write-Host "▶ docker compose up -d db backend frontend scripts"
docker compose up -d db backend frontend scripts

Write-Host "\n▶ Логи (нажмите Ctrl+C для выхода)"
docker compose logs -f db backend frontend scripts
