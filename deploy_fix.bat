@echo off
echo Adding changes to git...
git add .
echo Committing changes...
git commit -m "fix: resolve vercel deployment 500 error by enabling esModuleInterop"
echo Pushing to remote...
git push
echo.
echo ==========================================
echo Push complete! 
echo Now go to your Vercel Dashboard: https://vercel.com/dashboard
echo And watch the latest deployment status.
echo ==========================================
pause
