# Github Actions - Workflows

This project uses GitHub Actions for continuous integration (CI) and continuous deployment (CD). The workflows are defined in the `.github/workflows` directory.

## Secrets

The workflows use the following secrets:

- `GCP_CREDENTIALS`: The credentials for Google Cloud Platform.
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

These secrets are stored in the GitHub repository and are encrypted. They are only accessible to the workflows running on the same repository.
`GCP_BUCKET_NAME` - Used to push serverless code to GCP bucket

## Workflows

As of now, the following workflows are being executed:

1. `build.yml` - Pipeline to build the webapp
2. `test.yml` - Pipeline to execute integration tests on webapp
3. `packer-validate.yml` - Pipeline to validate the packer file
4. `packer-image.yml` - Pipeline to create a custom machine image (GCP) using packer
