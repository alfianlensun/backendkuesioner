const { createAuthUser, getDataUserByUsername, getDataUserMahasiswa, getDataUserDosen} = require("../queries/QueriesAuth")
const bcrypt = require('bcrypt')
const { sendError, sendSuccess, sendUnsuccess } = require("../helpers/ResponseHelper")

async function login(req, reply){
    try {
        const {username, ...body} = req.body
        const checkUser = await getDataUserByUsername(username)
        if (checkUser.length > 0){
            const {password,...user} = checkUser[0]
            if (bcrypt.compareSync(body.password, password)){
                switch (user.id_mst_tipe_user) {
                    case 1:
                        sendSuccess(reply, {
                            nama_user: 'Admin',
                            ...user
                        })    
                        break;
                    case 2:
                        const dosen = await getDataUserDosen(user.id_mst_auth)
                        sendSuccess(reply, {
                            nama_user: dosen[0].nama_dosen,
                            ...user,
                            ...dosen[0]
                        })    
                        break;
                    case 3:
                        const mahasiswa = await getDataUserMahasiswa(user.id_mst_auth)
                        sendSuccess(reply, {
                            nama_user: mahasiswa[0].nama_mahasiswa,
                            ...user,
                            ...mahasiswa[0]
                        })    
                        break;
                
                    default:
                        sendSuccess(reply, {
                            nama_user: '-',
                            ...user
                        })    
                        break;
                }
            } else {
                sendUnsuccess(reply, 'Password Salah')
            }
        } else {
            sendUnsuccess(reply, "User tidak di temukan")
        }
    } catch(err){
        console.log(err)
        sendError(reply, err.message)
    }
}

async function createUser(req, reply){
    try {
        const {body} = req
        
        const query = await createAuthUser(body.username, bcrypt.hashSync(body.password , 10), body.userType)    
        sendSuccess(reply, query)

    } catch(err){
        sendError(reply, err.message)
    }
}


module.exports = {
    login,
    createUser
}