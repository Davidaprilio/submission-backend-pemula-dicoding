const books = require('./controllers/book')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: books.add
  }
]

module.exports = routes
