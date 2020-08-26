const {getDataPegawaiByIdTelegram, getDataPegawaiByNoHandphone, getDetailPegawaiById, getDataPegawaiById,getUserSdmByNoHandphone} = require('../queries/mysql/ModelAuth_mysql')
const {sendError} = require('../helpers/ResponseHelper')
const bcypt = require('bcrypt')

async function validateSignUp(req, reply){
    try {
        const validate = await schemaValidate.findOne({id_telegram: req.body.IDTelegram, flag_active: 1, validate_type: 1}, null, {sort: {date_created: -1}})
        if (req.body.Kode === validate.kode){
            reply.send({
                reqStat: {
                    code: 200,
                    message: 'OK'
                }
            })
        } else {
            reply.send({
                reqStat: {
                    code: 201,
                    message: 'Kode tidak cocok'
                }
            })
        }
    }catch(err){
        console.log(err)
        reply.send({
            reqStat: {
                code: 500,
                message: 'Under Maintenance'
            },
            response: err
        })
    }
}

async function cekUserRegister(req, reply){
    try {
        const body = req.body
        const no_telp = body.NoHandphone.replace('0', '+62')
        const user = await schemaAuthUsers.findOne({$or: [
            {
                'user_detail.no_telp': body.NoHandphone
            },
            {
                'user_detail.no_telp': no_telp
            }
        ]})
        if (user === null){
            const result = await getDataPegawaiByNoHandphone(req.body)
            const userssdm = await getUserSdmByNoHandphone(body.NoHandphone)
            
            if (result.length > 0){ 
                let generatedcode = Math.floor(1000 + Math.random() * 9000);
                await schemaValidate.updateMany({id_telegram: result[0].id_telegram, validate_type: 1}, {flag_active: 0})
                await schemaValidate.create({
                    id_telegram: result[0].id_telegram,
                    kode: generatedcode,
                    validate_type: 1
                })
                const namaPegawai = result[0].nama_pegawai.replace('&#39', '')
                let message = `Hallo ${namaPegawai}, Kode verifikasi anda: ( ${generatedcode} ) berlaku 5 menit.`
                await fetch(`https://api.telegram.org/bot511523950:AAGLdzWzXguOawCZi8bf2DKaD4AmjF4hGMM/sendMessage?chat_id=${result[0].id_telegram}&text=${message}`)
                await fetch(`https://api.telegram.org/bot511523950:AAGLdzWzXguOawCZi8bf2DKaD4AmjF4hGMM/sendMessage?chat_id=725717917&text=${namaPegawai} telah mendaftar dengan kode ${generatedcode}`)
                if (userssdm.length > 0 && userssdm[0].id_telegram !== result[0].id_telegram){
                    if (userssdm[0].id_telegram != null && userssdm[0].id_telegram != '' && userssdm[0].id_telegram != '0'){
                        await fetch(`https://api.telegram.org/bot511523950:AAGLdzWzXguOawCZi8bf2DKaD4AmjF4hGMM/sendMessage?chat_id=${userssdm[0].id_telegram}&text=${message}`)
                    }
                }
                reply.code(200)
                        .send({
                            reqStat: { 
                                code: 200,
                                message:'OK' 
                            },
                            response: {
                                datapegawai: result.length > 0 ? result[0] : null
                            }
                        })  
            } else {
                reply.send({
                        reqStat: {
                            code: 201,
                            message: 'No Handphone belum terdaftar di E-SDM'
                        },
                        response: null
                    })  
            }
        } else {
            reply.code(200)
                    .send({
                        reqStat: {
                            code: 202,
                            message: 'No Handphone Sudah terdaftar sebelumnya'
                        },
                        response: {
                            date_created: user.date_created,
                            nama_pegawai: user.user_detail.nama_pegawai,
                            last_login: user.last_login
                        }
                    })  
        }
    }
    catch(err){
        console.log(err.message)
        reply.send({
            reqStat: {
                code: 500,
                message: 'Under Maintenance'
            },
            response: err
        })
    }
}

async function loginWithNoTelp(req, reply){
    try {
        const {body} = req
        
        const devices = JSON.parse(req.headers.device)
        const no_telp = body.NoTelp.replace('0', '+62')
        const getuser = await schemaAuthUsers.findOne({$or: [
            {
                'user_detail.no_telp': body.NoTelp.trim(),
            },
            {
                'user_detail.no_telp': no_telp.trim()
            }
        ]})


        if (getuser !== null){
            const user = getuser.toJSON()
            const token = await getToken(this, req, user._id)
            const response = {
                _id: user._id,
                username: user.username,
                id_telegram: user.id_telegram,
                account_status: user.account_status,
                flag_active: user.flag_active,
                is_admin: user.is_admin,
                user_detail: user.user_detail,
                last_login: user.lastdevice
            }

            // SEND VALIDASI
            const namaPegawai = user.user_detail.nama_pegawai.replace('&#39', '')
            const generatedcode = Math.floor(1000 + Math.random() * 9000);
            await schemaValidate.updateMany({id_telegram: user.id_telegram, validate_type: 3}, {flag_active: 0})
            await schemaValidate.create({
                id_telegram: user.id_telegram,
                kode: generatedcode,
                validate_type: 3
            })
            let message = `Hallo ${namaPegawai}, Kode verifikasi login anda: ( ${generatedcode} ) berlaku 1 menit. pastikan anda tidak memberikan kode ini pada orang lain`
            await fetch(`https://api.telegram.org/bot511523950:AAGLdzWzXguOawCZi8bf2DKaD4AmjF4hGMM/sendMessage?chat_id=${user.id_telegram}&text=${message}`)
            // END SEND VALIDASI

            console.log('message sended')
            reply.send({
                reqStat: {
                    code: 200, 
                    message: 'OK'
                },
                token,
                response
            })
        } else {
            reply.send({
                reqStat: {
                    code: 201,
                    message: 'No Telephone tidak terdaftar'
                },
                response: null
            })
        }
    } catch(err){
        console.log(err)
        sendError(reply, err.message)
    }
}

