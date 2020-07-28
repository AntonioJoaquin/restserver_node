// ======================
// Puerto
// ======================
process.env.PORT = process.env.PORT || 3000;


// ======================
// Entorno
// ======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ======================
// Base de datos
// ======================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/Cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// ======================
// Vencimiento del Token
// ======================
process.env.CADUCIDAD_TOKEN = '48h';


// ======================
// SEED de Autenticación
// ======================
process.env.SEED_AUTENTICACION = process.env.SEED_AUTENTICACION || 'este-es-el-seed-desarrollo';


// ======================
// Google Client ID
// ======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '59727667313-kbtg2dmsjg64ogrce6fe3tuq0lqdm2gs.apps.googleusercontent.com';