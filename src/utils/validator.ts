const isNullOrUndefined = (data: unknown) => {
  return data === null || data === undefined
}

const isEmpty = (data: string) => {
  return isNullOrUndefined(data) || data.trim() === ''
}

const validator = {
  isNullOrUndefined,
  isEmpty
}

export default validator
