import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import NextCors from 'nextjs-cors';
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg';

export const politicaCors = (handler : NextApiHandler) =>
    async (req: NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
        try {
            await NextCors(req, res, {
                methods: ['GET', 'PUT', 'POST'],
                origin: '*',
                optionsSuccessStatus: 200
            })

            return handler(req, res);
            
        }catch (e){
            console.log(e)
        }
}