export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("An unexpected internal error occurred.", { cause });
    this.name = "InternalServerError";
    this.action = "Please contact technical support.";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Service currently unavailable", { cause });
    this.name = "ServiceError";
    this.action = "Verify the service status or try again later.";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("The method POST is not allowed for this endpoint.");
    this.name = "MethodNotAllowedError";
    this.action = "Verify the request method is valid for this endpoint.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}
