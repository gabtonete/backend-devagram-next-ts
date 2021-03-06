import type {NextApiRequest, NextApiResponse} from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { UsuarioModel } from '../../models/UsuarioModel';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import { politicaCors } from '../../middlewares/politicaCors';
import { SeguidorModel } from '../../models/SeguidorModel';

const pesquisaEndpoint 
    = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any[]>) => {
    try{
        if(req.method === 'GET'){
            if(req?.query?.id){
                const { userId, id } = req?.query;
                const usuarioLogado = await UsuarioModel.findById(userId);

                if(!usuarioLogado){
                    return res.status(400).json({ erro : 'Usuario logado nao encontrado' });
                }
    
                const usuarioASerSeguido = await UsuarioModel.findById(id);
                if(!usuarioASerSeguido){
                    return res.status(400).json({ erro : 'Usuario a ser seguido nao encontrado' });
                }

                const euJaSigoEsseUsuario = await SeguidorModel
                    .find({ usuarioId: usuarioLogado._id, usuarioSeguidoId : usuarioASerSeguido._id });
                    
                const usuarioEncontrado = await UsuarioModel.findById(req?.query?.id);
                
                euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0 ? usuarioEncontrado.segueEsseUsuario = true : false;

                if(!usuarioEncontrado){
                    return res.status(400).json({
                        msg: "usuário não encontrado"
                    })
                };

                usuarioEncontrado.senha = null;
                
                return res.status(200).json(usuarioEncontrado);
            }else{
                const {filtro} = req.query;
                    if(!filtro || filtro.length < 1){
                    return res.status(400).json({erro : 'Favor informar pelo menos 2 caracteres para a busca'});
                }

                const usuariosEncontrados = await UsuarioModel.find({
                    $or: [{ nome : {$regex : filtro, $options: 'i'}}, 
                        { email : {$regex : filtro, $options: 'i'}}
                ]
                });

                usuariosEncontrados.forEach(e => e.senha = null);
                return res.status(200).json(usuariosEncontrados);
            }     
        }
        return res.status(405).json({erro : 'Metodo informado nao e valido'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Nao foi possivel buscar usuarios:' + e});
    }
}

export default politicaCors(validarTokenJWT(conectarMongoDB(pesquisaEndpoint)));