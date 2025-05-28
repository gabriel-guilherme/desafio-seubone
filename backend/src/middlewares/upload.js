const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../lib/cloudinary');

function getPublicIdFromUrl(url) {
  const regex = /.*\/upload\/(?:v\d+\/)?([^\.]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        if (!req.query.public_id) {
            throw new Error('O parâmetro public_id é obrigatório na query para upload.');
        }
        
        return {
            format: 'png',
            public_id: req.query.public_id,
        };
    },
});

const upload = multer({ storage: storage });
const uploadImage = upload.single('imagem');

const substituirImagem = async (req, res) => {
  const nomeAntigo = req.query.nomeAntigo;

  try {

    if (nomeAntigo) {
      const resultDelete = await cloudinary.uploader.destroy(nomeAntigo, {
        resource_type: 'image',
        invalidate: true,
      });

      if (resultDelete.result !== 'ok' && resultDelete.result !== 'not found') {
        return res.status(500).json({ error: `Falha ao excluir a imagem antiga: ${resultDelete.result}` });
      }
    }


    upload.single('imagem')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: `Erro no upload: ${err.message}` });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      return res.status(201).json({
        message: 'Upload bem-sucedido após exclusão da antiga!',
        link: req.file.path,
        public_id: req.file.filename,
      });
    });

  } catch (err) {
    return res.status(500).json({ error: 'Erro no servidor: ' + err.message });
  }
};

async function deleteImageMiddleware(req, res, next) {
  const publicId = req.body.public_id || req.query.public_id;

  if (!publicId) {
    return res.status(400).json({ error: 'Parâmetro "public_id" é obrigatório para exclusão.' });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    });

    if (result.result === 'ok') {
      req.deletedInfo = {
        status: 'sucesso',
        message: `Imagem '${publicId}' excluída com sucesso.`,
      };
      return next();
    } else if (result.result === 'not found') {
      req.deletedInfo = {
        status: 'nao_encontrado',
        message: `Imagem '${publicId}' não encontrada.`,
      };
      return next();
    } else {
      return res.status(500).json({
        error: `Erro inesperado ao excluir imagem '${publicId}'`,
        cloudinaryResponse: result,
      });
    }
  } catch (err) {
    console.error(`Erro ao excluir imagem '${publicId}':`, err);
    return res.status(500).json({
      error: `Erro ao excluir imagem '${publicId}': ${err.message}`,
    });
  }
}

module.exports = {
    upload,
    //deleteCloudinaryFile,
    uploadImage,
    substituirImagem
};