
const fastify = require('fastify')({
  logger: false
})

fastify.register(require('fastify-multipart'))
fastify.register(require('fastify-cors'), { 
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE']
})

// routes

fastify.register(require('./app/routes/RouteAuth'), {prefix: '/auth'})
fastify.register(require('./app/routes/RouteMaster'), {prefix: '/master'})
fastify.register(require('./app/routes/RouteKuesioner'), {prefix: '/kuesioner'})

// default routes
fastify.get('/', function(req, resp){
  resp.send({
    message: 'your not authorize with this page',
    copyright: 'Kuesioner ©'
  })
})
fastify.listen(4000, '192.168.43.168',function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
  console.log(`server listening on \n ${address}`)
})