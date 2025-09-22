@echo off
REM Email Service Setup Script for Windows
REM This script sets up and runs the custom email service

echo 🔧 Setting up Custom Email Service...

REM Navigate to email-service directory
cd email-service

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
) else (
    echo ✅ Dependencies already installed
)

REM Check email configuration
echo ⚙️ Checking email configuration...
findstr "SMTP_USER=your-email@gmail.com" ..\.env >nul
if %errorlevel% == 0 (
    echo ⚠️  Please configure your email settings in the .env file:
    echo    - SMTP_USER: Your Gmail address
    echo    - SMTP_PASSWORD: Your Gmail app password
    echo    - For Gmail, you need to:
    echo      1. Enable 2-factor authentication
    echo      2. Generate an app password
    echo      3. Use that app password ^(not your regular password^)
    echo.
    echo Press Enter when you've updated the .env file...
    pause >nul
)

echo 🚀 Starting email service...
npm run dev