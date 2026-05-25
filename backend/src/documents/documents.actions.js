const prisma = require('../prisma');
const { getIO } = require('../websocket/socket');

// Секретарь: регистрация документа
async function registerDocument(req, res) {
  try {
    const { id } = req.params;
    const { registration_number, registration_date } = req.body;

    const document = await prisma.document.update({
      where: { id: parseInt(id) },
      data: {
        registrationNumber: registration_number,
        registrationDate: new Date(registration_date),
        status: 'registered'
      }
    });

    const io = getIO();
    io.to('chief').emit('document_registered', {
      id: document.id,
      status: document.status,
      incoming_number: document.registrationNumber,
      incoming_date: document.registrationDate,
      sender_org: document.senderOrg,
      senderOrg: document.senderOrg,
      receivedDate: document.receivedDate,     
      deadline: document.deadline,
      title: document.title
    });

    res.json(document);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

// Руководитель: назначение исполнителя
async function approveDocument(req, res) {
  try {
    const { id } = req.params;
    const { resolution_text, assigned_to, deadline } = req.body;

    const document = await prisma.document.update({
      where: { id: parseInt(id) },
      data: {
        resolutionText: resolution_text,
        assignedTo: parseInt(assigned_to),
        deadline: new Date(deadline),
        status: 'assigned'
      },
      include: {
        assignee: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        }
      }
    });

    const io = getIO();

    // Уведомление сотруднику
    io.to(`employee_${assigned_to}`).emit('document_assigned', {
      id: document.id,
      status: document.status,
      title: document.title,
      senderOrg: document.senderOrg,           
      senderName: document.senderName,         
      receivedDate: document.receivedDate,     
      deadline: document.deadline,
      resolutionText: document.resolutionText,  
      resolution_text: document.resolutionText 
    });

    // Уведомление секретарю
    io.to('secretary').emit('document_assigned', {
      id: document.id,
      status: document.status,
      assignedTo: document.assignedTo,
      assignee: document.assignee,
      resolutionText: document.resolutionText,
      deadline: document.deadline
    });

    res.json(document);
  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

// Сотрудник: исполнение документа
async function executeDocument(req, res) {
  try {
    const { id } = req.params;
    const { execution_result } = req.body;

    const document = await prisma.document.update({
      where: { id: parseInt(id) },
      data: {
        executionResult: execution_result,
        executedAt: new Date(),
        status: 'executed'
      },
      include: {
        assignee: {
          select: { id: true, firstName: true, lastName: true, middleName: true }
        }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const io = getIO();
    io.to('chief').to('secretary').emit('document_executed', {
      id: document.id,
      status: document.status,
      executionResult: document.executionResult,
      executedAt: document.executedAt,
      senderOrg: document.senderOrg,        
      senderName: document.senderName,      
      title: document.title,                
      receivedDate: document.receivedDate,  
      deadline: document.deadline,
      assignee: document.assignee        
    });

    console.log('Rooms:', io.sockets.adapter.rooms);
    console.log('Chief room has:', io.sockets.adapter.rooms.get('chief')?.size || 0, 'clients');

    res.json(document);
  } catch (error) {
    console.error('Execute error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

// Руководитель: подписание документа
async function signDocument(req, res) {
  try {
    const { id } = req.params;

    const document = await prisma.document.update({
      where: { id: parseInt(id) },
      data: {
        signedBy: req.user.id,
        signedAt: new Date(),
        status: 'signed'
      }
    });

    const io = getIO();
    io.to('secretary').emit('document_signed', {
      id: document.id,
      status: document.status,
      signed_at: document.signedAt
    });

    res.json(document);
  } catch (error) {
    console.error('Sign error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

// Секретарь: отправка документа
async function sendDocument(req, res) {
  try {
    const { id } = req.params;
    const { outgoing_number, outgoing_date, sent_to } = req.body;

    const document = await prisma.document.update({
      where: { id: parseInt(id) },
      data: {
        outgoingNumber: outgoing_number,
        outgoingDate: new Date(outgoing_date),
        sentTo: sent_to,
        sentAt: new Date(),
        status: 'sent'
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
      }
    });

    const io = getIO();
    io.to('chief').emit('document_sent', {
      id: document.id,
      status: document.status,
      outgoing_number: document.outgoingNumber,
      outgoing_date: document.outgoingDate,
      sent_to: document.sentTo
    });

    if (document.assignedTo) {
      io.to(`employee_${document.assignedTo}`).emit('document_sent', {
        id: document.id,
        status: document.status,
        outgoing_number: document.outgoingNumber,
        outgoing_date: document.outgoingDate,
        sent_to: document.sentTo
      });
    }

    res.json(document);
  } catch (error) {
    console.error('Send error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

module.exports = {
  registerDocument,
  approveDocument,
  executeDocument,
  signDocument,
  sendDocument
};