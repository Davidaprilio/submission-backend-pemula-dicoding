const Hapi = require('@hapi/hapi')
const routes = require('./routes')

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  server.route(routes)

  await server.start()
  console.log(`Server sedang berjalan di ${server.info.uri}`)
  console.log('Submission Bookshelf API - Dicoding')
  console.log('------------------------------------')
  console.log('Nama: David Aprilio')
  console.log('Username: david_april_14')
  console.log('Email: david.14pril@gmail.com')
  console.log('')
  console.log('All test passed!. on nodejs v16.14.0')
}

init()
