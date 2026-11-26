import type { EventMap } from "../types";
import { EventEmitter } from "./event-emitter";

/**
 * Creates a new {@link EventEmitter} instance.
 *
 * @typeParam Events - The event map type.
 * @returns A new EventEmitter instance.
 */
export function createEmitter<Events extends EventMap>() {
  return new EventEmitter<Events>();
}
