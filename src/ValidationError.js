class ValidationError extends Error {
  constructor (message, name = 'ValidationError') {
    super(message)
    this.name = name
  }
}
module.exports = ValidationError
