@echo off 
echo ======================================================== 
echo       LuN3cy Website Content Update Helper 
echo ======================================================== 
echo. 
echo This script will help you upload your changes to GitHub. 
echo GitHub Actions will then automatically build and deploy your site. 
echo. 

echo 1. Adding all changes... 
git add . 

echo. 
set /p commit_msg="Enter a description for this update (e.g., 'Added new photos'): " 

if "%commit_msg%"=="" set commit_msg=Content update 

echo. 
echo 2. Committing changes... 
git commit -m "%commit_msg%" 

echo. 
echo 3. Pulling latest changes from GitHub... 
git pull origin main --rebase 

if %errorlevel% neq 0 ( 
    echo. 
    echo [ERROR] Conflict detected or pull failed!  
    echo Git has stopped to protect your changes. 
    echo Please resolve conflicts manually before pushing. 
    pause 
    exit /b 
) 

echo. 
echo 4. Pushing to GitHub... 
:: Increase buffer size and timeout to handle unstable connections 
git config http.postBuffer 524288000 
git config http.lowSpeedLimit 0 
git config http.lowSpeedTime 999999 
git config --global http.version HTTP/1.1 

:push_retry 
git push origin main 

if %errorlevel% neq 0 ( 
    echo. 
    echo [ERROR] Push failed! Connection might be unstable. 
    echo. 
    set /p retry="Do you want to retry? (y/n): " 
    if /i "%retry%"=="y" goto push_retry 
     
    echo. 
    echo Tip: If you are using a VPN, make sure it's ON. 
    echo If you are NOT using a VPN, you might need one to access GitHub. 
    pause 
    exit /b 
) 

echo. 
echo ======================================================== 
echo Success! Your changes have been pushed. 
echo Please wait 1-3 minutes for GitHub Pages to update. 
echo You can check progress at: `https://github.com/LuN3cy/Md2Design/actions`  
echo ======================================================== 
echo. 
pause
