const { validate } = require('../helper')
const Book = require('../models/Book')
const ValidationError = require('../ValidationError')

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
      console.error(error)
      return h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan'
      }).code(500)
    }
  }
}

module.exports.get = (request, h) => {
  const _book = new Book()
  const data = _book.pluck('id', 'name', 'publisher').get()
  return h.response({
    status: 'success',
    message: 'Buku berhasil ditampilkan',
    data
  }).code(200)
}
