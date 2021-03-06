import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { UsuarioModel } from '../../models/UsuarioModel';
import { SeguidorModel } from '../../models/SeguidorModel';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { politicaCors } from '../../middlewares/politicaCors';

const listarEndpoint
    = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) => {
        try {
            if (req.method === 'GET') {
                if (req?.query?.userId) {
                    const { userId } = req?.query;
                    const usuarioLogado = await UsuarioModel.findById(userId);

                    if (!usuarioLogado) {
                        return res.status(400).json({ erro: 'Usuario logado nao encontrado' });
                    }

                    const cincoUsuarios = await UsuarioModel.find({ _id: { $ne: userId } }).limit(5).sort({ publicacao: -1 });

                    if (!cincoUsuarios) {
                        return res.status(400).json({ erro: 'Not find five' });
                    }

                    cincoUsuarios.map(usuario => {
                        usuario.senha = null
                    })

                    return res.status(200).json(cincoUsuarios);
                }
            }
            return res.status(405).json({ erro: 'Metodo informado nao e valido' });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ erro: 'Nao foi possivel buscar usuarios:' + e });
        }
    }

export default politicaCors(validarTokenJWT(conectarMongoDB(listarEndpoint)));