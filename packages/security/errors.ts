// packages/security/errors.ts

export class SecurityError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "SecurityError";
    Object.setPrototypeOf(this, SecurityError.prototype);
  }
}

export class ValidationError extends SecurityError {
  constructor(message: string) {
    super(message, "URL_VALIDATION_FAILED");
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NetworkError extends SecurityError {
  constructor(message: string, public status?: number) {
    super(message, "NETWORK_ERROR");
    this.name = "NetworkError";
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
