const { Pool, Client } = require('pg')

function salva(citta, nome, via) {

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
        client.query('insert into preferiti values($1,$2,$3)', [citta, nome, via], (err, res) => {
            done()
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows[0])
            }
        })
    })
}

function stampaPreferiti() {
    
}

module.exports.salva = salva;
module.exports.stampaPreferiti = stampaPreferiti;


const { Pool, Client } = require('pg')
app.get('/preferiti', function (req, result) {
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
    client.query('SELECT * from Preferiti', (err, res) => {
        var ris=' ';
        
        for (var i = 0; i < res.rows.length; i++) {
            ris +='<b>' + res.rows[i].citta + '</b></br>' + ' '+res.rows[i].nome + ' in '+'<u>'+res.rows[i].via +'</u></br></br>';
        }
        result.send(ris);
        console.log(err, res)
        client.end()
    })
});


