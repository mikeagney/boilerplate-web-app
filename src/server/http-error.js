class HttpError extends Error {
  constructor(message, { status = 500, headers = {} } = {}) {
    super(message);
    this.status = status;
    this.headers = headers;
  }
}

export default HttpError;
