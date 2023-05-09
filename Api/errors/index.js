// import http status code
const { StatusCodes } = require("http-status-codes");

// create custom error
class CustomError extends Error {
  constructor(msg) {
    super(msg);
    this.status = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

// create bad request error
class BadRequestError extends CustomError {
  constructor(msg) {
    super(msg);
    this.status = StatusCodes.BAD_REQUEST;
  }
}

// create not found error
class NotFoundError extends CustomError {
  constructor(msg) {
    super(msg);
    this.status = StatusCodes.NOT_FOUND;
  }
}

// create forbidden error
class ForbiddenError extends CustomError {
  constructor(msg) {
    super(msg);
    this.status = StatusCodes.FORBIDDEN;
  }
}

// create unauthorized error
class UnauthorizedError extends CustomError {
  constructor(msg) {
    super(msg);
    this.status = StatusCodes.UNAUTHORIZED;
  }
}

// export all errors
module.exports = {
  CustomError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
};
