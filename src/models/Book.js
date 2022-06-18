const bookData = require('../data/bookData')
const { nanoid } = require('nanoid')
class BookModel {
  constructor () {
    this.books = bookData
  }

  add (book) {
    const dateStr = new Date().toISOString()
    book.id = this.#generateId()
    book.finished = false
    book.insertedAt = dateStr
    book.createdAt = dateStr
    this.books.push(book)
    return book
  }

  get (id = null) {
    return this.books
  }

  #generateId () {
    return nanoid(15)
  }
}

module.exports = BookModel
