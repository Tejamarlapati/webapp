import chai from 'chai'
import healthCheckService from '../../src/services/healthcheck.service'

chai.should()

describe('Health Check Service Tests', function () {
  it('should return success for database health check', async () => {
    const result = await healthCheckService.databaseHealthCheck()
    result.should.be.true
  })
})
