interface BarrierGeneration {
  count: number;
  promise: Promise<void>;
  resolve: () => void;
}

/**
 * A reusable barrier synchronizing a fixed number of parties.
 */
export class Barrier {
  private generation: BarrierGeneration;

  /**
   * Creates a barrier for `parties` participants.
   * @throws {TypeError} If parties is not a positive integer.
   */
  constructor(readonly parties: number) {
    if (!Number.isInteger(parties) || parties < 1) {
      throw new TypeError("'parties' must be a positive integer");
    }

    this.generation = this.createGeneration();
  }

  /**
   * Number of parties currently waiting.
   */
  get waiting(): number {
    return this.generation.count;
  }

  private createGeneration(): BarrierGeneration {
    let resolve!: () => void;

    const promise = new Promise<void>((res) => {
      resolve = res;
    });

    return {
      count: 0,
      promise,
      resolve,
    };
  }

  /**
   * Waits until all parties have called `wait`.
   */
  wait(): Promise<void> {
    const generation = this.generation;

    generation.count++;

    if (generation.count === this.parties) {
      this.generation = this.createGeneration();
      generation.resolve();
    }

    return generation.promise;
  }
}
