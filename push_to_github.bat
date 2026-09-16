@echo off
setlocal EnableDelayedExpansion
set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%LOCALAPPDATA%\Programs\MinGit\mingw64\bin;%PATH%"
title ApexCraft Studios - Push to GitHub

echo ===================================================================
echo               ApexCraft Studios - Push to GitHub
echo ===================================================================
echo.
echo Target Repository: https://github.com/Ramsharma989/APEX-CRAFT.git
echo.

git remote remove origin >nul 2>&1
git remote add origin https://github.com/Ramsharma989/APEX-CRAFT.git

echo [1/3] Adding all files and creating commit...
git add .
git commit -m "Publish ApexCraft Studios & Demo Websites" >nul 2>&1

echo [2/3] Setting branch to main...
git branch -M main

echo [3/3] Pushing to GitHub...
echo (If prompted, click 'Sign in with your browser' to authenticate)
echo.
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================================
    echo                     SUCCESSFULLY PUSHED!
    echo ===================================================================
    echo.
    echo Your website files are now on GitHub!
    echo.
    echo NEXT STEP: Turn on GitHub Pages (takes 30 seconds):
    echo 1. Open: https://github.com/Ramsharma989/APEX-CRAFT/settings/pages
    echo 2. Under 'Build and deployment' -> 'Branch', select: main
    echo 3. Folder: / (root)
    echo 4. Click 'Save'
    echo.
    echo In ~60 seconds, your website will be LIVE at:
    echo   https://Ramsharma989.github.io/APEX-CRAFT/
    echo ===================================================================
) else (
    echo.
    echo ===================================================================
    echo [NOTE] If you saw an authentication error:
    echo 1. Make sure you are logged into GitHub as 'Ramsharma989'.
    echo 2. You can also generate a Personal Access Token at:
    echo    https://github.com/settings/tokens
    echo ===================================================================
)

echo.
pause
