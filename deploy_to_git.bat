@echo off
chcp 65001 >nul
echo ===================================================
echo      LingKR Git Deployment Helper
echo      LingKR Git 部署助手 (Vercel/Render)
echo ===================================================
echo.
echo This script will commit and push your changes to GitHub.
echo 此脚本将提交代码并推送到 GitHub。
echo.

git add .
git commit -m "Update: Fix AI API key and i18n issues"
git push

echo.
echo ===================================================
echo ✅ Push Complete!
echo ✅ 推送完成！
echo.
echo If you use Vercel/Render, the deployment should start automatically.
echo 如果您使用 Vercel 或 Render，部署应该会自动开始。
echo ===================================================
pause