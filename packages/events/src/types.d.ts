/**
 * A map of event names to their payload types.
 * Keys are event names, values are the payload types (use `void` for no payload).
 */
export type EventMap = Record<string, unknown>;

/**
 * A function that handles an event with the given payload type.
 */
export type EventListener<T> = (...args: [T] extends [void] ? [] : [payload: T]) => void;

/**
 * A subscription returned when adding a listener.
 * Allows unsubscribing and checking if the subscription is closed.
 */
export interface Subscription {
  /** Unsubscribes the listener. */
  unsubscribe(): void;
  /** Whether the subscription has been closed. */
  readonly closed: boolean;
}

/**
 * Argument tuple for an event: empty for `void` payload, or `[payload]` otherwise.
 */
export type EventArgs<T> = [T] extends [void] ? [] : [payload: T];

export type AnyEventArgs<Events extends EventMap> = {
  [K in keyof Events]: [event: K, ...args: EventArgs<Events[K]>];
}[keyof Events];

export type AnyEventListener<Events extends EventMap> = (
  event: keyof Events,
  payload?: Events[keyof Events],
) => void;
