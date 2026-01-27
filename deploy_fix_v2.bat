@echo off
echo Adding changes to git...
git add .
echo Committing changes...
git commit -m "fix: update vercel rewrites and add postinstall script"
echo Pushing to remote...
git push
echo.
echo ==========================================
echo Push complete!
echo Please check Vercel dashboard for new deployment.
echo ==========================================
pause
