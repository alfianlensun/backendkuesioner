const { sendError, sendSuccess, sendUnsuccess } = require("../helpers/ResponseHelper")
const { Qcreate,Qget } = require("../queries/Queries")
const { 
    QupdateMstDosen, 
    QdeleteMstDosen,
    QupdateMstMahasiswa,
    QdeleteMstMahasiswa,
    QupdateMstKuesioner,
    QdeleteMstKuesioner,
    QgetMstDosen,
    QgetMstMahasiswa,
    QgetMstKuesioner,
    QgetMstKuesionerDetail,
    QdeleteMstKuesionerDetail,
    QupdateMstKuesionerDetail,
    QgetTrxKuesionerMahasiswa
} = require("../queries/QueriesMaster")
const bcrypt  =require('bcrypt')
const { createAuthUser, updateAuth } = require("../queries/QueriesAuth")


async function getDosen(req, reply){
    try {
        const result = await QgetMstDosen()
        sendSuccess(reply, result)
    } catch (error) {
        sendError(reply,JSON.stringify(error.message))
    }
}

async function getMahasiswa(req, reply){
    try {
        const result = await QgetMstMahasiswa()

        sendSuccess(reply, result)
    } catch (error) {
        sendError(reply,JSON.stringify(error.message))
    }
}

async function getKuesioner(req, reply){
    try {
        const result = await QgetMstKuesioner()

        sendSuccess(reply, result)
    } catch (error) {
        console.log(error)
        sendError(reply,JSON.stringify(error.message))
    }
}

async function getKuesionerMahasiswa(req, reply){
    try {
        const result = await QgetTrxKuesionerMahasiswa(req.params.IDMhs)
        const kuesioner = await QgetMstKuesioner()
        let idskuesioner = []
        for (const item of result){
            if (!idskuesioner.includes(item.id_mst_kuesioner)){
                idskuesioner.push(item.id_mst_kuesioner)
            }
        }
        let finaldata = kuesioner.map(item => {
            let returndata = {
                fillStatus: false,
                ...item
            }
            if (idskuesioner.includes(item.id_mst_kuesioner)){
                returndata.fillStatus = true
            }
            return returndata
        })

        console.log(finaldata)

        sendSuccess(reply, finaldata)
    } catch (error) {
        console.log(error)
        sendError(reply,JSON.stringify(error.message))
    }
}


async function getKuesionerDetail(req, reply){
    try {
        const result = await QgetMstKuesionerDetail(req.params.id)

        sendSuccess(reply, result)
    } catch (error) {
        sendError(reply,JSON.stringify(error.message))
    }
}

async function createDosen(req, reply){
    try {
        const {insertId} = await createAuthUser(req.body.nip, bcrypt.hashSync(req.body.password , 10), 2)    
        const result = await Qcreate('mst_dosen',{
            id_mst_auth: insertId,
            nip: req.body.nip,
            nama_dosen: req.body.namaDosen
        })
        
        sendSuccess(reply, result)
    } catch (error) {
        console.log(error)
        sendError(reply,JSON.stringify(error.message))
    }
}

async function updateDosen(req, reply){
    try {
        await QupdateMstDosen({
            nip: req.body.nip,
            nama_dosen: req.body.namaDosen
        }, req.body.id_mst_dosen)

         await updateAuth({
            username: req.body.nip,
        }, req.body.id_mst_auth)

        if (req.body.password.length > 0){
            await updateAuth({
                password: bcrypt.hashSync(req.body.password, 10),
            }, req.body.id_mst_auth)
        }
        sendSuccess(reply, {})
    } catch (error) {
        console.log(error)
        sendError(reply,JSON.stringify(error.message))
    }
}
async function deleteDosen(req, reply){
    try {
        await QdeleteMstDosen({
            active: 0
        }, req.body.id_mst_dosen)

        await updateAuth({
            active: 0
        }, req.body.id_mst_auth)
        sendSuccess(reply, {})
    } catch (error) {
        sendError(reply,JSON.stringify(error.message))
    }
}

