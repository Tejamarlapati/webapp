import database from '../../src/config/database'

export async function mochaGlobalSetup() {
  database.getDatabaseConnection().sync()
}
