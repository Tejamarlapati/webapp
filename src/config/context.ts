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
 * Interface for the context
 */
export interface IContext {
  getUserIdFromContext: () => string
  setUserIdInContext: (userId: string) => void
}

/**
 * The context
 */
const httpContext: IContext = {
  getUserIdFromContext,
  setUserIdInContext
}

export default httpContext
