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

export const handleResponse = <T, E extends Error>(
  res: Response,
  data: Result<T, E>,
  statusCode: number = StatusCodes.OK
) => {
  if (data.ok) {
    res.status(statusCode).json(data.value)
  } else {
    res.status(getStatusCode(data)).send()
  }
}
