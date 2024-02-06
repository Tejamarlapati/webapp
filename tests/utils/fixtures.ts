import database from '../../src/config/database'
import { createDefaultUsers } from './user-utils'

export async function mochaGlobalSetup() {
  try {
    console.log('Setting up database')
    database.getDatabaseConnection().sync()
    createDefaultUsers()
  } catch {}
}
