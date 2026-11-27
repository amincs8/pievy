import { isArray } from "@pievy/types";

import type { EventEmitter } from "../core";
import type { EventListener, EventMap, Subscription } from "../types";

type EventListeners<Events extends EventMap> = {
  [K in keyof Events]?: EventListener<Events[K]> | EventListener<Events[K]>[];
};

/**
 * Options for {@link subscribe}.
 */
interface SubscribeOptions {
  /** Optional `AbortSignal` to automatically unsubscribe all listeners. */
  signal?: AbortSignal;
}

/**
 * Result of {@link subscribe} with granular unsubscribe control.
 */
interface SubscriptionResult<Events extends EventMap> {
  /** Unsubscribes all listeners for a specific event. */
  unsubscribe<K extends keyof Events>(event: K): void;
  /** Unsubscribes all listeners for all events. */
  unsubscribeAll(): void;
  /** Whether all subscriptions have been closed. */
  readonly closed: boolean;
}

/**
 * Subscribes multiple event listeners at once, returning a single subscription
 * that can unsubscribe individual events or all at once.
 *
 * @param emitter - The event emitter to subscribe to.
 * @param events - Object mapping event names to listener functions or arrays of listeners.
 * @param options - Optional abort signal to auto-unsubscribe all.
 * @returns A {@link SubscriptionResult} with `unsubscribe(event)`, `unsubscribeAll()`, and `closed`.
 */
export function subscribe<Events extends EventMap>(
  emitter: EventEmitter<Events>,
  events: EventListeners<Events>,
  options: SubscribeOptions = {},
): SubscriptionResult<Events> {
  const subscriptions: Partial<Record<keyof Events, Subscription[]>> = {};
  const { signal } = options;

  if (signal?.aborted) {
    return {
      closed: true,
      unsubscribe: () => {},
      unsubscribeAll: () => {},
    };
  }

  for (const event of Object.keys(events) as (keyof Events)[]) {
    const value = events[event];

    if (!value) continue;

    const listeners = isArray(value) ? value : [value];

    for (const listener of listeners) {
      (subscriptions[event] ??= []).push(
        emitter.on(event, listener as EventListener<Events[typeof event]>),
      );
    }
  }

  let closed = false;

  const unsubscribeAll = () => {
    if (closed) return;

    closed = true;
    signal?.removeEventListener("abort", unsubscribeAll);

    for (const event of Object.keys(subscriptions) as (keyof Events)[]) {
      for (const subscription of subscriptions[event] ?? []) {
        subscription.unsubscribe();
      }
    }
  };

  const unsubscribe = <K extends keyof Events>(event: K) => {
    if (closed) return;

    for (const subscription of subscriptions[event] ?? []) {
      subscription.unsubscribe();
    }

    delete subscriptions[event];

    if (Object.keys(subscriptions).length === 0) {
      unsubscribeAll();
    }
  };

  signal?.addEventListener("abort", unsubscribeAll, { once: true });

  return {
    get closed() {
      return closed;
    },
    unsubscribe,
    unsubscribeAll,
  };
}
