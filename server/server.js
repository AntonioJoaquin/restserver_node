require('./config/config');


const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const colors = require('colors');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// ANIADIMOS RUTAS
// aniadimos las rutas del usuario
app.use(require('./routes/usuario.js'));

mongoose.connect('mongodb://localhost:27017/Cafe', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    console.log('Base de datos is OK!'.green);
}).catch(err => {
    console.log('Error en la conexion');
    throw err;
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
});