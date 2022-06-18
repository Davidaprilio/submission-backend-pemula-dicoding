const { validate } = require('../helper')
const BookModel = require('../models/Book')
const ValidationError = require('../ValidationError')
const Book = new BookModel()

module.exports.add = (request, h) => {
  const data = request.payload
  try {
    validate(data, {
      readPage: 'lt:pageCount' // less than pageCount
    }, {
      'readPage.lt:pageCount': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    const book = Book.add(data)
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: book.id
      }
    }).code(201)
  } catch (error) {
    if (error instanceof ValidationError) {
      return h.response({
        status: 'fail',
        message: error.message
      }).code(400)
    } else {
      return h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan'
      }).code(500)
    }
  }
}
