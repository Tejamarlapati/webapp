import { Request, Response, NextFunction } from 'express'
import auth from 'basic-auth'
import logger from './logger'
import crypto from './crypto'
import User from '../models/user.model'
import { setUserIdInContext } from './context'
import { StatusCodes } from 'http-status-codes'

export const jsonErrorHandler = () => {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!err) {
      return next()
    }
    logger.error(`Error: ${err.message} Request body: ${req.body}`)
    res.status(StatusCodes.BAD_REQUEST).send()
  }
}

export const noCachePragma = () => {
  return (_: Request, res: Response, next: NextFunction) => {
    res.setHeader('Pragma', 'no-cache')
    next()
  }
}

export const noQueryParams = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const areQueryParamsPresent = req.query && Object.keys(req.query).length > 0
    if (areQueryParamsPresent) {
      res.status(StatusCodes.BAD_REQUEST).send()
      return
    }
    next()
  }
}

export const authorized = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Checking if user is authorized')
    const result = auth(req)
    if (!result) {
      logger.info('User is not authorized')
      res.status(401).send()
      return
    }

    const username = result.name
    const user = await User.scope(['withPassword']).findOne({ where: { username } })
    if (!user) {
      logger.info(`Cannot find user. User: ${result?.name}`)
      res.status(401).send()
      return
    }

    const isPasswordMatch = await crypto.comparePassword(result!.pass, user!.password)
    if (!isPasswordMatch) {
      logger.info(`Password mismatch. User: ${result?.name}`)
      res.status(401).send()
      return
    }

    setUserIdInContext(user!.id)
    next()
  }
}
