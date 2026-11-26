import { find } from "@pievy/collections";

import type { EventArgs, EventListener, EventMap, Subscription } from "../types";

interface ListenerEntry {
  listener: EventListener<unknown>;
  once: boolean;
  active: boolean;
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
   * @returns A {@link Subscription} for managing the listener.
   */
  on<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): Subscription {
    return this._addListener(event, listener, false);
  }

  /**
   * Registers a one-time listener for an event.
   *
   * @param event - The event name.
   * @param listener - Function to call once when the event is emitted.
   * @returns A {@link Subscription} for managing the listener.
   */
  once<K extends keyof Events>(event: K, listener: EventListener<Events[K]>): Subscription {
    return this._addListener(event, listener, true);
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

    // Remove the most recently registered matching listener.
    const [entry] = find(entries, (item) => item.listener === listener);

    if (entry) {
      this._removeEntry(event, entry);
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
      entry.active = false;
    }

    this._listeners.delete(event);
  }

  /**
   * Removes all listeners for all events.
   */
  clearAll(): void {
    for (const entries of this._listeners.values()) {
      for (const entry of entries) {
        entry.active = false;
      }
    }

    this._listeners.clear();
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

  private _addListener<K extends keyof Events>(
    event: K,
    listener: EventListener<Events[K]>,
    once: boolean,
  ): Subscription {
    let entries = this._listeners.get(event);

    if (!entries) {
      entries = new Set();
      this._listeners.set(event, entries);
    }

    const entry: ListenerEntry = {
      active: true,
      listener: listener as EventListener<unknown>,
      once,
    };

    entries.add(entry);

    return {
      get closed() {
        return !entry.active;
      },

      unsubscribe: () => {
        this._removeEntry(event, entry);
      },
    };
  }

  private _removeEntry(event: keyof Events, entry: ListenerEntry): void {
    if (!entry.active) return;

    entry.active = false;

    const entries = this._listeners.get(event);

    if (!entries) return;

    entries.delete(entry);

    if (entries.size === 0) {
      this._listeners.delete(event);
    }
  }
}
