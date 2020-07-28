const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autenticacion');

const _ = require('underscore');

const express = require('express');
const app = express();


// ============================
// Obtener todos los productos
// ============================
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.params.desde || 0;
    desde = Number(desde);

    let limite = req.params.limite || 0;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

// ============================
// Obtener un producto por ID
// ============================
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto
            });
        });
});

// ============================
// Buscar productos
// ============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

// ============================
// Crear un producto
// ============================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuarioId
    });

    producto.save((err, nuevoProducto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: nuevoProducto
        });
    });
});

// ============================
// Actualizar un producto por ID
// ============================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            producto
        });
    });
});

// ============================
// Borrar un producto por ID
// ============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let cambioEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            producto
        });
    });
});


module.exports = app;