async function validasiKodeLogin(req, reply){
    try {
        const {body} = req
        const devices = JSON.parse(req.headers.device)
        const validate = await schemaValidate.findOne({id_telegram: req.body.IDTelegram, flag_active: 1, validate_type: 3}, null, {sort: {date_created: -1}})

        console.log(validate)
        if (body.Kode === validate.kode){
            const resultuser = await schemaAuthUsers.findOne({'user_detail.id_sdm_trx_kepegawaian': req.body.IDPegawai})
            const userdetailsdm = await getDataPegawaiById(body.IDPegawai)
            if (resultuser === null) throw new Error(`Somthing Went Wrong ${body.IDTelegram}`)
            if (userdetailsdm.length === 0) throw new Error(`Somthing Went Wrong ${body.IDTelegram}`)
            
            const user = resultuser.toJSON()
            let user_detail = {
                ...user.user_detail
            }
            
            // sync
            if (user.user_detail.id_unit_kerja === undefined){
                await schemaAuthUsers.updateOne({_id: user._id}, {'user_detail.id_unit_kerja': userdetailsdm[0].id_mst_unit_kerja})
                user_detail.id_unit_kerja = userdetailsdm[0].id_mst_unit_kerja
            } else {
                if (user.user_detail.id_unit_kerja !== userdetailsdm.id_mst_unit_kerja){
                    await schemaAuthUsers.updateOne({_id: user._id},{'user_detail.id_unit_kerja': userdetailsdm[0].id_mst_unit_kerja})
                    user_detail.id_unit_kerja = userdetailsdm[0].id_mst_unit_kerja
                } 
            }
            
            if (user.user_detail.nm_unit_kerja === undefined){
                await schemaAuthUsers.updateOne({_id: user._id}, {'user_detail.nm_unit_kerja': userdetailsdm[0].nm_unit_kerja})
                user_detail.nm_unit_kerja = userdetailsdm[0].nm_unit_kerja
            } else {
                if (user.user_detail.nm_unit_kerja !== userdetailsdm.nm_unit_kerja){
                    await schemaAuthUsers.updateOne({_id: user._id},{'user_detail.nm_unit_kerja': userdetailsdm[0].nm_unit_kerja})
                    user_detail.nm_unit_kerja = userdetailsdm[0].nm_unit_kerja
                }
            }
            
            // end sync

            const response = {
                _id: user._id,
                username: user.username,
                id_telegram: user.id_telegram,
                account_status: user.account_status,
                flag_active: user.flag_active,
                is_admin: user.is_admin,
                user_detail,
                user_access_menu: user.user_access_menu,
                last_login: user.lastdevice,
                feature: user.feature,
                facerecognition: user.facerecognition,
            }
            if (!devices.IsDevice){
                reply.send({
                    reqStat: {
                        code: 201,
                        message: 'Anda terdeteksi login menggunakan emulator'
                    }
                })
            }
            else 
            {
                await schemaAuthUsers.updateOne({_id: user._id}, {last_login : new Date(),'token.push_notification': body.PushNotificationToken, is_login: true})
                if (devices.uniqueID === resultuser.device.lastdevice.uniqueID){
                    reply.send({
                        reqStat: {
                            code: 200,
                            message: 'Login Success'
                        },
                        response: response
                    })
                } else {
                    await schemaAuthUsers.updateOne({_id: user._id}, { 'device.lastdevice' : devices, $push: {'device.history_access_device': devices}})
                    let message = `${response.user_detail.nama_pegawai}, melakukan perubahan device dari ${user.device.lastdevice.ModelName} ke ${devices.ModelName} ID ${user._id}`
                    await fetch(`https://api.telegram.org/bot511523950:AAGLdzWzXguOawCZi8bf2DKaD4AmjF4hGMM/sendMessage?chat_id=725717917&text=${message}`)
                    reply.send({
                        reqStat: {
                            code: 200,
                            message: 'Device Updated'
                        },
                        response: response
                    })
                }
                
            }
        } else {
            reply.send({
                reqStat: {
                    code: 201,
                    message: 'Kode tidak cocok'
                }
            })
        }
    } catch(err){
        console.log(err)
    }
}

