const {database} = require('../database/mysql')
async function Qget(table){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    select 
                    * 
                    from
                    ${table}
                    where
                    active = 1`, 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function Qcreate(table, data){
    console.log('create data on '+ table)
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                    insert into ${table} set ?` , [data], 
                (error, results, fields) => {
                    connection.release()
                    if (error) reject(error) ;
                    resolve(results)
            });
        });
    })

    return getdata
}

async function QgetAllKuesionerDiisi(){
    const getdata = new Promise((resolve, reject) => {
        database.getConnection((err, connection) => {
            if (err) throw err; 
            connection.query(`
                select * from 
                trx_kuesioner as a
                join mst_kuesioner as b on a.id_mst_kuesioner = b.id_mst_kuesioner
                join mst_dosen as c on a.id_mst_dosen = c.id_mst_dosen
                join mst_semester as d on a.id_mst_semester = d.id_mst_semester
                join mst_mata_kuliah as e on a.id_mst_mata_kuliah = e.id_mst_mata_kuliah
                join mst_kuesioner_detail as f on a.id_mst_kuesioner_detail = f.id_mst_kuesioner_detail
                where 
                a.active = 1        
            `, 
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
    QgetAllKuesionerDiisi,
    Qcreate,
    Qget
}