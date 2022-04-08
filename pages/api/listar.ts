import type {NextApiRequest, NextApiResponse} from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { UsuarioModel } from '../../models/UsuarioModel';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import { politicaCors } from '../../middlewares/politicaCors';

const listarEndpoint 
    = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any[]>) => {
    try{
        if(req.method === 'GET'){
            if(req?.query?.userId){
                const { userId } = req?.query;
                const usuarioLogado = await UsuarioModel.findById(userId);

                if(!usuarioLogado){
                    return res.status(400).json({ erro : 'Usuario logado nao encontrado' });
                }

                const cincoUsuarios = await UsuarioModel.find({ }).limit(5).sort({ publicacoes: -1 });
                if(!cincoUsuarios){
                    return res.status(400).json({ erro : 'Not find five' });
                }

                cincoUsuarios.map(usuario => {
                    usuario.senha = null
                })
                
                console.log(cincoUsuarios);
                
                return res.status(200).json(cincoUsuarios);
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

export default politicaCors(validarTokenJWT(conectarMongoDB(listarEndpoint)));