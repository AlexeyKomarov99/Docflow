'use client';

const statusMap = {
  pending_registration: 'Ожидает регистрации',
  registered: 'Зарегистрирован',
  assigned: 'Назначен',
  executed: 'Исполнен',
  signed: 'Подписан',
  sent: 'Отправлен',
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending_registration': return 'bg-orange-100 text-orange-600 border-orange-200';
    case 'registered': return 'bg-blue-100 text-blue-600 border-blue-200';
    case 'assigned': return 'bg-purple-100 text-purple-600 border-purple-200';
    case 'executed': return 'bg-green-100 text-green-600 border-green-200';
    case 'signed': return 'bg-teal-100 text-teal-600 border-teal-200';
    case 'sent': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

export default function RequisitesBlock({ document }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Реквизиты документа</h2>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-gray-500 text-sm mb-1">ID</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">{document.id}</div>
        </div>
        <div>
          <label className="block text-gray-500 text-sm mb-1">Тип</label>
          <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            {document.type === 'incoming' ? 'Входящий' : 'Исходящий'}
          </div>
        </div>
        <div>
          <label className="block text-gray-500 text-sm mb-1">Статус</label>
          <div className={`px-4 py-3 rounded-lg border ${getStatusColor(document.status)}`}>
            {statusMap[document.status] || document.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-gray-500 text-sm mb-1">Организация</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">{document.senderOrg || '—'}</div>
        </div>
        <div>
          <label className="block text-gray-500 text-sm mb-1">Заголовок</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">{document.title}</div>
        </div>
        <div>
          <label className="block text-gray-500 text-sm mb-1">ФИО отправителя</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">{document.senderName || '—'}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-gray-500 text-sm mb-1">Подписной номер</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">{document.subscriptionNumber || '—'}</div>
        </div>
        <div>
          <label className="block text-gray-500 text-sm mb-1">Дата подписания</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
            {document.subscriptionDate ? new Date(document.subscriptionDate).toLocaleDateString() : '—'}
          </div>
        </div>
        <div>
          <label className="block text-gray-500 text-sm mb-1">Дата поступления</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
            {document.receivedDate ? new Date(document.receivedDate).toLocaleDateString() : '—'}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-500 text-sm mb-1">Содержание</label>
        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700 whitespace-pre-line min-h-[100px]">
          {document.content}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-500 text-sm mb-1">Срок исполнения</label>
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {document.deadline ? new Date(document.deadline).toLocaleDateString() : '—'}
          </div>
        </div>
        <div>
          <label className="block text-gray-500 text-sm mb-1">Приложений</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">{document.attachmentsCount}</div>
        </div>
        <div>
          <label className="block text-gray-500 text-sm mb-1">Количество листов</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">{document.pagesCount}</div>
        </div>
      </div>
    </div>
  );
}