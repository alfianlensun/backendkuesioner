const {database} = require('../database/mysql')
async function QgetMstDosen(){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    select 
                    * 
                    from
                    mst_dosen
                    where
                    active = 1` , 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function QgetMstMahasiswa(){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    select 
                    * 
                    from
                    mst_mahasiswa
                    where
                    active = 1` , 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function QgetMstKuesioner(){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    select 
                    * 
                    from
                    mst_kuesioner
                    where
                    active = 1` , 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function QgetTrxKuesionerMahasiswa(id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    select 
                    * 
                    from
                    trx_kuesioner
                    where
                    id_mst_mahasiswa = ?
                    and
                    active = 1`,[id] , 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function QgetMstKuesionerDetail(id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    select 
                    * 
                    from
                    mst_kuesioner_detail
                    where
                    id_mst_kuesioner = ? 
                    and
                    active = 1` , [id],
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function QupdateMstDosen(data, id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    update 
                    mst_dosen 
                    set
                    ?
                    where id_mst_dosen = ?` , [data, id], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function QdeleteMstDosen(data, id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    update mst_dosen set ? where id_mst_dosen = ?` , [data, id], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}
async function QdeleteMstSemester(data, id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    update mst_semester set ? where id_mst_semester = ?` , [data, id], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}
async function QdeleteMstMataKuliah(data, id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    update mst_mata_kuliah set ? where id_mst_mata_kuliah = ?` , [data, id], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}


async function QupdateMstMahasiswa(data, id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    update 
                    mst_dosen 
                    set
                    ?
                    where id_mst_dosen = ?` , [data, id], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function QupdateMstMahasiswa(data, id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    update 
                    mst_mahasiswa 
                    set
                    ?
                    where id_mst_mahasiswa = ?` , [data, id], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function QdeleteMstMahasiswa(data, id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    update mst_mahasiswa set ? where id_mst_mahasiswa = ?` , [data, id], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function QupdateMstKuesioner(data, id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    update 
                    mst_kuesioner 
                    set
                    ?
                    where id_mst_kuesioner = ?` , [data, id], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function QdeleteMstKuesioner(data, id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    update mst_kuesioner set ? where id_mst_kuesioner = ?` , [data, id], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function QdeleteMstKuesionerDetail(data, id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    update mst_kuesioner_detail set ? where id_mst_kuesioner_detail = ?` , [data, id], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}
async function QupdateMstKuesionerDetail(data, id){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    update 
                    mst_kuesioner_detail 
                    set
                    ?
                    where id_mst_kuesioner_detail = ?` , [data, id], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function QgetKuesionerDiisi(iddosen , idkuesioner){
    return new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    select 
                    *
                    from 
                    trx_kuesioner as a
                    where 
                    id_mst_dosen = ? 
                    and
                    id_mst_kuesioner = ? 
                    and
                    a.active = 1`, 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })
}

async function QgetKuesionerDiisiById(iddosen, idkuesioner, idpertanyaan){
    return new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    select 
                    *
                    from 
                    trx_kuesioner as a
                    where 
                    id_mst_dosen = ? 
                    and
                    id_mst_kuesioner = ? 
                    and
                    id_mst_kuesioner_detail = ?
                    and
                    a.active = 1`, [iddosen, idkuesioner, idpertanyaan], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })
}

module.exports = {
    QdeleteMstSemester,
    QdeleteMstMataKuliah,
    QgetKuesionerDiisiById,
    QgetKuesionerDiisi,
    QgetMstDosen,
    QgetMstMahasiswa,
    QgetMstKuesioner,
    QgetTrxKuesionerMahasiswa,
    QgetMstKuesionerDetail,
    QupdateMstDosen,
    QdeleteMstDosen,
    QupdateMstMahasiswa,
    QdeleteMstMahasiswa,
    QupdateMstKuesioner,
    QdeleteMstKuesioner,
    QdeleteMstKuesionerDetail,
    QupdateMstKuesionerDetail
}