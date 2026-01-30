@echo off
chcp 65001 >nul
echo ===================================================
echo      LingKR VPS Deployment Helper
echo      LingKR VPS 部署助手
echo ===================================================
echo.
echo This script will deploy your local changes to your VPS.
echo 此脚本将把您的本地更改部署到 VPS 服务器。
echo.

if exist deploy_ip.txt (
    set /p ServerIP=<deploy_ip.txt
    echo ℹ️  Found deploy_ip.txt, using IP: %ServerIP%
    echo ℹ️  发现 deploy_ip.txt，使用 IP: %ServerIP%
) else (
    set /p ServerIP="Please enter your Server IP (请输入服务器 IP 地址): "
)

if "%ServerIP%"=="" (
    echo.
    echo ❌ Error: IP address is required.
    echo ❌ 错误：必须输入 IP 地址。
    pause
    exit /b
)

echo.
echo 🚀 Starting deployment to %ServerIP%...
echo 🚀 开始部署到 %ServerIP%...
echo.

REM Clean local dist to ensure fresh build
if exist "apps\client\dist" rd /s /q "apps\client\dist"
if exist "apps\server\dist" rd /s /q "apps\server\dist"

powershell -NoProfile -ExecutionPolicy Bypass -File ".\deploy\deploy_local.ps1" -ServerIP "%ServerIP%"

echo.
if %errorlevel% neq 0 (
    echo ❌ Deployment Failed!
    echo ❌ 部署失败！
) else (
    echo ✅ Deployment Complete!
    echo ✅ 部署完成！
)
pause