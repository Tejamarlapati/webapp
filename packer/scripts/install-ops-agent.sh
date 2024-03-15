#!/bin/bash

# Installs Google Cloud Ops Agent
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

# Printing the status of the Ops Agent
sudo systemctl status google-cloud-ops-agent"*"
