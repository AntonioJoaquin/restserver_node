const Categoria = require('../models/categoria');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const express = require('express');
const app = express();


// ============================
// Mostrar todas las categorías
// ============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        });
});

// ============================
// Mostrar una categoría por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});

// ============================
// Crear nueva categoría
// ============================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    console.log(req.usuario);
    console.log(req.usuario._id);

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuarioId
    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

        console.log(categoriaBD);
    });
});

// ============================
// Editar categoría
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let nombreCategoria = {
        nombre: body.nombre
    };

    Categoria.findByIdAndUpdate(id, nombreCategoria, { new: true, runValidators: true, context: 'query' }, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});

// ============================
// Eliminar categoría
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});


module.exports = app;