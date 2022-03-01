import mongoose, {Schema} from 'mongoose';

const UsuarioSchema = new Schema({
    nome: {type : String, required : true},
    email: {type : String, required : true},
    senha: {type : String, required : true},
    foto: {type : String, required : false},
    avatar : {type : String, required : true},
    seguidores : {type : Number, default : 0},
    seguindo : {type : Number, default : 0},
    publicacoes : {type : Number, default : 0},
});

export const UsuarioModel = (mongoose.models.usuarios ||
    mongoose.model('usuarios', UsuarioSchema));