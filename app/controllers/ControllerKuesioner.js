const { sendError, sendSuccess, sendUnsuccess } = require("../helpers/ResponseHelper")
const { Qcreate,Qget, QgetAllKuesionerDiisi } = require("../queries/Queries")
const { QgetKuesionerDiisi, QgetKuesionerDiisiById } = require("../queries/QueriesMaster")
const xls = require('excel4node');

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
        sendSuccess(reply, responseData)
    } catch (error) {
        console.log(error)
        sendError(reply,JSON.stringify(error.message))
    }
}

async function getLaporanKuesioner(req, reply){
    try{
        const wb = new xls.Workbook();
        const ws = wb.addWorksheet('Sheet 1');
        const kuesioner = await QgetAllKuesionerDiisi();

        const style = wb.createStyle({
            font: {
              color: '#FF0800',
              size: 12,
            }
        })
        let listkuesionergroupbyidkuesionerdetail = {}

        for (const k of kuesioner){
            if (listkuesionergroupbyidkuesionerdetail[k.id_mst_kuesioner_detail+'-'+k.id_mst_mata_kuliah] === undefined){
                listkuesionergroupbyidkuesionerdetail[k.id_mst_kuesioner_detail+'-'+k.id_mst_mata_kuliah] = {
                    [k.id_mst_dosen]: {
                        jml: 1,
                        score: k.score,
                        totalitem: 1
                    }
                }
            } else {
                if (listkuesionergroupbyidkuesionerdetail[k.id_mst_kuesioner_detail+'-'+k.id_mst_mata_kuliah][k.id_mst_dosen] === undefined){
                    listkuesionergroupbyidkuesionerdetail[k.id_mst_kuesioner_detail+'-'+k.id_mst_mata_kuliah][k.id_mst_dosen] = {
                        jml: 1,
                        score: k.score,
                        totalitem: 1
                    }
                } else {
                    listkuesionergroupbyidkuesionerdetail[k.id_mst_kuesioner_detail+'-'+k.id_mst_mata_kuliah][k.id_mst_dosen].jml = listkuesionergroupbyidkuesionerdetail[k.id_mst_kuesioner_detail+'-'+k.id_mst_mata_kuliah][k.id_mst_dosen].jml+1
                    listkuesionergroupbyidkuesionerdetail[k.id_mst_kuesioner_detail+'-'+k.id_mst_mata_kuliah][k.id_mst_dosen].score = listkuesionergroupbyidkuesionerdetail[k.id_mst_kuesioner_detail+'-'+k.id_mst_mata_kuliah][k.id_mst_dosen].score+k.score
                    listkuesionergroupbyidkuesionerdetail[k.id_mst_kuesioner_detail+'-'+k.id_mst_mata_kuliah][k.id_mst_dosen].totalitem = listkuesionergroupbyidkuesionerdetail[k.id_mst_kuesioner_detail+'-'+k.id_mst_mata_kuliah][k.id_mst_dosen].totalitem+1
                }
            }
        }


        const result = Object.keys(listkuesionergroupbyidkuesionerdetail).map(idk => {
            const idkuesionerd = idk.split('-')[0]
            const idmk = idk.split('-')[1]
            return Object.keys(listkuesionergroupbyidkuesionerdetail[idk]).map(idd => {
                const dosen = kuesioner.filter(item => item.id_mst_dosen == idd)
                const pertanyaan = kuesioner.filter(item => item.id_mst_kuesioner_detail == idkuesionerd)
                const mk = kuesioner.filter(item => item.id_mst_mata_kuliah == idmk)
                return {
                    dosen: {
                        nama_dosen: dosen[0].nama_dosen,
                        nip: dosen[0].nip
                    },
                    pertanyaan: pertanyaan[0].pertanyaan,
                    mataKuliah: mk[0].nama_mata_kuliah,
                    average: listkuesionergroupbyidkuesionerdetail[idk][idd].score / listkuesionergroupbyidkuesionerdetail[idk][idd].totalitem
                }
            })
        })
        
        ws.cell(2, 1)
            .string('string')
            .style(style);

        await new Promise((rs, rj) => {
            wb.write('Excel.xlsx', function(err, stats) {
                if (err) rj()
                rs()
            });
        })

        reply.sendFile('Excel.xlsx')
    } catch(err){
        sendError(reply,JSON.stringify(err.message))
    }
}

module.exports = {
    getLaporanKuesioner,
    getKuesionerDiisi,
    getKuesionerChartByIdPertanyaan,
    getKuesionerChart,
    createJawabanKuesioner
}