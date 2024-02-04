import { StatusCodes } from 'http-status-codes'
import { ResultError } from './result'

export class HttpStatusError extends Error implements ResultError<HttpStatusError> {
  statusCode: number
  ok: false
  error: this

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.name = 'HttpStatusError'
    this.ok = false
    this.error = this
  }
}

const errors = {
  validationError: (message: string) => new HttpStatusError(message, StatusCodes.BAD_REQUEST),
  notFoundError: (message: string) => new HttpStatusError(message, StatusCodes.NOT_FOUND),
  internalServerError: (message: string) => new HttpStatusError(message, StatusCodes.INTERNAL_SERVER_ERROR)
}

export default errors
