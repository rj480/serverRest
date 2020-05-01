const express = require("express");
const app = express();
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const saltRounds = 10;

app.get("/usuarios", function (req, res) {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;
  limite = Number(limite);
  // como segundo parametro pasamos el select de la data
  Usuario.find({estado:true}, "nombre email estado")
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Usuario.count({ estado: true }, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          cantidad: conteo,
        });
      });
    });
});

app.post("/usuarios", function (req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, saltRounds),
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    usuarioDB.password = null;
    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

app.put("/usuarios/:id", function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "role", "img", "estado"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

app.delete("/usuarios/:id", function (req, res) {
  let id = req.params.id;

  Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true },
    (err, usuarioDelete) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        usuario: usuarioDelete,
      });
    }
  );
  // Usuario.findByIdAndRemove(id, (err, usuarioDelete) => {
  //   //primera formar para eliminar el registro de manera permanente
  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       err,
  //     });
  //   }
  //   if (!usuarioDelete) {
  //     return res.status(400).json({
  //       ok: false,
  //       err: {
  //         message: "Usuario no encontrado",
  //       },
  //     });
  //   }
  //   res.json({
  //     ok: true,
  //     usuario: usuarioDelete,
  //   });
  // });
});

module.exports = app;
