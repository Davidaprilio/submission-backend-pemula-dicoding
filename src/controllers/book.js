const BookModel = require('../models/Book')
const Book = new BookModel()

module.exports.add = (request, h) => {
  const data = request.payload
  const book = Book.add(data)
  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: book.id
    }
  }).code(201)
}
