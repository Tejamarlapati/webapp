import { StatusCodes } from 'http-status-codes'
import { HttpStatusError } from './errors'
import { Result, ResultError } from './result'
import { Response } from 'express'

/**
 * Handle error response
 * @param res Response object
 * @param data error data
 */
const handleErrorResponse = <E extends Error>(res: Response, data: ResultError<E>) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  if (data && data.error instanceof HttpStatusError) {
    statusCode = data.error.statusCode

    // Special case to handle bad request errors
    if (statusCode === StatusCodes.BAD_REQUEST && !data.error.ignoreMessage) {
      res.status(statusCode).json({ error: data.error.message })
      return
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
