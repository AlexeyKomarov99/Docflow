const prisma = require('../prisma');
const { getIO } = require('../websocket/socket');

// Шаблоны документов
const templates = [
  {
    type: 'Заявление',
    title: 'Заявление о приеме на работу',
    content: 'Прошу принять меня на должность с установлением должностного оклада согласно штатному расписанию.'
  },
  {
    type: 'Письмо',
    title: 'Письмо-запрос о поставке товара',
    content: 'Просим направить коммерческое предложение на поставку оборудования в соответствии с прилагаемой спецификацией.'
  },
  {
    type: 'Акт',
    title: 'Акт сверки взаимных расчетов',
    content: 'Настоящим направляем акт сверки за отчетный период. Просим подписать и вернуть один экземпляр в наш адрес.'
  },
  {
    type: 'Счет',
    title: 'Счет на оплату услуг',
    content: 'Просим оплатить счет за оказанные услуги в соответствии с договором. Оплата производится в течение 10 банковских дней.'
  },
  {
    type: 'Приказ',
    title: 'Приказ о премировании сотрудников',
    content: 'В связи с достижением высоких производственных показателей приказываю премировать сотрудников согласно прилагаемому списку.'
  },
  {
    type: 'Служебная записка',
    title: 'Служебная записка о приобретении оборудования',
    content: 'Прошу разрешить приобрести необходимое оборудование для обеспечения бесперебойной работы отдела.'
  }
];

// Данные для генерации
const organizations = [
  'ООО "Ромашка"', 'АО "Луч"', 'ИП Петров', 'ООО "ТехноСервис"', 
  'ЗАО "Альфа"', 'ООО "СтройГрупп"', 'АО "ИнвестПроект"'
];

const senders = [
  'Иванов И.И.', 'Петрова А.С.', 'Сидоров В.П.', 'Кузнецова Е.М.',
  'Смирнов А.А.', 'Федорова О.В.', 'Морозов Д.Н.', 'Николаева Т.С.'
];

const recipients = [
  'Генеральному директору', 'Начальнику отдела кадров', 'Главному бухгалтеру',
  'Руководителю департамента', 'Директору по развитию'
];

// Генерация случайного числа
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Генерация подписного номера
function generateSubscriptionNumber() {
  return `№${random(1, 999)}-${String(random(1, 99)).padStart(2, '0')}`;
}

// Генерация случайной даты (последние 30 дней)
function randomDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - random(0, daysAgo));
  return date;
}

// Генерация документа
async function generateDocument(req, res) {
  try {
    const template = templates[random(0, templates.length - 1)];
    const org = organizations[random(0, organizations.length - 1)];
    const sender = senders[random(0, senders.length - 1)];
    const recipient = recipients[random(0, recipients.length - 1)];
    
    const docDate = randomDate(30);
    const receivedDate = new Date(docDate);
    receivedDate.setDate(receivedDate.getDate() + random(1, 3));
    const deadline = new Date(Date.now() + random(3, 14) * 24 * 60 * 60 * 1000);

    const document = await prisma.document.create({
      data: {
        type: 'incoming',
        status: 'pending_registration',
        senderOrg: org,
        title: template.title,
        subscriptionNumber: generateSubscriptionNumber(),
        subscriptionDate: docDate,
        senderName: sender,
        sentTo: recipient,
        content: template.content,
        pagesCount: random(1, 10),
        attachmentsCount: random(0, 5),
        receivedDate: receivedDate,
        deadline: deadline,
        createdBy: null
      }
    });

    // WebSocket уведомление секретарю
    const io = getIO();
    io.to('secretary').emit('document_received', {
      id: document.id,
      status: document.status,
      senderOrg: document.senderOrg,
      senderName: document.senderName,
      title: document.title,
      receivedDate: document.receivedDate,
      deadline: document.deadline,
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

module.exports = { generateDocument };