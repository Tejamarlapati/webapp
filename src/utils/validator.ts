const isNullOrUndefined = (data: unknown) => {
  return data === null || data === undefined
}

const validator = {
  isNullOrUndefined
}

export default validator
