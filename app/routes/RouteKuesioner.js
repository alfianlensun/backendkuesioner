const ControllerKuesioner = require('../controllers/ControllerKuesioner')
async function routes(fastify, option){
    fastify.put('/', ControllerKuesioner.createJawabanKuesioner)
}

module.exports = routes