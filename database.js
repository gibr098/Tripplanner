const { Pool, Client } = require('pg')

function salva(id,msg) {

    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'rdc',
        password: 'smile',
        port: 5432,
    })
    pool.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        pool.end()
    })
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('insert into cronologia values($1,$2)', [id,msg], (err, res) => {
            done()
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows[0])
            }
        })
    })
}

function stampaCronologia(id){
    var testo='CRONOLOGIA ';
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'rdc',
        password: 'smile',
        port: 5432,
    })
    pool.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        pool.end()
    })
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'rdc',
        password: 'smile',
        port: 5432,
    })
    client.connect()
    client.query('SELECT * from Cronologia where id=$1',[id], (err, res) => {
        for(var i=0;i<res.rows.length;i++){
            testo+=res.rows[i].testo;
        }
        console.log(err, testo)
        client.end()
    });
}

module.exports.salva = salva;
module.exports.stampaCronologia = stampaCronologia;





