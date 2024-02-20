#!/bin/bash

# Installs dependencies for the application
# Usage: install-dependencies.sh

# Check if sudo is available
if ! sudo -v >/dev/null 2>&1; then
   echo "Installation requires sudo permissions" 
   exit 1
fi

echo "Installing dependencies"

# Update the system
dnf upgrade -y

# Install Unzip if not installed
dnf install -y unzip

# Install Node (v20.x) if not installed
dnf module install -y nodejs:20/common

# Update npm
npm install -g npm@latest

echo "Dependencies installation complete"
