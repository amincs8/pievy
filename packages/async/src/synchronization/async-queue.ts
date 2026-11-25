/**
 * An async queue for passing values between producers and consumers.
 */
export class AsyncQueue<T> {
  private items: T[] = [];
  private waiters: Array<(value: T) => void> = [];

  /**
   * Number of queued values.
   */
  get size(): number {
    return this.items.length;
  }

  /**
   * Number of consumers waiting for values.
   */
  get pending(): number {
    return this.waiters.length;
  }

  /**
   * Whether the queue has no queued values.
   */
  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Enqueues a value, resolving a waiting consumer if any.
   */
  enqueue(value: T): void {
    const waiter = this.waiters.shift();

    if (waiter) {
      waiter(value);
    } else {
      this.items.push(value);
    }
  }

  /**
   * Dequeues a value, waiting if the queue is empty.
   */
  dequeue(): Promise<T> {
    if (this.items.length > 0) {
      return Promise.resolve(this.items.shift()!);
    }

    return new Promise<T>((resolve) => {
      this.waiters.push(resolve);
    });
  }

  /**
   * Attempts to dequeue without waiting.
   */
  tryDequeue(): { value: T } | undefined {
    if (this.items.length === 0) return undefined;

    return { value: this.items.shift()! };
  }

  /**
   * Clears all queued values.
   */
  clear(): void {
    this.items = [];
  }
}
