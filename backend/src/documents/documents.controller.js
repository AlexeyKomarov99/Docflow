const prisma = require('../prisma');

// Получить все документы
async function getAllDocuments(req, res) {
  try {
    const documents = await prisma.document.findMany({
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        },
        assignee: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        },
        signer: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

// Получить документ по ID
async function getDocumentById(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: 'ID документа обязателен' });
    }

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        },
        assignee: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        },
        signer: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        },
        files: true
      }
    });

    if (!document) {
      return res.status(404).json({ message: 'Документ не найден' });
    }

    res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

// Очередь на регистрацию (для секретаря)
async function getRegistrationQueue(req, res) {
  try {
    const documents = await prisma.document.findMany({
      where: { status: 'pending_registration' },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(documents);
  } catch (error) {
    console.error('Get queue error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

// На визировании (для руководителя)
async function getPendingReview(req, res) {
  try {
    const documents = await prisma.document.findMany({
      where: {
        status: { in: ['registered', 'executed'] }
      },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        },
        assignee: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(documents);
  } catch (error) {
    console.error('Get pending error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

// Мои задания (для сотрудника)
async function getMyTasks(req, res) {
  try {
    const documents = await prisma.document.findMany({
      where: {
        status: 'assigned',
        assignedTo: req.user.id
      },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        }
      },
      orderBy: { deadline: 'asc' }
    });

    res.json(documents);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

// Архив (отправленные документы)
async function getArchive(req, res) {
  try {
    const { type } = req.query;
    
    const where = { status: 'sent' };
    
    if (type) {
      where.type = type;
    }

    // Для сотрудника - только его документы
    if (req.user.role === 'employee') {
      where.assignedTo = req.user.id;
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        },
        assignee: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        },
        signer: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        }
      },
      orderBy: { sentAt: 'desc' }
    });

    res.json(documents);
  } catch (error) {
    console.error('Get archive error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

// Все активные документы для секретаря (кроме отправленных)
async function getSecretaryDocuments(req, res) {
  try {
    const documents = await prisma.document.findMany({
      where: {
        status: { not: 'sent' }
      },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        },
        assignee: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        },
        signer: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(documents);
  } catch (error) {
    console.error('Get secretary documents error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

module.exports = {
  getAllDocuments,
  getDocumentById,
  getRegistrationQueue,
  getPendingReview,
  getMyTasks,
  getArchive,
  getSecretaryDocuments
};