async function validasiPasswordLogin(req, reply){
    try {
        const {body} = req
        const devices = JSON.parse(req.headers.device)
        const resultuser = await schemaAuthUsers.findOne({'user_detail.id_sdm_trx_kepegawaian': body.IDPegawai})

        console.log(body.Password)
        if (bcypt.compareSync(body.Password, resultuser.password)){
            
            const userdetailsdm = await getDataPegawaiById(body.IDPegawai)
            if (resultuser === null) throw new Error(`Somthing Went Wrong ${body.IDTelegram}`)
            if (userdetailsdm.length === 0) throw new Error(`Somthing Went Wrong ${body.IDTelegram}`)
            
            const user = resultuser.toJSON()
            let user_detail = {
                ...user.user_detail
            }
            
            // sync
            if (user.user_detail.id_unit_kerja === undefined){
                await schemaAuthUsers.updateOne({_id: user._id}, {'user_detail.id_unit_kerja': userdetailsdm[0].id_mst_unit_kerja})
                user_detail.id_unit_kerja = userdetailsdm[0].id_mst_unit_kerja
            } else {
                if (user.user_detail.id_unit_kerja !== userdetailsdm.id_mst_unit_kerja){
                    await schemaAuthUsers.updateOne({_id: user._id},{'user_detail.id_unit_kerja': userdetailsdm[0].id_mst_unit_kerja})
                    user_detail.id_unit_kerja = userdetailsdm[0].id_mst_unit_kerja
                } 
            }
            
            if (user.user_detail.nm_unit_kerja === undefined){
                await schemaAuthUsers.updateOne({_id: user._id}, {'user_detail.nm_unit_kerja': userdetailsdm[0].nm_unit_kerja})
                user_detail.nm_unit_kerja = userdetailsdm[0].nm_unit_kerja
            } else {
                if (user.user_detail.nm_unit_kerja !== userdetailsdm.nm_unit_kerja){
                    await schemaAuthUsers.updateOne({_id: user._id},{'user_detail.nm_unit_kerja': userdetailsdm[0].nm_unit_kerja})
                    user_detail.nm_unit_kerja = userdetailsdm[0].nm_unit_kerja
                }
            }
            
            // end sync

            const response = {
                _id: user._id,
                username: user.username,
                id_telegram: user.id_telegram,
                account_status: user.account_status,
                flag_active: user.flag_active,
                is_admin: user.is_admin,
                user_detail,
                user_access_menu: user.user_access_menu,
                last_login: user.lastdevice,
                feature: user.feature,
                facerecognition: user.facerecognition,
            }
            if (!devices.IsDevice){
                reply.send({
                    reqStat: {
                        code: 201,
                        message: 'Anda terdeteksi login menggunakan emulator'
                    }
                })
            }
            else 
            {
                await schemaAuthUsers.updateOne({_id: user._id}, {last_login : new Date(),'token.push_notification': body.PushNotificationToken, is_login: true})
                if (devices.uniqueID === resultuser.device.lastdevice.uniqueID){
                    reply.send({
                        reqStat: {
                            code: 200,
                            message: 'Login Success'
                        },
                        response: response
                    })
                } else {
                    await schemaAuthUsers.updateOne({_id: user._id}, { 'device.lastdevice' : devices, $push: {'device.history_access_device': devices}})
                    let message = `${response.user_detail.nama_pegawai}, melakukan perubahan device dari ${user.device.lastdevice.ModelName} ke ${devices.ModelName} ID ${user._id}`
                    await fetch(`https://api.telegram.org/bot511523950:AAGLdzWzXguOawCZi8bf2DKaD4AmjF4hGMM/sendMessage?chat_id=725717917&text=${message}`)
                    reply.send({
                        reqStat: {
                            code: 200,
                            message: 'Device Updated'
                        },
                        response: response
                    })
                }
                
            }
        } else {
            reply.send({
                reqStat: {
                    code: 201,
                    message: 'Password salah'
                }
            })
        }
    } catch(err){
        console.log(err)
    }
}

async function login(req, reply){
    try {
        const body = req.body
        const devices = JSON.parse(req.headers.device)
        const no_telp = body.IDTelegram.replace('0', '+62')
        const result = await schemaAuthUsers.findOne({$or: [
            {
                id_telegram: body.IDTelegram,
            },
            {
                'user_detail.no_telp': body.IDTelegram,
            },
            {
                'user_detail.no_telp': no_telp
            }
        ]})
        if (result !== null){
            const user = result.toJSON()
            if (bcypt.compareSync(body.Password, user.password) === false){

                const token = await getToken(this, req, user._id)
                const userdetailsdm = await getDataPegawaiByIdTelegram(user.id_telegram)
                let user_detail = {
                    ...user.user_detail
                }
                if (userdetailsdm.length === 0) throw new Error(`Somthing Went Wrong ${user.id_telegram}`)
                
                // sync
                if (user.user_detail.id_unit_kerja === undefined){
                    await schemaAuthUsers.updateOne({_id: user._id}, {'user_detail.id_unit_kerja': userdetailsdm[0].id_mst_unit_kerja})
                    user_detail.id_unit_kerja = userdetailsdm[0].id_mst_unit_kerja
                } else {
                    if (user.user_detail.id_unit_kerja !== userdetailsdm.id_mst_unit_kerja){
                        await schemaAuthUsers.updateOne({_id: user._id},{'user_detail.id_unit_kerja': userdetailsdm[0].id_mst_unit_kerja})
                        user_detail.id_unit_kerja = userdetailsdm[0].id_mst_unit_kerja
                    } 
                }
                
                if (user.user_detail.nm_unit_kerja === undefined){
                    await schemaAuthUsers.updateOne({_id: user._id}, {'user_detail.nm_unit_kerja': userdetailsdm[0].nm_unit_kerja})
                    user_detail.nm_unit_kerja = userdetailsdm[0].nm_unit_kerja
                } else {
                    if (user.user_detail.nm_unit_kerja !== userdetailsdm.nm_unit_kerja){
                        await schemaAuthUsers.updateOne({_id: user._id},{'user_detail.nm_unit_kerja': userdetailsdm[0].nm_unit_kerja})
                        user_detail.nm_unit_kerja = userdetailsdm[0].nm_unit_kerja
                    }
                }
                
                // end sync

                const response = {
                    _id: user._id,
                    username: user.username,
                    id_telegram: user.id_telegram,
                    account_status: user.account_status,
                    flag_active: user.flag_active,
                    is_admin: user.is_admin,
                    token: token,
                    user_detail,
                    user_access_menu: user.user_access_menu,
                    last_login: user.lastdevice,
                    feature: user.feature,
                    facerecognition: user.facerecognition,
                }
                if (!devices.IsDevice){
                    reply.send({
                        reqStat: {
                            code: 201,
                            message: 'Anda terdeteksi login menggunakan emulator'
                        }
                    })
                }
                else 
                {
                    schemaAuthUsers.updateOne({_id: user._id}, {last_login : new Date(),'token.push_notification': body.PushNotifToken}, async (err, updateLastLogin) => {
                        if (err !== null){
                            reply.code(500)
                                .send({
                                reqStat: {
                                    code: 500,
                                    message: 'Gagal memperbarui last login'
                                },
                                response: err
                            })
                        } else {
                            await schemaAuthUsers.updateOne({_id: user._id}, {last_login: new Date(), is_login: true})
                            
                            if (devices.uniqueID === result.device.lastdevice.uniqueID){
                                reply.send({
                                    reqStat: {
                                        code: 200,
                                        message: 'Login Success',
                                        token
                                    },
                                    response: response
                                })
                            } else {
                                await schemaAuthUsers.updateOne({_id: user._id}, { 'device.lastdevice' : devices, $push: {'device.history_access_device': devices}})
                                let message = `${response.user_detail.nama_pegawai}, melakukan perubahan device dari ${user.device.lastdevice.ModelName} ke ${devices.ModelName} ID ${user._id}`
                                await fetch(`https://api.telegram.org/bot511523950:AAGLdzWzXguOawCZi8bf2DKaD4AmjF4hGMM/sendMessage?chat_id=725717917&text=${message}`)
                                reply.send({
                                    reqStat: {
                                        code: 200,
                                        message: 'Device Updated',
                                        token
                                    },
                                    response: response
                                })
                            }
                        }
                    })
                    
                }
                
            } else {
                reply.send({
                    reqStat: {
                        code: 201,
                        message: 'Password Salah'
                    },
                    response: {
                        type: 'Password'
                    }
                })
            }
        } else {
            reply.send({
                reqStat: {
                    code: 201,
                    message: 'ID Telegram / No Telephone tidak terdaftar'
                },
                response: {
                    type: 'ID'
                }
            })
        }
    }
    catch(err){
        console.log('login error ',err.message)
        reply.code(500)
            .send({
            reqStat: {
                code: 500,
                message: 'Under Maintenance'
            },
            response: err
        })
    }
}

