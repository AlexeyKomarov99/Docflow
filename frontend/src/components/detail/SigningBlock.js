'use client';

import { useState } from 'react';
import api from '../../services/api';

export default function SigningBlock({ document, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleSign = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/documents/${document.id}/sign`);
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
        <h2 className="text-2xl font-bold text-gray-800">Подписание документа</h2>
        <span className="px-4 py-2 bg-green-100 border border-green-200 rounded-lg text-green-600 text-sm">
          Исполнен
        </span>
      </div>

      <div className="mb-6">
        <label className="block text-gray-500 text-sm mb-1">Исполнитель</label>
        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
          {document.assignee ? `${document.assignee.lastName} ${document.assignee.firstName}` : '—'}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-500 text-sm mb-1">Отчет об исполнении</label>
        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700 whitespace-pre-line">
          {document.executionResult || '—'}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-500 text-sm mb-1">Дата исполнения</label>
        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
          {document.executedAt ? new Date(document.executedAt).toLocaleString() : '—'}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleSign}
          disabled={loading}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Подписание...' : 'Подписать'}
        </button>
      </div>
    </div>
  );
}