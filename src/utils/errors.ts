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

export class NoContentError extends HttpStatusError {
  constructor(message: string) {
    super(message, StatusCodes.NO_CONTENT)
    this.name = 'NoContentError'
  }
}

export class NotFoundError extends HttpStatusError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends HttpStatusError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED)
    this.name = 'UnauthorizedError'
  }
}

export class ValidationError extends HttpStatusError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST)
    this.name = 'ValidationError'
  }
}

export class InternalServerError extends HttpStatusError {
  constructor(message: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR)
    this.name = 'InternalServerError'
  }
}

const errors = {
  HttpStatusError: (message: string, statusCode: number) => new HttpStatusError(message, statusCode),
  NoContentError: (message: string) => new NoContentError(message),
  ValidationError: (message: string) => new ValidationError(message),
  UnauthorizedError: (message: string) => new UnauthorizedError(message),
  NotFoundError: (message: string) => new NotFoundError(message),
  InternalServerError: (message: string) => new InternalServerError(message)
}

export default errors