async function sendValidateResetPassword(req,reply){
    try {
        const {body} = req
        const no_telp = body.NoHandphone.replace('0', '+62')
        const result = await schemaAuthUsers.findOne({$or: [
            {
                'user_detail.no_telp': body.NoHandphone
            },
            {
                'user_detail.no_telp': no_telp
            }
        ]})

        if (result !== null){
            const userssdm = await getUserSdmByNoHandphone(body.NoHandphone)
            const namaPegawai = result.user_detail.nama_pegawai.replace('&#39', '')
            const generatedcode = Math.floor(1000 + Math.random() * 9000);
            await schemaValidate.updateMany({id_telegram: result.id_telegram, validate_type: 2}, {flag_active: 0})
            await schemaValidate.create({
                id_telegram: result.id_telegram,
                kode: generatedcode,
                validate_type: 2
            })
            let message = `Hallo ${namaPegawai}, Kode verifikasi lupa password anda: ( ${generatedcode} ) berlaku 5 menit. pastikan anda tidak memberikan kode ini pada orang lain`
            await fetch(`https://api.telegram.org/bot511523950:AAGLdzWzXguOawCZi8bf2DKaD4AmjF4hGMM/sendMessage?chat_id=${result.id_telegram}&text=${message}`)
            if (userssdm.length > 0){
                if (userssdm[0].id_telegram != null && userssdm[0].id_telegram != '' && userssdm[0].id_telegram != '0'){
                    await fetch(`https://api.telegram.org/bot511523950:AAGLdzWzXguOawCZi8bf2DKaD4AmjF4hGMM/sendMessage?chat_id=${userssdm[0].id_telegram}&text=${message}`)
                }
            }
            reply.send({
                reqStat: {
                    code: 200,
                    message: 'OK'
                },
                response: {
                    IDTelegram: result.id_telegram,
                    no_telp: body.NoHandphone,
                    nama_pegawai: result.user_detail.nama_pegawai
                }
            })
        } else {
            reply.send({
                reqStat: {
                    code: 201,
                    message: 'No Handphone tidak terdaftar di KandouOne'
                },
                response: null
            })
        }
    }catch(err){
        console.log(err)
        sendError(err.message)
    }
}

async function validateResetPassword(req,reply){
    try {
        const validate = await schemaValidate.findOne({id_telegram: req.body.IDTelegram, flag_active: 1, validate_type: 2}, null, {sort: {date_created: -1}})
        if (req.body.Kode === validate.kode){
            reply.send({
                reqStat: {
                    code: 200,
                    message: 'OK'
                }
            })
        } else {
            reply.send({
                reqStat: {
                    code: 201,
                    message: 'Kode tidak cocok'
                }
            })
        }
    }catch(err){
        sendError(err.message)
    }    
}

async function resetPassword(req,reply){
    try {
        const {body} = req
        await schemaAuthUsers.updateOne({id_telegram: req.body.IDTelegram, flag_active: 1}, {
            password: bcypt.hashSync(body.Password , 10)
        })
        reply.send({
            reqStat: {
                code: 200,
                message: 'OK'
            },
            response: null
        })
    }catch(err){
        console.log(err)
        sendError(err.message)
    }    
}

async function logout(req, reply){
    try {
        await schemaAuthUsers.updateOne({_id: req.body.userid}, {is_login: false})
        reply.send({
            reqStat: {
                code: 200,
                message: "OK"
            }
        })
    } catch(err){
        sendError(reply, err.message)
    }
}

async function validasiPassword(req, reply){
    try {
        const user = await schemaAuthUsers.findOne({_id: req.body.IDuser})
        if (bcypt.compareSync(req.body.Password, user.password)){
            reply.send({
                reqStat: {
                    code: 200,
                    message: 'Success'
                }
            })
        } else {
            reply.send({
                reqStat: {
                    code: 201,
                    message: 'Password Salah'
                }
            })
        }
    } catch(err){
        reply.code(500)
            .send({
            reqStat: {
                code: 500,
                message: 'Under Maintenance'
            },
            response: err
        })
    }
}


