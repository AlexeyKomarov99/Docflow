'use client';

import { useState } from 'react';
import api from '../../services/api';

export default function OutgoingBlock({ document, onUpdate }) {
  const [outgoingNumber, setOutgoingNumber] = useState('');
  const [outgoingDate, setOutgoingDate] = useState('');
  const [sentTo, setSentTo] = useState(document.senderOrg || '');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!outgoingNumber || !outgoingDate) return;
    setLoading(true);
    try {
      const { data } = await api.patch(`/documents/${document.id}/outgoing`, {
        outgoing_number: outgoingNumber,
        outgoing_date: outgoingDate,
        sent_to: sentTo,
      });
      onUpdate(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Отправка документа</h2>
        <span className="px-4 py-2 bg-teal-100 border border-teal-200 rounded-lg text-teal-600 text-sm">
          Подписан
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-gray-500 text-sm mb-1">Исходящий номер</label>
          <input
            type="text"
            value={outgoingNumber}
            onChange={(e) => setOutgoingNumber(e.target.value)}
            placeholder="ИСХ-2025-001"
            className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-gray-500 text-sm mb-1">Дата отправки</label>
          <input
            type="date"
            value={outgoingDate}
            onChange={(e) => setOutgoingDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] outline-none transition-all"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-500 text-sm mb-1">Кому отправлен</label>
        <input
          type="text"
          value={sentTo}
          onChange={(e) => setSentTo(e.target.value)}
          className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] outline-none transition-all"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-6 py-2 bg-[#796DA6] hover:bg-[#685b94] text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
    </div>
  );
}