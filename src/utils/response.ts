import { StatusCodes } from 'http-status-codes'
import { HttpStatusError } from './errors'
import { Result, ResultError } from './result'
import { Response } from 'express'

export const getStatusCode = <E extends Error>(data: ResultError<E>) => {
  if (data && data.error instanceof HttpStatusError) {
    return data.error.statusCode
  }
  return StatusCodes.INTERNAL_SERVER_ERROR
}

const handleErrorResponse = <E extends Error>(res: Response, data: ResultError<E>) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  if (data && data.error instanceof HttpStatusError) {
    statusCode = data.error.statusCode

    // Special case to handle bad request errors
    if (statusCode === StatusCodes.BAD_REQUEST) {
      res.status(statusCode).json({ error: data.error.message })
      return
    }
  }
  res.status(statusCode).send()
}
// .status(getStatusCode(data)).json({ error: data.error.message }
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