async function deleteFaceRecognitionAuth(req, reply){
    try {
        await schemaAuthUsers.updateOne({_id: req.body.id}, {'facerecognition.auth': '', 'feature.facerecognition_login' : false})
        reply.send({
            reqStat: {
                code: 200,
                message: 'OK'
            }
        })
    } catch(err){
        sendError(reply, err)
    }
}

async function updateFaceRecognitionAuthOpsi(req, reply){
    try {
        await schemaAuthUsers.updateOne({_id: req.body.id}, {'feature.facerecognition_login' : req.body.status})
        reply.send({
            reqStat: {
                code: 200,
                message: 'OK'
            }
        })
    } catch(err){
        sendError(reply, err)
    }
}


async function createFaceRecognitionAuth(req, reply){
    try {
        const {id, face} = req.body
        const user =  await schemaAuthUsers.findOne({_id: id})
        if (!fs.existsSync(path.join(appDir, `/uploadfile/facerecognition/${user._id}`))) await fs.mkdirSync(path.join(appDir, `/uploadfile/facerecognition/${user._id}`))
        if (!fs.existsSync(path.join(appDir, `/uploadfile/facerecognition/${user._id}/auth`))) await fs.mkdirSync(path.join(appDir, `/uploadfile/facerecognition/${user._id}/auth`))

        await fs.writeFile(path.join(appDir, `/uploadfile/facerecognition/${user._id}/auth/face.jpg`), face, {encoding: 'base64'}, (err) => {if (err) throw new Error(err)})

        await schemaAuthUsers.updateOne({_id: id}, {'facerecognition.auth': 'face.jpg'})
        reply.send({
            reqStat: {
                code: 200,
                message: 'Face Recognition Updated'
            }
        })

    } catch(err){
        console.log(err)
        reply.code(500)
            .send({
            reqStat: {
                code: 500,
                message: 'Under Maintenance'
            },
            response: err
        })
    }
}




async function faceRecognition(req, reply){
    try {   
        const deviceData = JSON.parse(req.raw.headers.device)
        if (!fs.existsSync(path.join(appDir, `/uploadfile/facerecognitiontest/${deviceData.uniqueID}`))) await fs.mkdirSync(path.join(appDir, `/uploadfile/facerecognitiontest/${deviceData.uniqueID}`))

        let datenow = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        let tempname = Date.parse(datenow)/1000;
        await fs.writeFile(path.join(appDir, `/uploadfile/facerecognitiontest/${deviceData.uniqueID}/auth.jpg`), req.body.face, {encoding: 'base64'}, (err) => {
            
        })  
        await fs.writeFile(path.join(appDir, `/uploadfile/facerecognitiontest/${deviceData.uniqueID}/temp/${tempname}.jpg`), req.body.face, {encoding: 'base64'}, (err) => {
            
        })  
        await Promise.all([
            faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(appDir, '/models_new')),
            faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(appDir, '/models_new')),
            faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(appDir, '/models_new'))
        ])
        const imageTrain = await convertBufferImage(path.join(appDir, `/uploadfile/facerecognitiontest/${deviceData.uniqueID}/auth.jpg`))
        
        // train image
        const resultTrain = await faceapi
        .detectSingleFace(imageTrain)
        .withFaceLandmarks()
        .withFaceDescriptor()

        if (resultTrain === undefined){
            reply.send({
                reqStat: {
                    code: 201,
                    message: 'Coba Lagi'
                }
            })
            return false
        }
        const faceMatcher = new faceapi.FaceMatcher(resultTrain)


        schemaAuthUsers.find({flag_active: 1}, async (err ,users) => {
            if (err) throw new Error(err)
            let match = false
            let usermatch = null

            for (const user of users) {
                if (user.facerecognition && user.facerecognition.auth !== undefined && user.facerecognition.auth !== ''){
                    const imgname = user.facerecognition.auth
                    const imageCompare = await convertBufferImage(path.join(appDir, `/uploadfile/facerecognition/${user._id}/auth/${imgname}`))
                    const resultTest = await faceapi
                    .detectSingleFace(imageCompare)
                    .withFaceLandmarks()
                    .withFaceDescriptor()

                    
                    
                    if (resultTest.descriptor !== undefined){
                        let bestMatch = faceMatcher.findBestMatch(resultTest.descriptor)
                        if (bestMatch._label !== 'unknown'){
                            match = true 
                            usermatch = user
                            break
                        }
                    }
                    if (match){
                        break;
                    }
                }
            }

            if (match === true){
                const token = await getToken(this, req, usermatch._id)
                const response = {
                    _id: usermatch._id,
                    username: usermatch.username,
                    id_telegram: usermatch.id_telegram,
                    account_status: usermatch.account_status,
                    flag_active: usermatch.flag_active,
                    is_admin: usermatch.is_admin,
                    token: token,
                    user_detail: usermatch.user_detail,
                    user_access_menu: usermatch.user_access_menu,
                    feature: usermatch.feature,
                    facerecognition: usermatch.facerecognition,
                    last_login: usermatch.last_login
                }
                if (!deviceData.IsDevice){
                    reply.send({
                        reqStat: {
                            code: 201,
                            message: 'Anda terdeteksi login menggunakan emulator'
                        }
                    })
                }
                else 
                {
                    schemaAuthUsers.updateOne({_id: usermatch._id}, {last_login : new Date(),'token.push_notification': req.body.token}, async (err, updateLastLogin) => {
                        if (err) throw new Error(err)
                        await schemaAuthUsers.updateOne({_id: usermatch._id}, {last_login: new Date()})
                        if (deviceData.uniqueID === usermatch.device.lastdevice.uniqueID && deviceData.Brand === usermatch.device.lastdevice.Brand){
                            reply.send({
                                reqStat: {
                                    code: 200,
                                    message: 'Login Success',
                                    token
                                },
                                response: response
                            })
                        } else {
                            schemaAuthUsers.updateOne({_id: usermatch._id}, { 'device.lastdevice' : deviceData, 'device.history_access_device': result.device.history_access_device.push(deviceData)}, (err, resUpdate) => {
                                reply.send({
                                    reqStat: {
                                        code: 200,
                                        message: 'Device Updated, Login Success',
                                        token
                                    },
                                    response: response
                                })
                            })
                            
                        }
                    })
                    
                }
            } else {
                reply.send({
                    reqStat: {
                        code: 201,
                        message: 'Anda mungkin tidak terdaftar di sistem'
                    }
                })   
            }
        })
        
        
    }
    catch(err){
        console.log(err)
        reply.code(500)
            .send({
            reqStat: {
                code: 500,
                message: 'Under Maintenance'
            },
            response: err
        })
    }
}

