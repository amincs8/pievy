export function _createError<E = unknown>(error: unknown): E {
  return (error instanceof Error ? error : new Error(String(error))) as E;
}
