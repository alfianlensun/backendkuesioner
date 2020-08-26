const { sendError, sendSuccess, sendUnsuccess } = require("../helpers/ResponseHelper")
const { Qcreate,Qget } = require("../queries/Queries")


async function createJawabanKuesioner(req, reply){
    try {
        const {header, jawaban, user} = req.body

        for (const item of jawaban){
            await Qcreate('trx_kuesioner', {
                id_mst_dosen: header.id_mst_dosen,
                id_mst_mahasiswa: user.id_mst_mahasiswa,
                id_mst_kuesioner: header.id_mst_kuesioner,
                score: item.value
            })
        }
        
        sendSuccess(reply, {})
    } catch (error) {
        sendError(reply,JSON.stringify(error.message))
    }
}

module.exports = {
    createJawabanKuesioner
}