import bcrypt from 'bcrypt'

const salt = bcrypt.genSaltSync(10)

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, salt)
}

export const comparePassword = async (hashedPassword: string, password: string) => {
  return bcrypt.compare(password, hashedPassword)
}
