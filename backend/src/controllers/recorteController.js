const prisma = require('../lib/prisma');
const { renameCloudinaryFile } = require('../middlewares/upload');

function gerarLinkImagem(tipo_produto, tipo_recorte, material, cor_material) {
  return `${process.env.CLOUD_URL}${tipo_produto}_${tipo_recorte}_${material}_${cor_material}`.toLowerCase().replace(/\s+/g, '-')
}



exports.createRecorte = async (req, res) => {
  try {
    let data = req.body

    const { tipo_produto, tipo_recorte, material, cor_material, sku } = data

    const recorteExistente = await prisma.Cut.findFirst({
      where: { sku: sku },
    })
    if (recorteExistente) {
      return res.status(400).json({ error: 'Recorte já existe com esse SKU' })
    }

    if (!data.url_imagem) {
      data.url_imagem = gerarLinkImagem(tipo_produto, tipo_recorte, material, cor_material)
    }

    const recorte = await prisma.Cut.create({ data: data })
    res.status(201).json(recorte)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.getRecortes = async (req, res) => {

  const recortes = await prisma.Cut.findMany({
    orderBy: { ordem_exibicao: 'asc' },
  })
  res.json(recortes)
}

exports.getRecorteById = async (req, res) => {
  const recorte = await prisma.Cut.findUnique({
    where: { id: parseInt(req.params.id) },
  })
  if (!recorte) {
    return res.status(404).json({ error: 'Recorte não encontrado' })
  }
  res.json(recorte)
}



exports.getGroupRecortes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const filter = req.query.filter;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const whereParam = filter ? { status: parseInt(filter) } : {};

    if(filter === '') {
      whereParam = {}
    }

    //console.log(filter)

    const [recortes, total] = await Promise.all([
      prisma.Cut.findMany({
        skip,
        take: limit,
        orderBy: { ordem_exibicao: 'asc' },
        where: whereParam
      }),
      prisma.Cut.count({ where: whereParam })
    ]);

    res.json({
      data: recortes,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar recortes:', error);
    res.status(500).json({ error: 'Erro ao buscar recortes' });
  }
};

exports.updateRecorte = async (req, res) => {
  try {
    const idParaAtualizar = parseInt(req.params.id);
    const dadosParaAtualizar = req.body;
    const { sku, tipo_produto, tipo_recorte, material, cor_material } = dadosParaAtualizar;

    dadosParaAtualizar.url_imagem = gerarLinkImagem(tipo_produto, tipo_recorte, material, cor_material);

    if (sku !== undefined) {
      const recorteExistenteComMesmoSku = await prisma.Cut.findFirst({
        where: {
          sku: sku,
          id: {
            not: idParaAtualizar
          }
        }
      });

      if (recorteExistenteComMesmoSku) {
        return res.status(400).json({ error: `SKU duplicado` });
      }
    }

    const recorteExistente = await prisma.Cut.findUnique({
      where: { id: idParaAtualizar },
    });

    const updatedRecorte = await prisma.Cut.update({
      where: { id: idParaAtualizar },
      data: dadosParaAtualizar,
    });

    //renameCloudinaryFile(recorteExistente.url_imagem, `${tipo_produto}_${tipo_recorte}_${material}_${cor_material}`);

    res.json(updatedRecorte);

  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: `Recorte com ID ${req.params.id} não encontrado.` });
    }

    res.status(400).json({ error: err.message });
  }
};

exports.deleteRecorte = async (req, res) => {
  try {
    await prisma.Cut.delete({ where: { id: parseInt(req.params.id) } })
    res.sendStatus(204)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}