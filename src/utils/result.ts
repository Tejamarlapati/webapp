export interface ResultOk<T> {
  ok: true
  value: T
}
export interface ResultError<E extends Error> {
  ok: false
  error: E
}

/**
 * The result type
 */
export type Result<T, E extends Error> = ResultOk<T> | ResultError<E>

/**
 * Create a Ok Result
 * @param data the data
 * @returns Result
 */
export const Ok = <T>(data: T): Result<T, never> => {
  return { ok: true, value: data }
}