async function createMahasiswa(req, reply){
    try {
        const {insertId} = await createAuthUser(req.body.nim, bcrypt.hashSync(req.body.password , 10), 3)    
        const result = await Qcreate('mst_mahasiswa',{
            id_mst_auth: insertId,
            nim: req.body.nim,
            nama_mahasiswa: req.body.namaMahasiswa
        })
        

        sendSuccess(reply, result)
    } catch (error) {
        console.log(error)
        sendError(reply,JSON.stringify(error.message))
    }
}
async function updateMahasiswa(req, reply){
    try {
        await QupdateMstMahasiswa({
            nim: req.body.nim,
            nama_mahasiswa: req.body.namaMahasiswa
        }, req.body.id_mst_mahasiswa)

         await updateAuth({
            username: req.body.nim,
        }, req.body.id_mst_auth)

        if (req.body.password.length > 0){
            await updateAuth({
                password: bcrypt.hashSync(req.body.password, 10),
            }, req.body.id_mst_auth)
        }
        sendSuccess(reply, {})
    } catch (error) {
        console.log(error)
        sendError(reply,JSON.stringify(error.message))
    }
}

async function deleteMahasiswa(req, reply){
    try {
        await QdeleteMstMahasiswa({
            active: 0
        }, req.body.id_mst_mahasiswa)

        await updateAuth({
            active: 0
        }, req.body.id_mst_auth)
        sendSuccess(reply, {})
    } catch (error) {
        sendError(reply,JSON.stringify(error.message))
    }
}

async function createKuesioner(req, reply){
    try {
        const {insertId} = await Qcreate('mst_kuesioner',{
            nama_kuesioner: req.body.namaKuesioner
        })
        sendSuccess(reply, {
            nama_kuesioner: req.body.namaKuesioner,
            id_mst_kuesioner: insertId
        })
    } catch (error) {
        sendError(reply,JSON.stringify(error.message))
    }
}

async function createKuesionerDetail(req, reply){
    try {
        const result = await Qcreate('mst_kuesioner_detail',{
            id_mst_kuesioner: req.body.idMstKuesioner,
            pertanyaan: req.body.pertanyaan
        })

        sendSuccess(reply, result)
    } catch (error) {
        sendError(reply,JSON.stringify(error.message))
    }
}
async function updateKuesioner(req, reply){
    try {
        const result = await QupdateMstKuesioner({
            nama_kuesioner: req.body.namaKuesioner
        }, req.body.idMstKuesioner)
        sendSuccess(reply, result)
    } catch (error) {
        console.log(error)
        sendError(reply,JSON.stringify(error.message))
    }
}
async function updateKuesionerDetail(req, reply){
    try {
        const result = await QupdateMstKuesionerDetail({
            pertanyaan: req.body.pertanyaan
        }, req.body.idMstKuesionerDetail)
        sendSuccess(reply, result)
    } catch (error) {
        console.log(error)
        sendError(reply,JSON.stringify(error.message))
    }
}

async function deleteKuesioner(req, reply){
    try {
        const result = await QdeleteMstKuesioner({
            active: 0
        }, req.body.idMstKuesioner)
        sendSuccess(reply, result)
    } catch (error) {
        sendError(reply,JSON.stringify(error.message))
    }
}

async function deleteKuesionerDetail(req, reply){
    try {
        const result = await QdeleteMstKuesionerDetail({
            active: 0
        }, req.body.idMstKuesionerDetail)
        sendSuccess(reply, result)
    } catch (error) {
        sendError(reply,JSON.stringify(error.message))
    }
}



module.exports = {
    getDosen,
    getMahasiswa,
    getKuesioner,
    getKuesionerDetail,
    createDosen,
    createMahasiswa,
    createKuesioner,
    createKuesionerDetail,
    updateDosen,
    updateMahasiswa,
    updateKuesioner,
    updateKuesionerDetail,
    deleteDosen,
    deleteMahasiswa,
    deleteKuesioner,
    deleteKuesionerDetail,
    getKuesionerMahasiswa
}