import express from 'express'
import cors from 'cors'
import * as httpContext from 'express-http-context'
import helmet from 'helmet'

import env from './config/env'
import routes from './routes/index'
import logger from './config/logger'
import database from './config/database'
import { jsonErrorHandler } from './config/middleware'

// Setup .env file
env.loadEnv()

// Graceful shutdown
const shutdown = async () => {
  await database.closeDatabaseConnection().catch((error) => {
    logger.error(`Error while closing database connection. Error: ${error}`)
  })
  server.close(() => {
    logger.info('Server closed')
  })
}

// Setup Express Server
const port = env.getOrDefault('PORT', '8080')
const app = express()

// Setup http context
app.use(httpContext.middleware)

// Setup Express Middlewares
app.use(express.json())
app.use(jsonErrorHandler())
app.use(express.urlencoded({ extended: true }))
app.use(express.text({ type: 'text/*' }))
app.use(
  cors({
    optionsSuccessStatus: 405
  })
)
app.use(helmet.noSniff())

// Setup routes
routes(app)

// Express Server
const server = app.listen(port, async () => {
  const result = await database.syncDatabase()
  logger.info(`Database sync result: ${result}`)
  logger.info(`Server listening on port ${port}`)
})

// Handling Graceful shutdown
process.on('SIGTERM', () => shutdown())
process.on('SIGKILL', () => shutdown())

export default app
