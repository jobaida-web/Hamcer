#!/bin/bash

# Hamcer Deployment Script
# This script builds and deploys your application to Firebase Hosting

echo "🚀 Starting Hamcer deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Installing..."
    npm install -g firebase-tools
fi

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful! 🎉"
    echo "Your application is now live!"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi