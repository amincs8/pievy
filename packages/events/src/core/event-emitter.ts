import type { AnyEventListener, EventArgs, EventListener, EventMap, Subscription } from "../types";

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
 * Internal listener type for unified handling.
 */
// oxlint-disable-next-line typescript/no-explicit-any
type InternalListener = (...args: any[]) => void;

/**
 * Internal entry for tracking a listener.
 */
interface ListenerEntry {
  listener: InternalListener;
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

  private readonly _anyListeners = new Set<ListenerEntry>();

  /**
   * Registers a listener for a specific event.
   *
   * @param event - The event name.
   * @param listener - Function to call when the event is emitted.
   * @param options - Optional configuration (`once`, `signal`).
   * @returns A {@link Subscription} for managing the listener.
   */
  on<K extends keyof Events>(
    event: K,
    listener: EventListener<Events[K]>,
    options: AddEventListenerOptions = {},
  ): Subscription {
    return this._addListener(this._getEntries(event), listener, options, event);
  }

  /**
   * Registers a one-time listener for a specific event.
   *
   * @param event - The event name.
   * @param listener - Function to call once when the event is emitted.
   * @param options - Optional configuration (`signal`).
   * @returns A {@link Subscription} for managing the listener.
   */
  once<K extends keyof Events>(
    event: K,
    listener: EventListener<Events[K]>,
    options: Omit<AddEventListenerOptions, "once"> = {},
  ): Subscription {
    return this.on(event, listener, { ...options, once: true });
  }

  /**
   * Registers a listener that receives all events.
   *
   * @param listener - Function called with `(eventName, payload)` for every emitted event.
   * @param options - Optional configuration (`signal`).
   * @returns A {@link Subscription} for managing the listener.
   */
  onAny(listener: AnyEventListener<Events>, options: AddEventListenerOptions = {}): Subscription {
    return this._addListener(this._anyListeners, listener, options);
  }

  /**
   * Registers a one-time listener that receives all events.
   *
   * @param listener - Function called once with `(eventName, payload)` for the next event.
   * @param options - Optional configuration (`signal`).
   * @returns A {@link Subscription} for managing the listener.
   */
  onceAny(
    listener: AnyEventListener<Events>,
    options: Omit<AddEventListenerOptions, "once"> = {},
  ): Subscription {
    return this._addListener(this._anyListeners, listener, {
      ...options,
      once: true,
    });
  }

  /**
   * Removes a previously registered event-specific listener.
   *
   * Removes the most recently registered matching listener.
   *
   * @param event - The event name.
   * @param listener - The listener function to remove.
   */
  off<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): void {
    const entries = this._listeners.get(event);

    if (!entries) return;

    this._removeMatching(entries, listener, event);
  }

  /**
   * Removes a previously registered global listener.
   *
   * Removes the most recently registered matching global listener.
   *
   * @param listener - The global listener function to remove.
   */
  offAny(listener: AnyEventListener<Events>): void {
    this._removeMatching(this._anyListeners, listener);
  }

  /**
   * Emits an event to all registered listeners.
   *
   * Event-specific listeners execute before global listeners.
   * Listeners are executed sequentially.
   *
   * @param event - The event name.
   * @param args - The payload (empty for `void` events).
   */
  async emit<K extends keyof Events>(event: K, ...args: EventArgs<Events[K]>): Promise<void> {
    await this._emitEntries(this._listeners.get(event), args);
    await this._emitAny(event, args);
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
      this._removeEntry(entries, entry, event);
    }
  }

  /**
   * Removes all registered listeners, including global listeners.
   */
  clearAll(): void {
    for (const [event, entries] of this._listeners) {
      for (const entry of entries) {
        this._removeEntry(entries, entry, event);
      }
    }

    for (const entry of this._anyListeners) {
      this._removeEntry(this._anyListeners, entry);
    }
  }

  /**
   * Returns the number of listeners registered for an event.
   *
   * @param event - The event name.
   * @returns The count of registered listeners.
   */
  listenerCount<K extends keyof Events>(event: K): number {
    return this._listeners.get(event)?.size ?? 0;
  }

  /**
   * Returns the number of global listeners.
   *
   * @returns The count of registered global listeners.
   */
  anyListenerCount(): number {
    return this._anyListeners.size;
  }

  /**
   * Internal: gets or creates the listener set for an event.
   */
  private _getEntries<K extends keyof Events>(event: K): Set<ListenerEntry> {
    let entries = this._listeners.get(event);

    if (!entries) {
      entries = new Set();
      this._listeners.set(event, entries);
    }

    return entries;
  }

  /**
   * Internal: adds a listener entry and returns a subscription.
   */
  private _addListener(
    entries: Set<ListenerEntry>,
    listener: InternalListener,
    options: AddEventListenerOptions,
    event?: keyof Events,
  ): Subscription {
    const { once = false, signal } = options;

    if (signal?.aborted) {
      return {
        closed: true,
        unsubscribe: () => {},
      };
    }

    const entry: ListenerEntry = {
      active: true,
      listener,
      onAbort: () => this._removeEntry(entries, entry, event),
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
   * Internal: finds and removes the most recently registered matching listener.
   */
  private _removeMatching(
    entries: Set<ListenerEntry>,
    listener: InternalListener,
    event?: keyof Events,
  ): void {
    let target: ListenerEntry | undefined;

    // Remove the most recently registered matching listener.
    for (const entry of entries) {
      if (entry.listener === listener) {
        target = entry;
      }
    }

    if (target) {
      this._removeEntry(entries, target, event);
    }
  }

  /**
   * Internal: removes a listener entry and cleans up signal listener.
   */
  private _removeEntry(
    entries: Set<ListenerEntry>,
    entry: ListenerEntry,
    event?: keyof Events,
  ): void {
    if (!entry.active) return;

    entry.active = false;
    entry.signal?.removeEventListener("abort", entry.onAbort);
    entries.delete(entry);

    if (event !== undefined && entries.size === 0) {
      this._listeners.delete(event);
    }
  }

  /**
   * Internal: emits to a set of entries with given arguments.
   */
  private async _emitEntries(
    entries: Set<ListenerEntry> | undefined,
    args: unknown[],
  ): Promise<void> {
    if (!entries) return;

    const snapshot = [...entries];

    for (const entry of snapshot) {
      if (!entry.active) continue;

      if (entry.once) {
        this._removeEntry(entries, entry);
      }

      await entry.listener(...args);
    }
  }

  /**
   * Internal: emits to global listeners with event name and arguments.
   */
  private async _emitAny<K extends keyof Events>(
    event: K,
    args: EventArgs<Events[K]>,
  ): Promise<void> {
    const snapshot = [...this._anyListeners];

    for (const entry of snapshot) {
      if (!entry.active) continue;

      if (entry.once) {
        this._removeEntry(this._anyListeners, entry);
      }

      await entry.listener(event, ...args);
    }
  }
}
