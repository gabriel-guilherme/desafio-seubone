const express = require('express')
const router = express.Router()
const { upload, substituirImagem } = require('../middlewares/upload')
const authMiddleware = require('../middlewares/authMiddleware')
const recorteController = require('../controllers/recorteController')
//const { deleteCloudinaryFile } = require('../middlewares/upload');
const cloudinary = require('../lib/cloudinary');

const { uploadImage } = require('../middlewares/upload');
//const deleteImage = require('../middlewares/deleteImage'); // se quiser usar também

router.post('/upload', uploadImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  return res.status(201).json({
    message: 'Upload bem-sucedido!',
    link: req.file.path,
    public_id: req.file.filename,
    nomeOriginal: req.file.originalname,
  });
});

router.post('/substituir', substituirImagem, async (req, res) => {

  return res.status(201).json({
    message: 'Upload bem-sucedido!',
    link: req.file.path,
    public_id: req.file.filename,
    deletedInfo,
  });
});


router.delete('/upload', async (req, res) => {
  const { public_id } = req.body;

  //console.log("public id: ", public_id)

  if (!public_id) {
    return res.status(400).json({ success: false, message: 'public_id é obrigatório no corpo da requisição.' });
  }

  //deleteCloudinaryFile(public_id)
});

router.use(authMiddleware)
router.get('/group', recorteController.getGroupRecortes);
router.post('/', recorteController.createRecorte)
router.get('/', recorteController.getRecortes)

router.get('/:id', recorteController.getRecorteById)
router.put('/:id', recorteController.updateRecorte)
router.delete('/:id', recorteController.deleteRecorte)



module.exports = router