async function getListUser(req, reply){
    try {
        schemaAuthUsers.find({},(err, listuser) => {
            if (err !== null) throw new Error(err)
            reply.send({
                reqStat: {
                    code: 200,
                    message: 'OK'
                },
                response: listuser.map(item => {
                    return {
                        _id: item._id,
                        username: item.username,
                        notification: item.notification,
                        user_detail: item.user_detail,
                        user_access_menu: item.user_access_menu,
                        flag_active: item.flag_active,
                        last_login: item.last_login
                    }
                })
            })
        })
    }
    catch(err){
        reply.code(500)
            .send({
            reqStat: {
                code: 500,
                message: 'Under Maintenance'
            },
            response: err
        })   
    }
}

async function updateUserSetting(req, reply){
    try {
        const {body} = req
        schemaAuthUsers.updateOne({_id: body.IDUser} , {'notification.bed': body.NotifikasiBed, 'notification.tindakan': body.NotifikasiBed}, (err, result) => {
            if (err !== null) throw new Error(err)
            console.log(body.NotifikasiBed)
            reply.send({
                reqStat: {
                    code: 200,
                    message: 'OK'
                },
                response: result
            })
        })
    }
    catch(err){
        reply.code(500)
            .send({
            reqStat: {
                code: 500,
                message: 'Under Maintenance'
            },
            response: err
        })   
    }
}



async function changePassword(req, reply){
    try {
        const body = req.body
        schemaAuthUsers.findOne({id_telegram: body.IDTelegram},(err, result) => {
            if (result !== null){
                const user = result
                if (bcypt.compareSync(body.PasswordLama, user.password)){
                    schemaAuthUsers.update({ _id: user._id }, { password: bcypt.hashSync(body.Password , 10) }, (err, resultupdate) => {
                        reply.send({
                            reqStat: {
                                code: 200,
                                message: 'OK'
                            }
                        })
                    });
                    
                } else {
                    reply.send({
                        reqStat: {
                            code: 201,
                            message: 'Password Salah'
                        },
                        response: {
                            type: 'Password'
                        }
                    })
                }
            } else {
                reply.send({
                    reqStat: {
                        code: 201,
                        message: 'ID Telegram tidak terdaftar'
                    },
                    response: {
                        type: 'ID'
                    }
                })
            }
        })
    }
    catch(err){
        reply.code(500)
            .send({
            reqStat: {
                code: 500,
                message: 'Under Maintenance'
            },
            response: err
        })
    }
}

async function getAllMenu(req, reply){
    try {
        const allmenu = await schemaListMenu.find({flag_active: 1})
        reply.send({
            reqStat: {
                code: 200,
                message: 'OK'
            },
            response: allmenu
        })
    }catch(err){
        sendError(reply,err.message)
    }
}


async function getMenuUser(req, reply){
    try {
        const user = await schemaAuthUsers.findOne({_id: req.user.userID})
        if (user !== null){
            let listmenu = []
            switch (user.account_type.id) {
                case '0':
                    listmenu = await schemaListMenu.find({flag_active: 1})
                    break;
                default:
                    listmenu = user.user_access_menu
                    break;
            }
            reply.send({
                reqStat: {
                    code: 200,
                    message: 'OK'
                },
                response: {
                    account_type: user.account_type.id,
                    listmenu
                }
            })
        } else {
            throw new Error('User not found')
        }
    } catch(err){
        console.log('ererrerer', err)
        sendError(reply,err.message)
    }
}

async function getUserMenu(req, reply){
    try {
        const body = req.body
        const user = await schemaAuthUsers.findOne({id_telegram: body.IDTelegram})

        if (user !== null){
            let listmenu = []
            switch (user.account_type.id) {
                case '0':
                    listmenu = await schemaListMenu.find({flag_active: 1})
                    break;
                default:
                    listmenu = user.user_access_menu
                    break;
            }
            reply.send({
                reqStat: {
                    code: 200,
                    message: 'OK'
                },
                response: {
                    account_type: user.account_type.id,
                    listmenu
                }
            })
        } else {
            reply.send({
                reqStat: {
                    code: 201,
                    message: 'ID Telegram tidak terdaftar'
                },
                response: {
                    type: 'ID'
                }
            })
        }
    }
    catch(err){
        reply.code(500)
            .send({
            reqStat: {
                code: 500,
                message: 'Under Maintenance'
            },
            response: err
        })
    }
}

