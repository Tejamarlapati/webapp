export const TEST_DB_CONNECTION_STRING: { [key: string]: string } = {
  DB_CONN_STRING: 'postgres://test:test@localhost:5432/Test'
}

export const TEST_DB_ERROR_CONNECTION_STRING: { [key: string]: string } = {
  DB_CONN_STRING: 'error'
}

export const TEST_DB_IN_MEMORY_CONNECTION_STRING: { [key: string]: string } = {
  DB_CONN_STRING: 'sqlite::memory:'
}

export const TEST_DB_PROPERTIES: { [key: string]: string } = {
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USER: 'cloud',
  DB_PASSWORD: 'cloud',
  DB_NAME: 'Cloud'
}

export const setEnvironmentVariables = (variables: { [key: string]: string }) => {
  for (const key in variables) {
    process.env[key] = variables[key]
  }
}

export const resetEnvironmentVariables = (variables: { [key: string]: string }) => {
  for (const key in variables) {
    delete process.env[key]
  }
}
