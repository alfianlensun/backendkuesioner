const { sendError, sendSuccess, sendUnsuccess } = require("../helpers/ResponseHelper")
const { Qcreate,Qget, QgetAllKuesionerDiisi } = require("../queries/Queries")
const { QgetKuesionerDiisi, QgetKuesionerDiisiById } = require("../queries/QueriesMaster")


async function getKuesionerDiisi(req, reply){
    try {
        const result = await QgetAllKuesionerDiisi()
        let list = {}
        for (const jawaban of result ){
            if (list[jawaban.id_mst_dosen+'-'+jawaban.id_mst_semester+'-'+jawaban.id_mst_kuesioner+'-'+jawaban.id_mst_mata_kuliah+'-'+jawaban.id_mst_kuesioner_detail] === undefined){
                list[jawaban.id_mst_dosen+'-'+jawaban.id_mst_semester+'-'+jawaban.id_mst_kuesioner+'-'+jawaban.id_mst_mata_kuliah+'-'+jawaban.id_mst_kuesioner_detail] = jawaban
            }
        }
        let finaldata = []
        for (const data of Object.keys(list)){
            finaldata.push(list[data])
        }

        sendSuccess(reply, finaldata)
    } catch(err){
        console.log(err)
        sendError(reply,JSON.stringify(err.message))
    }
}

async function createJawabanKuesioner(req, reply){
    try {
        const {header, jawaban, user} = req.body

        for (const item of jawaban){
            await Qcreate('trx_kuesioner', {
                id_mst_dosen: header.dosen.id_mst_dosen,
                id_mst_mata_kuliah: header.mataKuliah.id_mst_mata_kuliah,
                id_mst_semester: header.semester.id_mst_semester,
                id_mst_mahasiswa: user.id_mst_mahasiswa,
                id_mst_kuesioner: header.kuesioner.id_mst_kuesioner,
                id_mst_kuesioner_detail: item.id_mst_kuesioner_detail,
                score: item.value
            })
        }
        
        sendSuccess(reply, {})
    } catch (error) {
        sendError(reply,JSON.stringify(error.message))
    }
}

async function getKuesionerChart(req, reply){
    try {
        const {iddosen, idkuesioner} = req.params
        const listkuesionerdiisi = await QgetKuesionerDiisi(iddosen, idkuesioner)
        let jawaban = {}
        for (const jawab of listkuesionerdiisi){
            if (jawaban[jawab.score] !== undefined){
                jawaban[jawab.score] = parseFloat(jawaban[jawab.score])+1
            } else {
                jawaban[jawab.score] = 1
            }
        }
        let responseData = []
        for (const nilai of Object.keys(jawaban)){
            responseData.push({
                nilai: parseInt(nilai),
                total: jawaban[nilai]
            })
        }
        console.log(responseData)
        sendSuccess(reply, responseData)
    } catch (error) {
        console.log(error)
        sendError(reply,JSON.stringify(error.message))
    }
}

async function getKuesionerChartByIdPertanyaan(req, reply){
    try {
        const {iddosen, idkuesioner, idpertanyaan} = req.params
        const listkuesionerdiisi = await QgetKuesionerDiisiById(iddosen, idkuesioner, idpertanyaan)
        let jawaban = {}
        for (const jawab of listkuesionerdiisi){
            if (jawaban[jawab.score] !== undefined){
                jawaban[jawab.score] = parseFloat(jawaban[jawab.score])+1
            } else {
                jawaban[jawab.score] = 1
            }
        }
        let responseData = []
        for (const nilai of Object.keys(jawaban)){
            responseData.push({
                nilai: parseInt(nilai),
                total: jawaban[nilai]
            })
        }
        console.log(responseData)
        sendSuccess(reply, responseData)
    } catch (error) {
        console.log(error)
        sendError(reply,JSON.stringify(error.message))
    }
}

module.exports = {
    getKuesionerDiisi,
    getKuesionerChartByIdPertanyaan,
    getKuesionerChart,
    createJawabanKuesioner
}