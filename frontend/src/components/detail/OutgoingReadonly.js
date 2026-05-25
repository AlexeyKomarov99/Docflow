'use client';

import useAuthStore from '../../store/authStore';

export default function OutgoingReadonly({ document }) {
  const { user } = useAuthStore();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Документ отправлен</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-500 text-sm mb-1">Секретарь</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
            {user ? `${user.lastName} ${user.firstName} ${user.middleName || ''}` : '—'}
          </div>
        </div>

        <div>
          <label className="block text-gray-500 text-sm mb-1">Исходящий номер</label>
          <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {document.outgoingNumber}
          </div>
        </div>

        <div>
          <label className="block text-gray-500 text-sm mb-1">Статус</label>
          <div className="px-4 py-3 bg-yellow-100 border border-yellow-200 rounded-lg text-yellow-600 text-sm">
            Отправлен
          </div>
        </div>

        <div>
          <label className="block text-gray-500 text-sm mb-1">Дата отправки</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
            {document.outgoingDate ? new Date(document.outgoingDate).toLocaleDateString() : '—'}
          </div>
        </div>

        <div>
          <label className="block text-gray-500 text-sm mb-1">Кому отправлен</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
            {document.sentTo || '—'}
          </div>
        </div>
      </div>

    </div>
  );
}