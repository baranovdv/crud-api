export default class UnsupportedMethodError extends Error {
  constructor(message = 'Method not allowed') {
    super(message);
  }
}
