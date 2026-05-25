const prisma = require('../prisma');
const multer = require('multer');
const path = require('path');

// Настройка хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8'));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    // Разрешаем только Word и PDF
    const allowed = ['.doc', '.docx', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только файлы .doc, .docx, .pdf'));
    }
  }
}).single('file');

// Загрузка файла
async function uploadFile(req, res) {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    try {
      const { id } = req.params;

      // Проверяем существование документа
      const document = await prisma.document.findUnique({
        where: { id: parseInt(id) }
      });

      if (!document) {
        return res.status(404).json({ message: 'Документ не найден' });
      }

      const file = await prisma.file.create({
        data: {
          documentId: parseInt(id),
          type: req.body.type || 'execution_result',
          originalName: req.file.originalname,
          filePath: req.file.path,
          sizeBytes: req.file.size
        }
      });

      res.status(201).json(file);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  });
}

// Скачивание файла
async function downloadFile(req, res) {
  try {
    const { id } = req.params;

    const file = await prisma.file.findUnique({
      where: { id: parseInt(id) }
    });

    if (!file) {
      return res.status(404).json({ message: 'Файл не найден' });
    }

    res.download(file.filePath, file.originalName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

module.exports = { uploadFile, downloadFile };