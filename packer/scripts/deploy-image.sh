#!/bin/bash -e

updated_image_name=${1}
echo "Image name used for updation: $updated_image_name"

# Find the image
image_self_link=$(gcloud compute images describe "$updated_image_name" --format="value(selfLink)")
if [ -z "$image_self_link" ]; then
    echo "Image not found"
    exit 1
fi

# Find the instance group manager
group_manager=$(gcloud compute backend-services list --format="value(backends[0].group)" --limit=1)
if [ -z "$group_manager" ]; then
    echo "No instance group found"
    exit 1
fi

# Fetching region and instance template
group_manager_name="${group_manager##*/}"
region_url=$(gcloud compute instance-groups describe "$group_manager" --format="value(region)")
region="${region_url##*/}"

echo "Group Manager Name: $group_manager_name"
echo "Region: $region"

instance_template_used_by_group=$(gcloud compute instance-groups managed describe "$group_manager_name" --region "$region_url" --format="value(instanceTemplate)")
existing_template_name=$(gcloud compute instance-templates describe "$instance_template_used_by_group" --region="$region_url" --format="value(name)")

# Validate if the template exists
if [ -z "$existing_template_name" ]; then
    echo "Instance template not found"
    exit 1
fi

echo "Existing Instance Template Name: $existing_template_name"

# Getting VM instance information
existing_vm_instance_json=$(gcloud compute instances list --filter="metadata.items['instance-template']~'$existing_template_name'" --format="json" --limit=1)

# Fetching region, instance name and zone
existing_vm_instance_name=$(printf "%s" "$existing_vm_instance_json" | jq -r '.[0].name')
existing_vm_instance_zone=$(printf "%s" "$existing_vm_instance_json" | jq -r '.[0].zone')
existing_vm_boot_disk_name=$(printf "%s" "$existing_vm_instance_json" | jq -r '.[0].disks[0].deviceName')

echo "Retrieved information from source VM: $existing_vm_instance_name from zone: $existing_vm_instance_zone"

# New instance template name
updated_template_name="${existing_template_name%-*}-$(date +'%Y%m%d%H%M%S')"


echo "Creating new Instance Template. Name: $updated_template_name"

# Create a new instance template
gcloud compute instance-templates create "$updated_template_name" \
    --source-instance "$existing_vm_instance_name" \
    --source-instance-zone "$existing_vm_instance_zone" \
    --instance-template-region "${region}" \
    --region "$region" \
    --configure-disk=device-name="$existing_vm_boot_disk_name",instantiate-from=custom-image,custom-image="$image_self_link" \

updated_instance_template_self_link=$(gcloud compute instance-templates describe "$updated_template_name" --region="$region_url" --format="value(selfLink)")

if [ -z "$updated_instance_template_self_link" ]; then
    echo "Instance template not created"
    exit 1
fi

echo "New Instance Template created succesfully: $updated_template_name"

echo "Executing rolling update for instance group manager: $group_manager_name with new instance template: $updated_instance_template_self_link"
gcloud compute instance-groups managed rolling-action start-update "$group_manager_name" --region "$region_url" \
    --version="template=$updated_instance_template_self_link"
echo "Updated the instance group manager: $group_manager_name"

# Wait for the update to complete
echo "Waiting for the update to complete. Max timeout: 20 minutes"
gcloud compute instance-groups managed wait-until --stable "$group_manager_name" --region "$region_url" \
    --timeout 60
echo "Update completed successfully"
