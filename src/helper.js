/* eslint-disable valid-typeof */
const ValidationError = require('./ValidationError')

module.exports.validate = (data, validation, message = []) => {
  this.mustBe(data, 'object')
  this.mustBe(validation, 'object')

  for (const key in validation) {
    const dataValue = data[key]
    const roles = validation[key]
    let alias = null
    this.mustBe(roles, 'string')
    roles.split('|').forEach(role => {
      if (role.startsWith('attr:')) {
        alias = role.replace('attr:', '')
      } else {
        const msg = message[`${key}.${role}`]
        if (msg) {
          msg.replace(':attr', alias ?? key)
        }
        if (role === 'required') {
          this.required(dataValue, msg)
        } else if (role.startsWith('gt:') || role.startsWith('lt:') || role.startsWith('eq:')) {
          const [operator, two] = role.split(':')
          if (!two || !operator) {
            throw new Error(`Invalid validation role: ${role}`)
          }
          const dataOne = dataValue
          const dataTwo = data[two]

          if (dataTwo === undefined) {
            throw new Error(`key ${two} not found`)
          }

          if (operator === 'gt') { // greater than
            if (!(dataOne > dataTwo)) {
              throw new ValidationError(msg ?? `${key} harus lebih besar dari ${two}`)
            }
          } else if (operator === 'lt') { // less than
            if (!(dataOne < dataTwo)) {
              throw new ValidationError(msg ?? `${key} harus lebih kecil dari ${two}`)
            }
          } else if (operator === 'eq') { // equal
            if (!(dataOne === dataTwo)) {
              throw new ValidationError(msg ?? `${key} harus sama dengan ${two}`)
            }
          }
        } else {
          // Pengecekan type data
          const dataType = ['string', 'number', 'boolean']
          if (dataType.includes(role)) {
            this.mustBe(dataValue, role, msg)
          }
        }
      }
    })
  }
}

// Check type data juga termasuk array
module.exports.checkType = (data, type) => {
  // cek tipe data adalah array
  if (type === 'array') {
    return Array.isArray(data)
  }
  return typeof data !== type
}

// sama dengan checkType, tapi jika salah Error
module.exports.mustBe = (data, type, errMsg = null) => {
  // cek tipe data adalah array
  if (this.checkType(data, type)) {
    throw new ValidationError(errMsg ?? `Data harus berupa ${type}`)
  }
  return true
}

module.exports.required = (data, errMsg = null) => {
  if (data === undefined || data === null) {
    throw new ValidationError(errMsg ?? 'Data harus diisi')
  }
  return true
}
