const isNullOrUndefined = (data: unknown) => {
  return data === null || data === undefined
}

const isEmpty = (data: string) => {
  return isNullOrUndefined(data) || data.trim() === ''
}

const isValidEmail = (data: string) => {
  return !isEmpty(data) && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data)
}

const validator = {
  isNullOrUndefined,
  isEmpty,
  isValidEmail
}

export default validator
