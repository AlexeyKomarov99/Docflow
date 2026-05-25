'use client';

import { useState } from 'react';
import api from '../../services/api';

export default function RegistrationBlock({ document, onUpdate }) {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!registrationNumber || !registrationDate) return;
    setLoading(true);
    try {
      const { data } = await api.patch(`/documents/${document.id}/register`, {
        registration_number: registrationNumber,
        registration_date: registrationDate,
      });
      onUpdate(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Если уже зарегистрирован — показываем данные только для чтения
  if (document.status === 'registered' || document.registrationNumber) {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Регистрационные данные</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-500 text-sm mb-1">Регистрационный номер</label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">{document.registrationNumber}</div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm mb-1">Дата регистрации</label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
              {document.registrationDate ? new Date(document.registrationDate).toLocaleDateString() : '—'}
            </div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm mb-1">Статус</label>
            <div className="px-4 py-3 bg-blue-100 border border-blue-200 rounded-lg text-blue-600">
              Зарегистрирован
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Если ожидает регистрации — показываем форму
  if (document.status === 'pending_registration') {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Регистрационные данные</h2>
          <span className="px-4 py-2 bg-orange-100 border border-orange-200 rounded-lg text-orange-600 text-sm">
            Ожидает регистрации
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-500 text-sm mb-1">Регистрационный номер</label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="ВХ-2025-001"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-sm mb-1">Дата регистрации</label>
            <input
              type="date"
              value={registrationDate}
              onChange={(e) => setRegistrationDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleRegister}
            disabled={loading}
            className="px-6 py-2 bg-[#796DA6] hover:bg-[#685b94] text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Зарегистрировать'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}