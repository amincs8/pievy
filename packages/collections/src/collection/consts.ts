/**
 * Sentinel returned from a `forEach` callback to stop iteration early.
 *
 * @example
 * ```ts
 * forEach(values, (value) => {
 *   if (shouldStop(value)) return STOP;
 * });
 * ```
 */
export const STOP = Symbol("LOOP_STOP");

/** Return type accepted by synchronous `forEach` callbacks. */
export type StopSignal = typeof STOP | void;
