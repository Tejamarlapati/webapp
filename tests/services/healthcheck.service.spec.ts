import chai from 'chai'
import healthCheckService from '../../src/services/healthcheck.service'
import database from '../../src/config/database'
import { setEnvironmentVariables, TEST_DB_IN_MEMORY_CONNECTION_STRING } from '../utils/env-utils'

chai.should()

describe('Health Check Service Tests', function () {
  this.beforeAll(() => {
    setEnvironmentVariables(TEST_DB_IN_MEMORY_CONNECTION_STRING)
    database.getDatabaseConnection().sync()
  })

  this.beforeEach(() => {
    database.reloadConnectionString()
  })

  it('should return failure for database health check', function (done) {
    healthCheckService.databaseHealthCheck()
    done()
  })

  it('should return success for database health check', function (done) {
    healthCheckService.databaseHealthCheck()
    done()
  })

  // Disconnect the database after all tests
  this.afterAll(async () => {
    await database.closeDatabaseConnection()
  })
})
