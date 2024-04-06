# Github Actions - Workflows

This project uses GitHub Actions for continuous integration (CI) and continuous deployment (CD). The workflows are defined in the `.github/workflows` directory.

## Secrets

The workflows use the following secrets:

- `GCP_CREDENTIALS`: The credentials for Google Cloud Platform to build Packer Image. [(IAM roles needed)](https://github.com/hashicorp/packer-plugin-googlecompute/tree/main/docs#running-on-google-cloud)
- `GCP_DEPLOY_CREDENTIALS`: The credentials for Google Cloud Platform to deploy the web application.[(IAM roles needed)](#iam-permissions-for-deploying)
- `GCP_PROJECT_ID`: The project ID for the Google Cloud Platform project.

- `WEBAPP_PORT`: The port number for the web application.
- `DB_CONN_STRING`: The connection string for the database.
- `INTEGRATION_TEST_DB_NAME`: The name of the database used for integration tests.
- `INTEGRATION_TEST_DB_USER`: The username for the database used for integration tests.
- `INTEGRATION_TEST_DB_PASSWORD`: The password for the database used for integration tests.

** Update the following fields to deploy the packer image to a different project on GCP

- `GCP_CREDENTIALS`
- `GCP_PROJECT_ID`
- `GCP_BUCKET_NAME`
- `GCP_DEPLOY_CREDENTIALS`

These secrets are stored in the GitHub repository and are encrypted. They are only accessible to the workflows running on the same repository.
`GCP_BUCKET_NAME` - Used to push serverless code to GCP bucket

## Workflows

As of now, the following workflows are being executed:

1. `build.yml` - Pipeline to build the webapp
2. `test.yml` - Pipeline to execute integration tests on webapp
3. `packer-validate.yml` - Pipeline to validate the packer file
4. `packer-image.yml` - Pipeline to create and deploy a custom machine image (GCP) using packer & gcloud cli

## IAM permissions for deploying


The following IAM permissions are needed for the service account to deploy the latest image to GCP:

- `roles/compute.instanceAdmin.v1`
- `roles/compute.loadBalancerAdmin`

You can use the following commands to create a service account and assign the necessary roles

```bash
gcp_project=YOUR_GCP_PROJECT # Replace with your GCP project ID

service_account_email=deployer@$gcp_project.iam.gserviceaccount.com
service_account_member=serviceAccount:$service_account_email

gcloud iam service-accounts create deployer \
    --project $gcp_project \
    --description="Service account to deploy latest image" \
    --display-name="Deployer Service Account" 

gcloud projects add-iam-policy-binding $gcp_project \
    --member=$service_account_member \
    --role=roles/compute.instanceAdmin.v1

gcloud projects add-iam-policy-binding $gcp_project \
    --member=$service_account_member \
    --role=roles/compute.loadBalancerAdmin
```
