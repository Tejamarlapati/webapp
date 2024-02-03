import express from 'express'
import cors from 'cors'
import env from './config/env'
import routes from './routes/index'
import helmet from 'helmet'
import logger from './config/logger'

// Setup .env file
env.loadEnv()

// Setup Express Server
const port = env.getOrDefault('PORT', '8080')
const app = express()

// Setup Express Middlewares
app.use(express.text({ type: '*/*' }))
app.use(cors())
app.use(helmet.noSniff())

// Setup routes
routes(app)

// Express Server
app.listen(port, () => {
  logger.info(`Server listening on port ${port}`)
})

export default app
