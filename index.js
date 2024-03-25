
const express = require('express');
const { dbConnection } = require('./database/config');
// require('dotenv').config()
// const cors = require('cors')

// crear el servidor
const app = express();

// Bases de datos
dbConnection()

// cors
// app.use(cors())

// Directorio publico
app.use( express.static('public') );

// Lectura de los datos enviados en json
app.use( express.json() );

// rutas
app.use('/api/auth', require('./routes/auth'));

app.get('*', (req, res) => {
    res.sendFile( __dirname + '/public/index.html')
})

// Escuchar peticiones
app.listen( 5000, () => {
    console.log(`sv corriendo ${ 5000 }`)
} )
