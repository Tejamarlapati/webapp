import { Request, Response, NextFunction } from 'express'
import auth from 'basic-auth'
import logger from './logger'
import crypto from './crypto'
import errors from '../utils/errors'
import User from '../models/user.model'
import { setUserIdInContext, setRequestIdInContext } from './context'
import { handleResponse } from '../utils/response'
import env from './env'

const hostname = env.getHostname()

export const requestId = () => {
  return (_: Request, res: Response, next: NextFunction) => {
    const requestId = crypto.generateRandomUUID()
    setRequestIdInContext(requestId)
    res.set('X-Request-Id', requestId)
    res.set('X-Host', hostname)
    next()
  }
}

/**
 * Middleware to handle invalid json request
 * @returns a middleware that logs an error request
 */
export const jsonErrorHandler = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: unknown, _: Request, res: Response, __: NextFunction) => {
    if (err && typeof err === 'object' && 'body' in err) {
      delete err.body
    }
    logger.error('Cannot parse JSON in request body', err)
    handleResponse(res, errors.validationError('Malformed JSON in request body', true))
  }
}

/**
 * Middleware to handle no cache pragma
 * @returns a middleware that sets no cache pragma
 */
export const noCachePragma = () => {
  return (_: Request, res: Response, next: NextFunction) => {
    res.setHeader('Pragma', 'no-cache')
    next()
  }
}

/**
 * Middleware to handle no query params
 * @returns a middleware that checks if the request has no query parameters
 */
export const noQueryParams = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const areQueryParamsPresent = req.query && Object.keys(req.query).length > 0
    if (areQueryParamsPresent) {
      handleResponse(res, errors.validationError('Query parameters are not allowed'))
      return
    }
    next()
  }
}

/**
 * Middleware to handle if the user is authorized
 * @returns a middleware that checks if the user is authorized
 */
export const authorized = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Checking if user is authorized')
    const result = auth(req)
    if (!result) {
      logger.info('User is not authorized')
      handleResponse(res, errors.unAuthorizedError())
      return
    }

    const username = result.name
    const user = await User.scope(['withPassword']).findOne({ where: { username } })
    if (!user) {
      logger.info(`Cannot find user.`)
      handleResponse(res, errors.unAuthorizedError())
      return
    }

    const isPasswordMatch = await crypto.comparePassword(result!.pass, user!.password)
    if (!isPasswordMatch) {
      logger.info(`Password mismatch.`)
      handleResponse(res, errors.unAuthorizedError())
      return
    }

    const isUserVerified = user!.email_verified
    if (!isUserVerified) {
      logger.info(`User is not verified.`)
      handleResponse(res, errors.forbiddenError('User is not verified'))
      return
    }

    setUserIdInContext(user!.id)
    next()
  }
}
