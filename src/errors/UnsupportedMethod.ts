export default class UnsupportedMethodError extends Error {
  constructor(message = 'Unsupported method') {
    super(message);
  }
}
