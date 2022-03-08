import multer from "multer";
import cosmicjs from "cosmicjs";

const {
    CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICACOES,
    BUCKET_AVATARES,
    BUCKET_PUBLICACOES
} = process.env;

const Cosmic = cosmicjs();
const bucketAvatares = Cosmic.bucket({
    slug: BUCKET_AVATARES,
    write_key: CHAVE_GRAVACAO_AVATARES
});

const bucketPublicacoes = Cosmic.bucket({
    slug: BUCKET_PUBLICACOES,
    write_key: CHAVE_GRAVACAO_PUBLICACOES
});

const storageType = multer.memoryStorage();
const upload = multer({ storage : storageType });

const uploadImagemCosmic = async(req : any) => {
    try {
        if(req?.file?.originalname){
            const media_object = {
                originalname: req.file.originalname,
                buffer: req.file.buffer
            };

            if(req.url && req.url.includes('publicacao')){
                return await bucketPublicacoes.addMedia({ media : media_object });
            }else{
                return await bucketAvatares.addMedia({ media : media_object });
            }
        }
    } catch (e) {
        console.log("Não foi possível adicionar imagem, erro=", e);
    }
};

export {upload, uploadImagemCosmic};