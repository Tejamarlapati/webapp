import express, { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import userService from '../services/user.service'
import User from '../models/user.model'
import { handleResponse } from '../utils/response'
import { authorized, noQueryParams } from '../config/middleware'
import errors from '../utils/errors'

/**
 * The user controller
 */
const userController: Router = express.Router()

/**
 * The user self controller
 */
const userSelfController: Router = express.Router()

// "v1/user" routes
userController
  // Authorized self routes
  .use('/self', userSelfController)
  .head('/', (_, res) => {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).send()
  })
  .post('/', noQueryParams(), async (req, res) => {
    // Validating request body
    if (Object.keys(req.body).length === 0) {
      handleResponse(res, errors.validationError('Request body cannot be empty'))
      return
    }

    // Creating user
    const user = req.body as User
    const response = await userService.createUser(user)
    handleResponse(res, response, StatusCodes.CREATED)
  })
  .all('/', (_, res) => {
    handleResponse(res, errors.methodNotAllowedError())
  })

// "v1/user/self" routes
userSelfController
  .head('/', (_, res) => {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).send()
  })
  .get('/', authorized(), noQueryParams(), async (req, res) => {
    if (Object.keys(req.body).length > 0) {
      handleResponse(res, errors.validationError('Request body should be empty'))
      return
    }

    const response = await userService.getUser()
    handleResponse(res, response)
  })
  .put('/', authorized(), noQueryParams(), async (req, res) => {
    // Validating request body
    if (Object.keys(req.body).length === 0) {
      handleResponse(res, errors.validationError('Request body cannot be empty'))
      return
    }

    // Updating user
    const user = req.body as User
    const response = await userService.updateUser(user)
    handleResponse(res, response)
  })
  .all('/', (_, res) => {
    handleResponse(res, errors.methodNotAllowedError())
  })

export default userController
