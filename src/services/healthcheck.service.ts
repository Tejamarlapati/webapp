import database, { IDatabase } from '../config/database'
import logger from '../config/logger'

/**
 * Health check service interface
 */
interface IHealthCheckService {
  /**
   * Database health check
   * @returns a promise that resolves to true if the database is healthy, false otherwise
   */
  databaseHealthCheck(): Promise<boolean>
}

class HealthCheckService implements IHealthCheckService {
  private _database: IDatabase

  constructor(database: IDatabase) {
    this._database = database
  }

  async databaseHealthCheck(): Promise<boolean> {
    try {
      logger.info('Checking database health')
      await this._database.getDatabaseConnection().authenticate()
      logger.info('Database health check passed')
      return true
    } catch {
      logger.warn('Database health check failed')
      return false
    }
  }
}

const healthCheckService: IHealthCheckService = new HealthCheckService(database)

export default healthCheckService
