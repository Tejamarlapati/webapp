import User from '../models/user.model'
import logger from '../config/logger'
import { Ok, Result } from '../utils/result'
import validator from '../utils/validator'
import errors from '../utils/errors'
import crypto, { ICrypto } from '../config/crypto'
import httpContext, { IContext } from '../config/context'

export interface IUserService {
  createUser(user: User): Promise<Result<User, Error>>
  updateUser(user: User): Promise<Result<User, Error>>
  getUser(): Promise<Result<User, Error>>
}

export class UserService implements IUserService {
  crypto: ICrypto
  httpContext: IContext
  constructor(crypto: ICrypto, httpContext: IContext) {
    this.crypto = crypto
    this.httpContext = httpContext
  }

  async createUser(user: User): Promise<Result<User, Error>> {
    try {
      logger.info('Creating user')
      // Validate the user
      const validationError = await this.validateCreateUser(user)
      if (validationError) {
        return errors.validationError(validationError)
      }

      // Check if user with the given email already exists
      const username = user.username
      logger.info('Creating user with username: ' + username)

      const existingUser = await User.findOne({ where: { username } })
      if (existingUser) {
        return errors.validationError('User with this username already exists')
      }

      // Hash the password
      const hashedPassword = await this.crypto.hashPassword(user.password)

      // Create the user model
      const newUser = new User({
        first_name: user.first_name,
        last_name: user.last_name,
        username,
        password: hashedPassword
      })

      // Save the user to the database
      const savedUser = await newUser.save()
      logger.info('Created user with id: ' + savedUser.id)
      return Ok(savedUser.toJSON() as User)
    } catch (error) {
      logger.error(`Error creating user: ${error}`)
      return errors.internalServerError(`Error creating user: ${error}`)
    }
  }

  async updateUser(user: User): Promise<Result<User, Error>> {
    try {
      logger.info('Updating user')

      // Validate the user
      const validationError = await this.validateUpdateUser(user)
      if (validationError) {
        return errors.validationError(validationError)
      }

      // Find the user by user id from context
      const userId = this.httpContext.getUserIdFromContext()
      logger.info('Updating user with userId: ' + userId)

      const existingUser = await User.findByPk(userId)
      if (!existingUser) {
        return errors.notFoundError('User not found')
      }

      // Update only allowed fields
      existingUser.first_name = user.first_name || existingUser.first_name
      existingUser.last_name = user.last_name || existingUser.last_name

      // Hash the password if provided
      if (user.password) {
        const hashedPassword = await this.crypto.hashPassword(user.password)
        existingUser.password = hashedPassword
      }

      // Save the updated user to the database
      const updatedUser = await existingUser.save()
      logger.info('Updated user with id: ' + updatedUser.id)
      return Ok(updatedUser.toJSON() as User)
    } catch (error) {
      logger.error(`Error updating user: ${error}`)
      return errors.internalServerError(`Error updating user: ${error}`)
    }
  }

  async getUser(): Promise<Result<User, Error>> {
    try {
      const loggedInUser = this.httpContext.getUserIdFromContext()
      logger.info('Fetching user details for userid: ' + loggedInUser)
      const user = await User.findByPk(loggedInUser)
      if (!user) {
        return errors.notFoundError('User not found')
      }
      return Ok(user)
    } catch (error) {
      logger.error(`Error fetching user: ${error}`)
      return errors.internalServerError(`Error fetching user: ${error}`)
    }
  }

  async validateCreateUser(user: User): Promise<string | null> {
    if (!user) return 'User details have to be defined'
    else if (validator.isEmpty(user.first_name)) return 'First name is required'
    else if (validator.isEmpty(user.last_name)) return 'Last name is required'
    else if (validator.isEmpty(user.password)) return 'Password is required'
    else if (validator.isEmpty(user.username)) return 'email is required'
    else if (!validator.isValidEmail(user.username)) return 'email is invalid'

    try {
      const userModel = User.build({
        username: user.username,
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name
      })
      await userModel.validate()
    } catch (err) {
      return err.message
    }
    return null
  }

  async validateUpdateUser(user: User): Promise<string | null> {
    if (!user) return 'User details have to be defined'
    const updatableFields = ['first_name', 'last_name', 'password']

    const update: Record<string, string> = {}
    for (const field in user) {
      if (!updatableFields.includes(field)) {
        return `Field ${field} cannot be updated`
      }
      const value = user[field as keyof User] as string
      if (validator.isEmpty(value)) {
        return `${field} cannot be empty`
      }

      update[field] = value
    }

    try {
      const userModel = User.build(update)
      await userModel.validate({ fields: Object.keys(update) })
    } catch (err) {
      return err.message
    }
    return null
  }
}

const userService: IUserService = new UserService(crypto, httpContext)

export default userService