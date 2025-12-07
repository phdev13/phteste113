@echo off
REM Script para limpar credenciais antigas e fazer novo login

echo.
echo 🔐 Limpando credenciais antigas...
echo.

REM Remover credenciais armazenadas do Git
git config --global --unset credential.helper

REM Limpar credenciais do Windows Credential Manager
echo Removendo credenciais do GitHub...
cmdkey /delete:github.com /yes 2>nul
cmdkey /delete:git:https://github.com /yes 2>nul

echo.
echo ✅ Credenciais limpas!
echo.
echo 📝 Agora faça login com suas credenciais do GitHub:
echo    Usuário: phdev13
echo    Senha: seu_token_aqui
echo.
echo Executando: git push -u origin main
echo.

cd c:\Users\kayka\Desktop\ph
git config --global credential.helper manager
git remote set-url origin https://github.com/phdev13/phteste113.git
git push -u origin main

pause
