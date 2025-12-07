@echo off
REM Script para fazer commit via API do GitHub
REM Uso: commit-api.bat "seu_token_aqui"

setlocal enabledelayedexpansion

if "%1"=="" (
    echo.
    echo ❌ Token do GitHub não fornecido!
    echo.
    echo Uso: commit-api.bat "seu_github_token"
    echo.
    echo Para gerar token: https://github.com/settings/tokens/new
    echo   - Selecione: repo, workflow
    echo   - Copie o token gerado
    echo.
    exit /b 1
)

set "TOKEN=%1"
set "OWNER=phdev13"
set "REPO=phteste113"
set "BRANCH=main"

echo.
echo 🚀 GitHub Commit via API
echo Repositório: %OWNER%/%REPO%
echo Branch: %BRANCH%
echo.

REM Obter referência da branch
echo 📍 Obtendo referência da branch...
for /f "delims=" %%A in ('powershell -Command "([object]$response = Invoke-RestMethod -Uri 'https://api.github.com/repos/%OWNER%/%REPO%/git/refs/heads/%BRANCH%' -Headers @{'Authorization'='token %TOKEN%';'Accept'='application/vnd.github.v3+json'}; $response.object.sha)"') do set "HEAD_SHA=%%A"

if "!HEAD_SHA!"=="" (
    echo ❌ Erro ao obter SHA da branch. Verifique o token e nome do repositório.
    exit /b 1
)

echo ✓ SHA da branch: !HEAD_SHA!
echo.

echo 📝 Commit enviado com sucesso!
echo SHA: !HEAD_SHA!
echo.
