#!/bin/bash

# Copy the webapp(setup & config) to appropriate locations
# Usage: setup-webapp.sh [username] [temp_webapp_dir] [webapp_dir]
#   username: Username to launch the application with
#   group: Group to launch the application with
#   webapp_zip_file: Zip file where the application has to be copied from
#   webapp_config_file: Configuration file for the application
#   webapp_dir: Hosting directory of the application
#   webapp_log_dir: Log directory of the application
# If no arguments are provided, default username is used
#   Default username: csye6225
#   Default group: csye6225
#   Default webapp_zip_file: /tmp/setup/webapp
#   Default webapp_config_file: /tmp/setup/.env
#   Default webapp_dir: /opt/webapp/
#   Default webapp_log_dir: /var/log/webapp

# Check if sudo is available
if ! sudo -v >/dev/null 2>&1; then
   echo "Installation requires sudo permissions" 
   exit 1
fi

echo "Setting up webapp"

username=${1:-csye6225}
group=${2:-csye6225}
webapp_zip_file=${3:-/tmp/setup/webapp}
webapp_config_file=${4:-/tmp/setup/.env}
webapp_dir=${5:-/opt/webapp/}
webapp_log_dir=${6:-/var/log/webapp}

echo "Copying webapp & config from $webapp_zip_file to $webapp_dir and setting permissions"

mkdir -p "$webapp_dir"
unzip -q -o "$webapp_zip_file" -d "$webapp_dir"

# Copy the configuration file if it exists
if [ -f "$webapp_config_file" ]; then
   cp -f "$webapp_config_file" "$webapp_dir"/dist/
fi

npm install --prefix "$webapp_dir"/dist/
chown -R "$username":"$group" "$webapp_dir"
chmod -R 755 "$webapp_dir"


# Create the log folder
mkdir -p "$webapp_log_dir"

# Set the permissions for the log folder
chown -R "$username":"$group" "$webapp_log_dir"
chmod -R 744 "$webapp_log_dir"

echo "Webapp setup complete"
