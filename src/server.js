const Hapi = require('@hapi/hapi')

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

  await server.start()
  console.log(`Server sedang berjalan di ${server.info.uri}`)
}

init()
