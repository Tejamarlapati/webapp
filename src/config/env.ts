import * as dotenv from 'dotenv'

/**
 * Load environment variables from .env file
 */
const loadEnv = () => {
  dotenv.config()
}

/**
 * Get the environment variable or return the default value
 * @param key the key of the environment variable
 * @param defaultValue default value to return if the environment variable is not set
 * @returns value of the environment variable or the default value
 */
const getOrDefault = (key: string, defaultValue: string): string => {
  if (process.env[key]) {
    return process.env[key] as string
  }
  return defaultValue
}

/**
 * Interface for the environment variables
 */
const env = {
  loadEnv,
  getOrDefault
}

export default env
