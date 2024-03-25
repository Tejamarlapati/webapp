import Email from '../models/email.model'
import User from '../models/user.model'

const syncDatabase = async () => {
  User.sync()
  Email.sync()
  console.log('Database synced')
}

;(async () => {
  await syncDatabase()
})()
