#!/bin/bash

# This script runs after the application is installed

# Move the application files to the target directory
cp -r /tmp/* /home/ec2-user/nokofio-frontend/

# Set ownership and permissions
chown -R ec2-user:ec2-user /home/ec2-user/nokofio-frontend/
chmod -R 777 /home/ec2-user/nokofio-frontend/

# Clean up temporary files
rm -rf /tmp/nokofio-frontend.zip /tmp/* 

# Install Node.js dependencies
cd /home/ec2-user/nokofio-frontend/
npm install
npm run build

# start the application
sudo -u ec2-user pm2 start npm --name "nokofio-frontend" -- start -f

