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
      if (error.message === 'field is required') {
        error.message = `Gagal menambahkan buku. Mohon isi ${error.name} buku`
      }
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
  const books = _book.pluck('id', 'name', 'publisher').get()
  return h.response({
    status: 'success',
    data: {
      books
    }
  }).code(200)
}

module.exports.show = (request, h) => {
  const bookId = request.params.bookId
  const _book = new Book()
  const books = _book.where('id', '=', bookId).get()
  if (books.length === 0) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    }).code(404)
  }
  return h.response({
    status: 'success',
    data: {
      book: books[0]
    }
  }).code(200)
}

module.exports.update = (request, h) => {
  const bookId = request.params.bookId
  const data = request.payload
  try {
    validate(data, {
      readPage: 'lt:pageCount' // less than pageCount
    }, {
      'readPage.lt:pageCount': 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    const _book = new Book()
    const books = _book.where('id', '=', bookId).update(data)
    console.log(books)
    if (books.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
      }).code(404)
    }
    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        book: books[0]
      }
    }).code(200)
  } catch (error) {
    if (error instanceof ValidationError) {
      if (error.message === 'field is required') {
        error.message = `Gagal memperbarui buku. Mohon isi ${error.name} buku`
      }
      return h.response({
        status: 'fail',
        message: error.message
      }).code(400)
    } else {
      console.error(error)
      return h.response({
        status: 'error',
        message: 'Buku gagal diperbarui'
      }).code(500)
    }
  }
}

module.exports.delete = (request, h) => {
  const bookId = request.params.bookId
  const _book = new Book()
  const books = _book.where('id', '=', bookId).delete()
  if (books.length === 0) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404)
  }
  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus'
  }).code(200)
}
