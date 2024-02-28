import { Options, Sequelize } from 'sequelize'
import * as pg from 'pg'
import env from './env'
import logger from './logger'

/**
 * Interface for Database class
 */
export interface IDatabase {
  /**
   * Get the database connection
   * @returns the sequelize database connection
   */
  getDatabaseConnection(): Sequelize

  /**
   * Close the database connection
   */
  closeDatabaseConnection(): Promise<void>

  /**
   * Sync the database
   */
  syncDatabase(): Promise<boolean>

  /**
   * Update the connection string
   * @param connectionString the connection string to update
   */
  updateConnectionString(connectionString?: string): void
}

/**
 * The Database class
 */
class Database implements IDatabase {
  private _sequelize: Sequelize
  private _options: Options | undefined = undefined

  constructor() {
    this.updateConnectionString()
  }

  async syncDatabase(): Promise<boolean> {
    try {
      await this._sequelize.authenticate()
      await this._sequelize.sync()
      return true
    } catch (error) {
      logger.error(`Error while syncing database. Error: ${error}`)
      return false
    }
  }

  getDatabaseConnection(): Sequelize {
    return this._sequelize
  }

  closeDatabaseConnection(): Promise<void> {
    return this._sequelize.close()
  }

  updateConnectionString(connectionString?: string): void {
    connectionString ??= getConnectionString()
    this._options = getSequelizeOptions(connectionString)
    this._sequelize = new Sequelize(connectionString, this._options)
  }
}

/**
 * Get the sequelize options
 * @param connectionString the connection string to get the options for
 * @returns the sequelize options
 */
const getSequelizeOptions = (connectionString: string): Options | undefined => {
  const isSecure = env.getOrDefault('SSL', 'false') === 'true'
  const defaultTimeout = parseInt(env.getOrDefault('DB_TIMEOUT', '30000'))
  if (connectionString.includes('postgres://')) {
    return {
      dialect: 'postgres',
      dialectModule: pg,
      dialectOptions: {
        ssl: isSecure && { require: true, rejectUnauthorized: false },
        connectionTimeoutMillis: defaultTimeout,
        requestTimeout: defaultTimeout,
        connectionTimeout: defaultTimeout
      },
      pool: {
        max: 10,
        min: 0,
        acquire: defaultTimeout
      }
    }
  }
  return undefined
}

/**
 * Get the connection string from environment variables
 * @returns the connection string
 */
const getConnectionString = (): string => {
  const connectionString = env.getOrDefault('DB_CONN_STRING', '')
  if (connectionString !== '') return connectionString

  // Defaulting to Postgres connection string from env variables
  return getPostgresConnectionString()
}

/**
 * Read the environment variables and get the Postgres connection string
 * @returns the Postgres connection string
 */
const getPostgresConnectionString = (): string => {
  const host = env.getOrDefault('DB_HOST', 'localhost')
  const port = env.getOrDefault('DB_PORT', '5432')
  const user = env.getOrDefault('DB_USER', 'cloud')
  const password = env.getOrDefault('DB_PASSWORD', 'cloud')
  const dbname = env.getOrDefault('DB_NAME', 'Cloud')
  return `postgres://${user}:${password}@${host}:${port}/${dbname}`
}

env.loadEnv()
const database: IDatabase = new Database()
export default database
