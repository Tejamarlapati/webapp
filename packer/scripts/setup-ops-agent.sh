#!/bin/bash

# Installs Google Cloud Ops Agent
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

# Stop the Ops Agent
sudo systemctl stop google-cloud-ops-agent

# Printing the status of the Ops Agent
sudo systemctl status google-cloud-ops-agent"*"

# Copy the config file
cp -f /tmp/setup/config.yaml /etc/google-cloud-ops-agent/config.yaml
