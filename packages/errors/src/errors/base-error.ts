/**
 * Options for {@link BaseError}.
 */
export interface BaseErrorOptions<Code extends string | number | symbol, Details = unknown> {
  /** The underlying cause of the error. */
  cause?: unknown;
  /** An error code (string, number, or symbol). */
  code?: Code;
  /** Additional details about the error. */
  details?: Details;
  /** Whether the error should be exposed to clients (e.g., in API responses). */
  expose?: boolean;
}

/**
 * A base error class with support for error codes, details, and exposure control.
 *
 * @typeParam Code - The type of error code (string, number, or symbol).
 * @typeParam Details - The type of additional error details.
 */
export class BaseError<Code extends string | number | symbol, Details = unknown> extends Error {
  /** The error code. */
  readonly code?: Code;
  /** Additional details about the error. */
  readonly details?: Details;
  /** Whether the error should be exposed to clients. */
  readonly expose: boolean;
  /** Timestamp when the error was created (ms since epoch). */
  readonly timestamp?: number;

  /**
   * Creates a new BaseError.
   *
   * @param message - The error message.
   * @param options - Optional error code, details, cause, and exposure flag.
   */
  constructor(message: string, options: BaseErrorOptions<Code, Details> = {}) {
    super(message, { cause: options.cause });

    this.timestamp = Date.now();
    this.name = new.target.name;
    this.code = options.code as Code;
    this.details = options.details as Details;
    this.expose = options.expose ?? false;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}