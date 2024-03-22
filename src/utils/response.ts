import { StatusCodes } from 'http-status-codes'
import { HttpStatusError } from './errors'
import { Result, ResultError } from './result'
import { Response } from 'express'
import logger from '../config/logger'

const getErrorMessage = (error: Error) => {
  return error.message ? ` Error: ${error.message}` : ''
}

/**
 * Handle error response
 * @param res Response object
 * @param data error data
 */
const handleErrorResponse = <E extends Error>(res: Response, data: ResultError<E>) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  if (data && data.error instanceof HttpStatusError) {
    statusCode = data.error.statusCode

    if (statusCode == StatusCodes.METHOD_NOT_ALLOWED) {
      logger.warn(`Status Code: ${statusCode} Trying to invoke not allowed method`)
    } else {
      logger.info(`Status Code: ${statusCode}${getErrorMessage(data.error)}`)
    }
    if (!data.error.ignoreMessage) {
      // Special case to handle Internal Server Error and Bad Request
      if (statusCode === StatusCodes.BAD_REQUEST || statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
        res.status(statusCode).json({ error: data.error.message })
        return
      }
    }
  }
  res.status(statusCode).send()
}

/**
 * Handles valid and error response
 * @param res Response object
 * @param data data to be sent
 * @param statusCode non-default status code to be sent
 */
export const handleResponse = <T, E extends Error>(
  res: Response,
  data: Result<T, E>,
  statusCode: number = StatusCodes.OK
) => {
  if (data.ok) {
    res.status(statusCode).json(data.value)
  } else {
    handleErrorResponse(res, data)
  }
}
