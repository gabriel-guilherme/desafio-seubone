const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../lib/cloudinary');

const prisma = require('../lib/prisma');

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
  const id  = req.query.id

  //console.log(req.body)
  //console.log(req.query)


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


    upload.single('imagem')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: `Erro no upload: ${err.message}` });
      }

      let path = '';
      let filename = '';

      if (req.file) {
        path = req.file.path;
        filename = req.file.filename;
      }

      try {
        await prisma.Cut.update({
          where: { id: Number(id) },
          data: {
            url_imagem: path,
          },
        });
      } catch (updateErr) {
        return res.status(500).json({ error: 'Erro ao atualizar imagem no banco: ' + updateErr.message });
      }

      return res.status(201).json({
        message: req.file
          ? 'Upload bem-sucedido após exclusão da antiga!'
          : 'Imagem antiga excluída. Nenhum novo arquivo enviado.',
        link: path,
        public_id: filename,
      });
    });

  } catch (err) {
    return res.status(500).json({ error: 'Erro no servidor: ' + err.message });
  }
};

module.exports = {
    upload,
    //deleteCloudinaryFile,
    uploadImage,
    substituirImagem
};