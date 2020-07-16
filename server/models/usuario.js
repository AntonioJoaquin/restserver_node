const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};


let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del usuario es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo del usuario es necesairo']
    },
    password: {
        type: String,
        required: [true, 'Se requiere de una contraseña'],
        hide: true
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: rolesValidos,
        default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

/* usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}; */


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
usuarioSchema.plugin(mongooseHidden);


module.exports = mongoose.model('Usuario', usuarioSchema);