const isNullOrUndefined = (data: unknown) => {
  return data === null || data === undefined
}

const isEmpty = (data: string) => {
  return isNullOrUndefined(data) || data.trim() === ''
}

const isValidEmail = (data: string) => {
  return !isEmpty(data) && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data)
}

const doesPropertyExist = (data: unknown, property: string) => {
  if (data === null || data === undefined) return false
  return typeof data === 'object' && property in data
}

const validator = {
  isNullOrUndefined,
  isEmpty,
  isValidEmail,
  doesPropertyExist
}

export default validator
