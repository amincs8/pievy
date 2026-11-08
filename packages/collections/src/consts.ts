/**
 * Sentinel returned from a collection-loop callback to stop the active traversal early.
 *
 * Use it whenever processing should stop before all values have been visited.
 * It is a control value for loop helpers, not a special `forEach`-only value.
 *
 * @example
 * ```ts
 * forEach(values, (value) => {
 *   if (shouldStop(value)) return STOP;
 * });
 * ```
 */
export const STOP = Symbol("LOOP_STOP");

/**
 * Return contract for loop callbacks: return `STOP` to break, or `void` to continue.
 */
export type LoopControl = typeof STOP | void;
