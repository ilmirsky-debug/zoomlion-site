#!/bin/bash

set -e

echo "========================="
echo " Zoomlion Deploy"
echo "========================="

git pull origin main

echo ""
echo "Building..."
npm run build

echo ""
echo "Restarting..."

pm2 restart zoomlion-site

echo ""
echo "Done!"
