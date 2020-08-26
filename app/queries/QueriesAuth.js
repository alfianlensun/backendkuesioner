const {database} = require('../database/mysql')
async function getDataUserByUsername(username){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    select 
                    * 
                    from
                    mst_auth
                    where
                    username = ?
                    and
                    active = 1` , username, 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function getDataUserDosen(id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    select 
                    * 
                    from
                    mst_dosen
                    where
                    id_mst_auth = ?
                    and
                    active = 1` , id, 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}
async function getDataUserMahasiswa(id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    select 
                    * 
                    from
                    mst_mahasiswa
                    where
                    id_mst_auth = ?
                    and
                    active = 1` , id, 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function createAuthUser(username, password, id_mst_tipe_user){
    const insertdata = {
        username,
        password,
        id_mst_tipe_user
    }
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    insert into mst_auth set ?` , insertdata, 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function updateAuth(data, id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    update mst_auth set ? where id_mst_auth = ?` , [data, id], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

module.exports = {
    updateAuth,
    getDataUserDosen,
    getDataUserMahasiswa,
    getDataUserByUsername,
    createAuthUser
}