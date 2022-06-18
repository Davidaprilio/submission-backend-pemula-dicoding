const books = require('./controllers/book')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: books.add
  },
  {
    method: 'GET',
    path: '/books',
    handler: books.get
  }
]

module.exports = routes
