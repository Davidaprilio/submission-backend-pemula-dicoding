const bookData = require('../data/bookData')
const ValidationError = require('../ValidationError')
const { nanoid } = require('nanoid')
const { required, mustBe } = require('../helper')

class BookModel {
  static #schema = [
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
    },
    {
      field: 'finished',
      type: 'boolean',
      default: false
    }
  ]

  #data = []
  #indexs = {}

  constructor () {
    this.#data = bookData
  }

  static add (book) {
    book = this.#build(book)
    const dateStr = new Date().toISOString()
    const data = {
      id: this.#generateId(),
      ...book,
      insertedAt: dateStr,
      updatedAt: dateStr
    }
    bookData.push(data)
    return data
  }

  update (book) {
    book = BookModel.#build(book)
    return this.#data.map((item, index) => {
      mustBe(book, 'object', 'request type must be object')
      for (const key in book) {
        this.#data[index][key] = book[key]
      }
      return this.#data[index]
    })
  }

  delete () {
    const deleted = []
    for (const bookid in this.#indexs) {
      const index = this.#indexs[bookid]
      const book = bookData.splice(index, 1)
      deleted.push(book)
    }
    return deleted
  }

  get () {
    return this.#data
  }

  where (key, operation, value) {
    this.#data = this.#data.filter((book, index) => {
      this.#indexs[book.id] = index
      const field = book[key]
      switch (operation) {
        case '=':
          return field === value
        case 'like':
          return field.includes(value)
        default:
          throw new Error(`Operation ${operation} is not supported`)
      }
    })
    return this
  }

  pluck (...keys) {
    this.#data = this.#data.map(item => {
      return keys.reduce((acc, key) => {
        // eslint-disable-next-line no-prototype-builtins
        if (!item.hasOwnProperty(key)) {
          throw new Error(`field ${key} is not in item`)
        }
        acc[key] = item[key]
        return acc
      }, {})
    })
    return this
  }

  static #generateId () {
    return nanoid(15)
  }

  static #build (book) {
    if (typeof book !== 'object') {
      throw new ValidationError('request type must be object')
    }
    const buildBook = {}
    this.#schema.forEach((item) => {
      const { field, type } = item
      // check is required
      if (item?.required) {
        required(book[field], 'field is required', item?.alias ?? field)
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
