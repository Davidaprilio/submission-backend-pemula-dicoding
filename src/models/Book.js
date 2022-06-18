const bookData = require('../data/bookData')
const ValidationError = require('../ValidationError')
const { nanoid } = require('nanoid')
const { required } = require('../helper')

class BookModel {
  #schema = [
    {
      field: 'name',
      type: 'string',
      alias: 'nama',
      required: true
    },
    {
      field: 'year',
      type: 'number'
    },
    {
      field: 'author',
      type: 'string'
    },
    {
      field: 'summary',
      type: 'string'
    },
    {
      field: 'publisher',
      type: 'string'
    },
    {
      field: 'pageCount',
      type: 'number'
    },
    {
      field: 'readPage',
      type: 'number',
      default: 0
    },
    {
      field: 'reading',
      type: 'boolean',
      default: false
    }
  ]

  constructor () {
    this.books = bookData
  }

  add (book) {
    book = this.#build(book)
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

  #build (book) {
    if (typeof book !== 'object') {
      throw new ValidationError('request type must be object')
    }
    const buildBook = {}
    this.#schema.forEach((item) => {
      const { field, type } = item
      // check is required
      if (item?.required) {
        required(book[field], `Gagal menambahkan buku. Mohon isi ${item?.alias ?? field} buku`)
      }
      // Tipe Harus Sama dengan type (jika ada field nya)
      // eslint-disable-next-line valid-typeof
      if (book[field] !== undefined && (typeof book[field] !== type)) {
        throw new ValidationError(`Gagal menambahkan buku. Mohon isi "${item?.alias ?? field}" dengan tipe ${type}`)
      }
      const defaultValue = item.default !== undefined ? item.default : null
      buildBook[field] = book[field] ?? defaultValue
    })
    return buildBook
  }
}

module.exports = BookModel
