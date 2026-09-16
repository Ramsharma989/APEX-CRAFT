@echo off
setlocal
set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"
title ApexCraft Studios - Deploy to GitHub

echo ===================================================================
echo               ApexCraft Studios - GitHub Deployment
echo ===================================================================
echo.

git remote get-url origin >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('git remote get-url origin') do set CURRENT_REMOTE=%%i
    echo Current GitHub Remote: %CURRENT_REMOTE%
    echo.
    set /p CHOICE="Do you want to push updates to this existing remote? (y/n, default: y): "
    if /i "%CHOICE%"=="n" goto prompt_new
    goto push_now
)

:prompt_new
echo Please create a new public repository on GitHub (https://github.com/new).
echo (Leave it empty: do NOT check README, .gitignore, or license)
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/your-username/repo.git): "
if "%REPO_URL%"=="" (
    echo [ERROR] No repository URL was entered.
    pause
    exit /b 1
)

git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

:push_now
echo.
echo [1/3] Adding any modified files...
git add .
git commit -m "Site update: ApexCraft Studios" >nul 2>&1

echo [2/3] Setting branch to main...
git branch -M main

echo [3/3] Pushing code to GitHub...
echo (A browser window may open to authenticate your GitHub account)
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================================
    echo                     SUCCESSFULLY PUSHED!
    echo ===================================================================
    echo Next step to go LIVE on GitHub Pages:
    echo 1. Open your repository on GitHub.
    echo 2. Go to: Settings -> Pages (in the left sidebar)
    echo 3. Under 'Build and deployment', set:
    echo      - Source: Deploy from a branch
    echo      - Branch: main
    echo      - Folder: / (root)
    echo 4. Click 'Save'.
    echo In 1-2 minutes, your website will be live at:
    echo   https://^<your-username^>.github.io/^<repo-name^>/
    echo ===================================================================
) else (
    echo.
    echo [ERROR] Push failed. Please check your repository URL or permissions.
)

echo.
pause
