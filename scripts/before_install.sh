#!/bin/bash

# This script runs before the application is installed

# Download the application package from S3
aws s3 cp s3://nokofio/nokofio-frontend.zip /tmp/nokofio-frontend.zip

# Unzip the application package
unzip -o /tmp/nokofio-frontend.zip -d /tmp
