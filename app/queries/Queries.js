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

module.exports = {
    Qcreate,
    Qget
}