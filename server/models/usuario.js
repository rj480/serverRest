const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;

let rolesValidos ={
  values:['USER_ROLE','ADMIN_ROLE'],
  message:'{VALUE} no es un role valido'
}

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es requerido"],
  },
  password: {
    type: String,
    required: [true, "El contraseña es requerido"],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: rolesValidos,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});
//removiendo un valor de la respuesta que no quiero mostrar 
usuarioSchema.methods.toJSON = function () {
  let usuario = this;
  let usuarioObjeto = usuario.toObject();
  delete usuarioObjeto.password;
  return usuarioObjeto;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });
module.exports = mongoose.model("Usuario", usuarioSchema);
