import express, { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import userService from '../services/user.service'
import User from '../models/user.model'
import { handleResponse } from '../utils/response'
import { authorized, noQueryParams } from '../config/middleware'

const userController: Router = express.Router()
const userSelfController: Router = express.Router()

// "v1/user" routes
userController
  // Authorized self routes
  .use('/self', userSelfController)
  .post('/', noQueryParams(), async (req, res) => {
    // Validating request body
    if (Object.keys(req.body).length === 0) {
      res.status(StatusCodes.BAD_REQUEST).send()
      return
    }

    // Creating user
    const user = req.body as User
    const response = await userService.createUser(user)
    handleResponse(res, response, StatusCodes.CREATED)
  })
  .all('/', (_, res) => {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).send()
  })

// "v1/user/self" routes
userSelfController
  .get('/', authorized(), noQueryParams(), async (_, res) => {
    const response = await userService.getUser()
    handleResponse(res, response)
  })
  .put('/', authorized(), noQueryParams(), async (req, res) => {
    // Validating request body
    if (Object.keys(req.body).length === 0) {
      res.status(StatusCodes.BAD_REQUEST).send()
      return
    }

    // Updating user
    const user = req.body as User
    const response = await userService.updateUser(user)
    handleResponse(res, response)
  })
  .all('/', (_, res) => {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).send()
  })

export default userController
