const controllerAuth = require('../controllers/ControllerAuth')
async function routes(fastify, option){
    fastify.get('/', function(request, reply){
        reply.send({error: 'you are not authorize with this page'})
    })
    
    fastify.post('/login', controllerAuth.login)
    fastify.put('/create-user', controllerAuth.createUser)
        
}

module.exports = routes