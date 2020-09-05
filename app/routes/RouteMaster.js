const controllerMaster = require('../controllers/ControllerMaster')
async function routes(fastify, option){
    fastify.get('/', function(request, reply){
        reply.send({error: 'you are not authorize with this page'})
    })
    
    fastify.get('/mahasiswa', controllerMaster.getMahasiswa)
    fastify.put('/mahasiswa', controllerMaster.createMahasiswa)
    fastify.post('/mahasiswa', controllerMaster.updateMahasiswa)
    fastify.delete('/mahasiswa', controllerMaster.deleteMahasiswa)
    fastify.get('/dosen', controllerMaster.getDosen)
    fastify.put('/dosen', controllerMaster.createDosen)
    fastify.post('/dosen', controllerMaster.updateDosen)
    fastify.delete('/dosen', controllerMaster.deleteDosen)
    fastify.get('/kuesioner/:IDMhs', controllerMaster.getKuesionerMahasiswa)
    fastify.get('/kuesioner', controllerMaster.getKuesioner)
    fastify.put('/kuesioner', controllerMaster.createKuesioner)
    fastify.post('/kuesioner', controllerMaster.updateKuesioner)
    fastify.delete('/kuesioner', controllerMaster.deleteKuesioner)
    fastify.get('/kuesioner/detail/:id', controllerMaster.getKuesionerDetail)
    fastify.put('/kuesioner/detail', controllerMaster.createKuesionerDetail)
    fastify.post('/kuesioner/detail', controllerMaster.updateKuesionerDetail)
    fastify.delete('/kuesioner/detail', controllerMaster.deleteKuesionerDetail)
    fastify.get('/mata-kuliah', controllerMaster.getMasterMK)
    fastify.get('/mata-kuliah/:id', controllerMaster.getMasterMKByIdSemester)
    fastify.put('/mata-kuliah', controllerMaster.createMasterMK)
    fastify.delete('/mata-kuliah', controllerMaster.deleteMataKuliah)
    fastify.get('/semester', controllerMaster.getMasterSemester)
    fastify.put('/semester', controllerMaster.createMasterSemester)
    fastify.delete('/semester', controllerMaster.deleteSemester)
}

module.exports = routes