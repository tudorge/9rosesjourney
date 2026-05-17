@echo off
setlocal

if "%~1"=="" (
    echo Usage: make "commit message"
    exit /b 1
)

set "message=%*"
set "message=%message:"=%"
git add .
git commit -m "%*"
git push
@echo .
@echo Push complete!
