import { Application } from 'express'
import healthCheckController from '../controller/healthcheck.controller'
import { StatusCodes } from 'http-status-codes'
import nocache from 'nocache'
import { noCachePragma } from '../config/middleware'
import userController from '../controller/user.controller'

const routes = (app: Application) => {
  // Health Check route
  app.use('/healthz', nocache(), noCachePragma(), healthCheckController)

  // User routes
  app.use('/v1/user', userController)

  // Default fallback route
  app.route('*').all((_, res) => {
    res.status(StatusCodes.NOT_FOUND).send()
  })
}

export default routes