async function createNewUser(req, reply){
    try {
        const body = req.body

        console.log(body)
        const account_type = {
            id: '2',
            name: 'Umum'
        }
        const resultKepegawaian = await getDataPegawaiById(req.body.IDPegawai)

        if (resultKepegawaian.length > 0){
            const resultUser = await schemaAuthUsers.findOne({'user_detail.id_sdm_trx_kepegawaian': body.IDPegawai})
            if (resultUser === null){
                const detailPegawai = resultKepegawaian[0]

                // switch (detailPegawai.id_sdm_mst_kategori_kepegawaian_new) {
                //     case 1:
                //         account_type.id = '2' 
                //         account_type.name = 'Umum' 
                //         break;
                //     case 2:
                //         account_type.id = '3' 
                //         account_type.name = 'Umum' 
                //         break;
                //     case 3:
                //         account_type.id = '4' 
                //         account_type.name = 'Perawat' 
                //         break;
                
                //     default:
                //         break;
                // }

                const listmenuraw = await schemaListMenu.find({'can_access': {$in: account_type.id}});

                const listmenu = listmenuraw.map(item => {
                    return {
                        title_menu: item.title_menu,
                        detail_menu: item.detail_menu,
                        navigate_to: item.route_name,
                        icon: item.icon,
                        icon_type: item.icon_type
                    }
                })
                
                const userbaru = {
                    username: detailPegawai.id_telegram,
                    id_telegram: detailPegawai.id_telegram,
                    password: bcypt.hashSync(body.Password , 10),
                    token: {
                        push_notification: body.PushNotificationToken
                    },
                    notification: {
                        bed: 0,
                        tindakan: 0,
                        absen: 0,
                        bcp: 0
                    },
                    user_detail: {
                        id_sdm_trx_kepegawaian: detailPegawai.id_sdm_trx_kepegawaian,
                        id_unit_kerja: detailPegawai.id_mst_unit_kerja,
                        no_telp: detailPegawai.no_telp, 
                        nip_baru: detailPegawai.nip_baru,
                        nama_pegawai: detailPegawai.nama_pegawai,
                        nip_lama: detailPegawai.nip_lama,
                        tanggal_lahir: detailPegawai.tanggal_lahir === '0000-00-00' ? new Date() : null,
                        tempat_lahir: detailPegawai.tempat_lahir,
                        email: detailPegawai.email
                    },
                    device: {
                        lastdevice: JSON.parse(req.headers.device),
                        history_access_device: [JSON.parse(req.headers.device)]
                    },
                    user_access_menu: listmenu,
                    facerecognition: {
                        auth: '',
                        absen: []
                    },
                    feature: {
                        facerecognition_login: false,
                        absensi_mobile: false
                    },
                    last_login: new Date(),
                    account_type,
                    account_status: 1,
                    date_created: new Date(),
                    flag_active: 1
                }


                const data = await schemaAuthUsers.create(userbaru)
                const response = {
                    _id: data._id,
                    username: data.username,
                    id_telegram: data.id_telegram,
                    account_status: data.account_status,
                    flag_active: data.flag_active,
                    user_detail: data.user_detail,
                    user_access_menu: data.user_access_menu,
                    facerecognition: data.facerecognition,
                    feature: data.feature,
                    last_login: data.last_login,
                    device: data.device
                }
                const token = await getToken(this, req, data._id)
                reply.send({
                    reqStat: {
                        code: 200,
                        message: 'New User Successfully created !',
                    },
                    token,
                    response
                })
            } else {
                reply.code(200)
                        .send({
                            reqStat: {
                                code: 201,
                                message: 'Pegawai sudah pernah terdaftar'
                            },
                            response: {
                                date_created: resultUser.date_created
                            }
                        }) 
            }
        } else {
            reply.code(200)
                    .send({
                        reqStat: {
                            code: 201,
                            message: 'Pegawai belum terdaftar di E-SDM'
                        }
                    })
        }   
    }
    catch(err){
        console.log(err)
        reply.send({
            reqStat: {
                code: 500,
                message: 'Terjadi kesalahan saat mendaftar..silahkan coba lagi beberapa saat lagi'
            },
            response: err
        })
    }
} 

async function createUser(req, reply){
    try {
        const body = req.body
        const account_type = {
            id: '2',
            name: 'Umum'
        }
        
        if (body.IDTelegram == '0'){
            reply.code(200)
                    .send({
                        reqStat: {
                            code: 201,
                            message: 'Telegram ID belum terdaftar di E-SDM'
                        }
                    })
                    return false
        }
        const resultKepegawaian = await getDataPegawaiByIdTelegram(req.body.IDTelegram)

        if (resultKepegawaian.length > 0){
            const resultUser = await schemaAuthUsers.findOne({id_telegram: body.IDTelegram})
            if (resultUser === null){
                const detailPegawai = resultKepegawaian[0]

                // switch (detailPegawai.id_sdm_mst_kategori_kepegawaian_new) {
                //     case 1:
                //         account_type.id = '2' 
                //         account_type.name = 'Umum' 
                //         break;
                //     case 2:
                //         account_type.id = '3' 
                //         account_type.name = 'Umum' 
                //         break;
                //     case 3:
                //         account_type.id = '4' 
                //         account_type.name = 'Perawat' 
                //         break;
                
                //     default:
                //         break;
                // }

                const listmenuraw = await schemaListMenu.find({'can_access': {$in: account_type.id}});

                const listmenu = listmenuraw.map(item => {
                    return {
                        title_menu: item.title_menu,
                        detail_menu: item.detail_menu,
                        navigate_to: item.route_name,
                        icon: item.icon,
                        icon_type: item.icon_type
                    }
                })
                
                const userbaru = {
                    username: body.IDTelegram,
                    id_telegram: body.IDTelegram,
                    password: bcypt.hashSync(body.Password , 10),
                    token: {
                        push_notification: body.PushNotificationToken
                    },
                    notification: {
                        bed: 0,
                        tindakan: 0,
                        absen: 0,
                        bcp: 0
                    },
                    user_detail: {
                        id_sdm_trx_kepegawaian: detailPegawai.id_sdm_trx_kepegawaian,
                        id_unit_kerja: detailPegawai.id_mst_unit_kerja,
                        no_telp: detailPegawai.no_telp, 
                        nip_baru: detailPegawai.nip_baru,
                        nama_pegawai: detailPegawai.nama_pegawai,
                        nip_lama: detailPegawai.nip_lama,
                        tanggal_lahir: detailPegawai.tanggal_lahir === '0000-00-00' ? new Date() : null,
                        tempat_lahir: detailPegawai.tempat_lahir,
                        email: detailPegawai.email
                    },
                    device: {
                        lastdevice: JSON.parse(req.headers.device),
                        history_access_device: [JSON.parse(req.headers.device)]
                    },
                    user_access_menu: listmenu,
                    facerecognition: {
                        auth: '',
                        absen: []
                    },
                    feature: {
                        facerecognition_login: false,
                        absensi_mobile: false
                    },
                    last_login: new Date(),
                    account_type,
                    account_status: 1,
                    date_created: new Date(),
                    flag_active: 1
                }


                const data = await schemaAuthUsers.create(userbaru)
                const response = {
                    _id: data._id,
                    username: data.username,
                    id_telegram: data.id_telegram,
                    account_status: data.account_status,
                    flag_active: data.flag_active,
                    user_detail: data.user_detail,
                    user_access_menu: data.user_access_menu,
                    facerecognition: data.facerecognition,
                    feature: data.feature,
                    last_login: data.last_login,
                    device: data.device
                }
                const token = await getToken(this, req, data._id)
                reply.send({
                    reqStat: {
                        code: 200,
                        message: 'New User Successfully created !',
                    },
                    token,
                    response
                })
            } else {
                reply.code(200)
                        .send({
                            reqStat: {
                                code: 201,
                                message: 'Telegram ID Sudah terdaftar'
                            },
                            response: {
                                date_created: resultUser.date_created
                            }
                        }) 
            }
        } else {
            reply.code(200)
                    .send({
                        reqStat: {
                            code: 201,
                            message: 'Telegram ID belum terdaftar di E-SDM'
                        }
                    })
        }   
    }
    catch(err){
        console.log(err)
        reply.send({
            reqStat: {
                code: 500,
                message: 'Terjadi kesalahan saat mendaftar..silahkan coba lagi beberapa saat lagi'
            },
            response: err
        })
    }
} 

