export interface ResultOk<T> {
  ok: true
  value: T
}
export interface ResultError<E extends Error> {
  ok: false
  error: E
}
export type Result<T, E extends Error> = ResultOk<T> | ResultError<E>

export const Ok = <T>(data: T): Result<T, never> => {
  return { ok: true, value: data }
}

export const Err = <E extends Error>(error: E): Result<never, E> => {
  return { ok: false, error }
}
