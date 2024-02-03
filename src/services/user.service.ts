import { hashPassword } from '../config/crypto'
import User from '../models/user.model'
import logger from '../config/logger'
import { Ok, Result } from '../utils/result'
import { InternalServerError, NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors'
import { getUserIdFromContext } from '../config/context'
import validator from '../utils/validator'

interface IUserService {
  createUser(user: User): Promise<Result<User, Error>>
  updateUser(user: User): Promise<Result<User, Error>>
  getUser(): Promise<Result<User, Error>>
}

class UserService implements IUserService {
  async createUser(user: User): Promise<Result<User, Error>> {
    try {
      // Validate the user
      const validationError = await this.validateUser(user, true)
      if (validationError) {
        return new ValidationError(validationError)
      }

      // Check if user with the given email already exists
      const username = user.username
      const existingUser = await User.findOne({ where: { username } })
      if (existingUser) {
        return new ValidationError('User with this username already exists')
      }

      // Hash the password
      const hashedPassword = await hashPassword(user.password)

      // Create the user model
      const newUser = new User({
        first_name: user.first_name,
        last_name: user.last_name,
        username,
        password: hashedPassword
      })

      // Save the user to the database
      const savedUser = await newUser.save()
      return Ok(savedUser)
    } catch (error) {
      logger.error(`Error creating user: ${error}`)
      return new InternalServerError(`Error creating user: ${error}`)
    }
  }

  async updateUser(user: User): Promise<Result<User, Error>> {
    try {
      // Validate the user
      const validationError = await this.validateUser(user, false)
      if (validationError) {
        return new ValidationError(validationError)
      }

      // Find the user by username/email
      const username = user.username
      const existingUser = await User.findOne({ where: { username } })
      if (!existingUser) {
        return new NotFoundError('User not found')
      }

      const loggedInUser = getUserIdFromContext()
      if (existingUser.id !== loggedInUser) {
        return new UnauthorizedError('You are not authorized to update this user')
      }

      // Update only allowed fields
      existingUser.first_name = user.first_name || existingUser.first_name
      existingUser.last_name = user.last_name || existingUser.last_name

      // Hash the password if provided
      if (user.password) {
        const hashedPassword = await hashPassword(user.password)
        existingUser.password = hashedPassword
      }

      // Save the updated user to the database
      const updatedUser = await existingUser.save()
      return Ok(updatedUser)
    } catch (error) {
      logger.error(`Error updating user: ${error}`)
      return new InternalServerError(`Error updating user: ${error}`)
    }
  }

  async getUser(): Promise<Result<User, Error>> {
    try {
      const loggedInUser = getUserIdFromContext()
      const user = await User.findByPk(loggedInUser)
      if (!user) {
        return new NotFoundError('User not found')
      }
      return Ok(user)
    } catch (error) {
      logger.error(`Error fetching user: ${error}`)
      return new InternalServerError(`Error fetching user: ${error}`)
    }
  }

  async validateUser(user: User, isCreate: boolean): Promise<string | null> {
    if (!user) return 'User details have to be defined'
    else if (validator.isEmpty(user.username)) return 'Username/email is required'
    else if (validator.isEmpty(user.first_name)) return 'First name is required'
    else if (validator.isEmpty(user.last_name)) return 'Last name is required'
    else if (validator.isEmpty(user.password)) return 'Password is required'
    try {
      isCreate && (await user.validate())
    } catch (err) {
      return err.message
    }
    return null
  }
}

const userService: IUserService = new UserService()

export default userService
