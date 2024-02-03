import * as httpContext from 'express-http-context'

export const getUserIdFromContext = () => {
  return httpContext.get('userid') ?? null
}

export const setUserIdInContext = (userId: string) => {
  if (userId) {
    httpContext.set('userid', userId)
  }
}
