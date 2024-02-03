import chai from 'chai'
import database from '../../src/config/database'
import {
  TEST_DB_CONNECTION_STRING,
  TEST_DB_ERROR_CONNECTION_STRING,
  TEST_DB_IN_MEMORY_CONNECTION_STRING,
  TEST_DB_PROPERTIES,
  resetEnvironmentVariables,
  setEnvironmentVariables
} from '../utils/env-utils'

chai.should()

describe('Health Check Service Tests', function () {
  this.beforeEach(() => {
    resetEnvironmentVariables(TEST_DB_CONNECTION_STRING)
    resetEnvironmentVariables(TEST_DB_PROPERTIES)
  })

  it('should throw error on invalid connection string', () => {
    // Arrange
    setEnvironmentVariables(TEST_DB_ERROR_CONNECTION_STRING)

    // Act
    try {
      database.reloadConnectionString()

      // Assert
      chai.assert.fail('Should have thrown error')
    } catch (_) {}
  })

  it('should have defaults for connection string', (done) => {
    // Act
    const sequelize = database.getDatabaseConnection()

    // Assert
    chai.expect(sequelize.config.host).equal('localhost')
    chai.expect(sequelize.config.port).equal('5432')
    sequelize.config.database.should.equal('Cloud')
    sequelize.config.username.should.equal('cloud')
    chai.expect(sequelize.config.password).equal('cloud')
    done()
  })

  it('should pick env variable DB_CONN_STRING for connection string', (done) => {
    // Arrange
    setEnvironmentVariables(TEST_DB_CONNECTION_STRING)
    database.reloadConnectionString()

    // Act
    const sequelize = database.getDatabaseConnection()

    // Assert
    chai.expect(sequelize.config.host).equal('localhost')
    chai.expect(sequelize.config.port).equal('5432')
    sequelize.config.database.should.equal('Test')
    sequelize.config.username.should.equal('test')
    chai.expect(sequelize.config.password).equal('test')
    done()
  })

  it('should pick env variables for connection string', (done) => {
    // Arrange
    setEnvironmentVariables(TEST_DB_PROPERTIES)
    database.reloadConnectionString()

    // Act
    const sequelize = database.getDatabaseConnection()

    // Assert
    chai.expect(sequelize.config.host).equal('localhost')
    chai.expect(sequelize.config.port).equal('5432')
    sequelize.config.database.should.equal('Cloud')
    sequelize.config.username.should.equal('cloud')
    chai.expect(sequelize.config.password).equal('cloud')
    done()
  })

  it('should priortize the env variable DB_CONN_STRING for connection string', (done) => {
    // Arrange
    setEnvironmentVariables(TEST_DB_CONNECTION_STRING)
    setEnvironmentVariables(TEST_DB_PROPERTIES)
    database.reloadConnectionString()

    // Act
    const sequelize = database.getDatabaseConnection()

    // Assert
    chai.expect(sequelize.config.host).equal('localhost')
    chai.expect(sequelize.config.port).equal('5432')
    sequelize.config.database.should.equal('Test')
    sequelize.config.username.should.equal('test')
    done()
  })

  it('should successfully establish sequelize connection', async () => {
    // Arrange
    setEnvironmentVariables(TEST_DB_IN_MEMORY_CONNECTION_STRING)
    database.reloadConnectionString()

    // Act
    const sequelize = database.getDatabaseConnection()

    // Assert
    try {
      await sequelize.authenticate()
    } catch (err) {
      chai.assert.fail(err)
    }
  })

  it('should successfully close sequelize connection', async () => {
    // Arrange
    setEnvironmentVariables(TEST_DB_IN_MEMORY_CONNECTION_STRING)
    database.reloadConnectionString()

    // Act
    const sequelize = database.getDatabaseConnection()
    await sequelize.authenticate()

    // Assert
    try {
      await database.closeDatabaseConnection()
    } catch (err) {
      chai.assert.fail(err)
    }
  })

  this.afterAll(() => {
    resetEnvironmentVariables(TEST_DB_CONNECTION_STRING)
    resetEnvironmentVariables(TEST_DB_PROPERTIES)
  })
})
