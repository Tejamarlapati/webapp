import database from '../config/database'

const syncDatabase = async () => {
  await database.syncDatabase()
  console.log('Database synced')
}

syncDatabase()
