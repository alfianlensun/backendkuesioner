const ControllerKuesioner = require('../controllers/ControllerKuesioner')
async function routes(fastify, option){
    fastify.put('/', ControllerKuesioner.createJawabanKuesioner)
    fastify.get('/diisi', ControllerKuesioner.getKuesionerDiisi)
    fastify.get('/chart-kuesioner/:iddosen/:idkuesioner', ControllerKuesioner.getKuesionerChart)
    fastify.get('/chart-kuesioner/:iddosen/:idkuesioner/:idpertanyaan', ControllerKuesioner.getKuesionerChartByIdPertanyaan)
    fastify.get('/download/laporan', ControllerKuesioner.getLaporanKuesioner)
}

module.exports = routes