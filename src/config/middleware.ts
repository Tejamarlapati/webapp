import { Request, Response, NextFunction } from 'express'

export const noCachePragma = () => {
  return (_: Request, res: Response, next: NextFunction) => {
    res.setHeader('Pragma', 'no-cache')
    next()
  }
}
