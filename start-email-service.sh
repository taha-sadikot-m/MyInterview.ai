#!/bin/bash

# Email Service Setup Script
# This script sets up and runs the custom email service

echo "🔧 Setting up Custom Email Service..."

# Navigate to email-service directory
cd email-service

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if .env file has email configuration
echo "⚙️ Checking email configuration..."

if grep -q "SMTP_USER=your-email@gmail.com" ../.env; then
    echo "⚠️  Please configure your email settings in the .env file:"
    echo "   - SMTP_USER: Your Gmail address"
    echo "   - SMTP_PASSWORD: Your Gmail app password"
    echo "   - For Gmail, you need to:"
    echo "     1. Enable 2-factor authentication"
    echo "     2. Generate an app password"
    echo "     3. Use that app password (not your regular password)"
    echo ""
    echo "Press Enter when you've updated the .env file..."
    read -r
fi

echo "🚀 Starting email service..."
npm run dev