import bcrypt from 'bcrypt'

const salt = bcrypt.genSaltSync(10)

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, salt)
}

const comparePassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword)
}

const crypto = {
  hashPassword,
  comparePassword
}

export default crypto
