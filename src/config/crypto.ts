import bcrypt from 'bcryptjs'

// Generate salt
const salt = bcrypt.genSaltSync(10)

/**
 * Hash a string
 * @param password the password to hash
 * @returns the hashed password
 */
const hashPassword = async (password: string) => {
  return bcrypt.hash(password, salt)
}

/**
 * Compare a password with a hashed password
 * @param password the password to compare
 * @param hashedPassword the hashed password to compare
 * @returns true if the password and hashed password match
 */
const comparePassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Interface for the crypto
 */
export interface ICrypto {
  hashPassword: (password: string) => Promise<string>
  comparePassword: (password: string, hashedPassword: string) => Promise<boolean>
}

/**
 * The crypto
 */
const crypto: ICrypto = {
  hashPassword,
  comparePassword
}

export default crypto
