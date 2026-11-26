import type { EventArgs, EventListener, EventMap, Subscription } from "../types";

/**
 * Options for adding an event listener.
 */
interface AddEventListenerOptions {
  /** Whether the listener should be invoked only once. */
  once?: boolean;
  /** Optional `AbortSignal` to automatically unsubscribe. */
  signal?: AbortSignal;
}

/**
 * Internal entry for tracking a listener.
 */
interface ListenerEntry {
  listener: EventListener<unknown>;
  once: boolean;
  active: boolean;
  signal?: AbortSignal | undefined;
  onAbort: () => void;
}

/**
 * A type-safe event emitter for the given event map.
 *
 * @typeParam Events - An {@link EventMap} defining event names and payload types.
 */
export class EventEmitter<Events extends EventMap> {
  private readonly _listeners = new Map<keyof Events, Set<ListenerEntry>>();

  /**
   * Registers a listener for an event.
   *
   * @param event - The event name.
   * @param listener - Function to call when the event is emitted.
   * @param options - Optional configuration (once, signal).
   * @returns A {@link Subscription} for managing the listener.
   */
  on<K extends keyof Events>(
    event: K,
    listener: EventListener<Events[K]>,
    options: AddEventListenerOptions = {},
  ): Subscription {
    return this._addListener(event, listener, options);
  }

  /**
   * Registers a one-time listener for an event.
   *
   * @param event - The event name.
   * @param listener - Function to call once when the event is emitted.
   * @param options - Optional configuration (signal).
   * @returns A {@link Subscription} for managing the listener.
   */
  once<K extends keyof Events>(
    event: K,
    listener: EventListener<Events[K]>,
    options: Omit<AddEventListenerOptions, "once"> = {},
  ): Subscription {
    return this._addListener(event, listener, { ...options, once: true });
  }

  /**
   * Removes a previously registered listener.
   *
   * Removes the most recently registered matching listener.
   *
   * @param event - The event name.
   * @param listener - The listener function to remove.
   */
  off<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): void {
    const entries = this._listeners.get(event);

    if (!entries) return;

    let target: ListenerEntry | undefined;

    for (const entry of entries) {
      if (entry.listener === listener) {
        target = entry;
      }
    }

    if (target) {
      this._removeEntry(event, target);
    }
  }

  /**
   * Emits an event to all registered listeners.
   *
   * Listeners are called in registration order. If a listener was registered
   * with `once`, it is removed before being invoked.
   *
   * @param event - The event name.
   * @param args - The payload (empty for `void` events).
   */
  async emit<K extends keyof Events>(event: K, ...args: EventArgs<Events[K]>): Promise<void> {
    const entries = [...(this._listeners.get(event) ?? [])];
    const payload = args[0];

    for (const entry of entries) {
      if (!entry.active) continue;

      if (entry.once) {
        this._removeEntry(event, entry);
      }

      await entry.listener(payload);
    }
  }

  /**
   * Removes all listeners for a specific event.
   *
   * @param event - The event name to clear.
   */
  clear<K extends keyof Events>(event: K): void {
    const entries = this._listeners.get(event);

    if (!entries) return;

    for (const entry of entries) {
      this._removeEntry(event, entry);
    }
  }

  /**
   * Removes all listeners for all events.
   */
  clearAll(): void {
    for (const [event, entries] of this._listeners) {
      for (const entry of entries) {
        this._removeEntry(event, entry);
      }
    }
  }

  /**
   * Returns the number of active listeners for an event.
   *
   * @param event - The event name.
   * @returns The count of registered listeners.
   */
  listenerCount<K extends keyof Events>(event: K): number {
    return this._listeners.get(event)?.size ?? 0;
  }

  /**
   * Internal: adds a listener entry and returns a subscription.
   */
  private _addListener<K extends keyof Events>(
    event: K,
    listener: EventListener<Events[K]>,
    options: AddEventListenerOptions,
  ): Subscription {
    const { once = false, signal } = options;

    if (signal?.aborted) {
      return {
        closed: true,
        unsubscribe: () => {},
      };
    }

    let entries = this._listeners.get(event);

    if (!entries) {
      entries = new Set();
      this._listeners.set(event, entries);
    }

    const entry: ListenerEntry = {
      active: true,
      listener: listener as EventListener<unknown>,
      onAbort: () => this._removeEntry(event, entry),
      once,
      signal,
    };

    entries.add(entry);

    signal?.addEventListener("abort", entry.onAbort, { once: true });

    return {
      get closed() {
        return !entry.active;
      },

      unsubscribe: entry.onAbort,
    };
  }

  /**
   * Internal: removes a listener entry and cleans up if empty.
   */
  private _removeEntry(event: keyof Events, entry: ListenerEntry): void {
    if (!entry.active) return;

    entry.active = false;
    entry.signal?.removeEventListener("abort", entry.onAbort);

    const entries = this._listeners.get(event);

    if (!entries) return;

    entries.delete(entry);

    if (entries.size === 0 && this._listeners.get(event) === entries) {
      this._listeners.delete(event);
    }
  }
}
