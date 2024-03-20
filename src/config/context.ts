import * as expressHttpContext from 'express-http-context'

/**
 * Get the user id from the context
 * @returns the user id from the context
 */
export const getUserIdFromContext = () => {
  return expressHttpContext.get('userid') ?? null
}

/**
 * Set the user id in the context
 * @param userId the user id to set in the context
 */
export const setUserIdInContext = (userId: string) => {
  expressHttpContext.set('userid', userId)
}

/**
 * Set the request id in the context
 * @param requestId the request id to set in the context
 */
export const setRequestIdInContext = (requestId: string) => {
  expressHttpContext.set('requestId', requestId)
}

/**
 * Get the request id from the context
 * @returns the request id from the context
 */
export const getRequestIdFromContext = () => {
  return expressHttpContext.get('requestId') ?? null
}

/**
 * Interface for the context
 */
export interface IContext {
  getUserIdFromContext: () => string
  setUserIdInContext: (userId: string) => void
  setRequestIdInContext: (requestId: string) => void
  getRequestIdFromContext: () => string
}

/**
 * The context
 */
const httpContext: IContext = {
  getUserIdFromContext,
  setUserIdInContext,
  setRequestIdInContext,
  getRequestIdFromContext
}

export default httpContext