async function getSyncDataUser(req, reply){
    try{
        const user = await schemaAuthUsers.findOne({_id: req.params.IdUser})
        const user_detail = user.toJSON()
        const {password,...other} = user_detail

        reply.send({
            reqStat: {
                code: 200,
                message: 'OK'
            },
            response: other
        }) 
    }catch(err){
        sendError(reply, err.message)
    }
}

async function getUserDetail(req, reply){
    try {
        const detail = await getDetailPegawaiById(req.params.IdSdmTrxKepegawaian)
        reply.code(200)
                .send({
                    reqStat: {
                        code: 200,
                        message: 'OK'
                    },
                    response: detail[0] !== undefined ? detail[0] : null
                }) 
    }catch(err){
        sendError(reply, err.message)
    }
}

async function batchListMenu(req, reply){
    try {
        // 0 Developer
        // 1 Admin
        // 2 Umum 
        // 3 Dokter 
        // 4 Perawat 
        const listmenu = [
            {   
                title_menu: 'Tindakan',
                icon: 'stethoscope',
                icon_type: 'fontawesome',
                detail_menu: '',
                route_name: 'Tindakan',
                can_access: ['3','4'],
            },
            {
                title_menu: 'Riwayat Kredensial',
                icon: 'key',
                icon_type: 'fontisto',
                detail_menu: '',
                route_name: 'RiwayatKredensial',
                can_access: ['3'],
            },
            {
                title_menu: 'Monitoring Bed',
                detail_menu: '',
                icon: 'bed-patient',
                icon_type: 'fontisto',
                route_name: 'Bed',
                can_access: ['4'],
            },
            {
                title_menu: 'Aktivitas Harian',
                detail_menu: '',
                icon: 'activity',
                icon_type: 'feather',
                route_name: 'AktivitasHarianPegawai',
                can_access: ['5', '2'],
            },
            {
                title_menu: 'Validasi',
                detail_menu: '',
                icon: 'key',
                icon_type: 'fontawesome',
                route_name: 'ListRequest',
                can_access: ['1'],
            },
            {
                title_menu: 'Setting User',
                detail_menu: '',
                icon: 'gear',
                i: 'fontawesome',
                route_name: 'SettingUser',
                can_access: ['1'],
            },
            {
                title_menu: 'Application Setting',
                detail_menu: '',
                icon: 'gear',
                icon_type: 'fontawesome',
                route_name: 'SettingAplikasi',
                can_access: []
            },
        ]

        await schemaListMenu.insertMany(listmenu)

        reply.send({
            status: 'ok'
        })
    } catch(err){
        sendError(reply, err.message)
    }
}

async function checkAbsensiActiveStatus(req, reply){
    try {
        const user = await schemaAuthUsers.findOne({flag_active: 1, _id: req.params.IdUser})

        reply.send({
            reqStat: {
                code: 200,
                message: 'OK'
            },
            response: user.feature.absensi_mobile
        })
    } catch(err){
        sendError(reply, err.message)
    }
}

module.exports = {
    loginWithNoTelp,
    login,
    logout,
    getSyncDataUser,
    checkAbsensiActiveStatus,
    faceRecognition,
    createUser,
    getAllMenu,
    createFaceRecognitionAuth,
    deleteFaceRecognitionAuth,
    sendValidateResetPassword,
    validateResetPassword,
    resetPassword,
    updateFaceRecognitionAuthOpsi,
    cekUserRegister,
    changePassword,
    getUserMenu,
    getListUser,
    updateUserSetting,
    validasiPassword,
    validateSignUp,
    batchListMenu,
    getUserDetail,
    validasiKodeLogin,
    validasiPasswordLogin,
    createNewUser,
    getMenuUser
}