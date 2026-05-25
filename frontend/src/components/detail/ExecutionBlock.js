'use client';

import { useState } from 'react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

export default function ExecutionBlock({ document, onUpdate }) {
  const { user } = useAuthStore();
  const [executionResult, setExecutionResult] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    try {
      console.log('Sending execute request for document:', document.id);
      const { data } = await api.patch(`/documents/${document.id}/execute`, {
        execution_result: executionResult,
      });
      console.log('Execute response:', data);

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'execution_result');
        await api.post(`/documents/${document.id}/files`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      onUpdate(data);
    } catch (err) {
      console.error('Execute error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await api.get(`/files/${fileId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = window.document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };



  // Сотрудник: ожидание проверки после исполнения
  if (document.status === 'executed' && user?.role === 'employee') {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ожидание результатов</h2>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
          <p className="text-orange-600 font-medium">
            Ваш отчет отправлен на проверку! Ожидайте результат рассмотрения документа в ближайшее время!
          </p>
        </div>
      </div>
    );
  }

  // Руководитель: просмотр результата исполнения
  if ((document.status === 'executed' || document.status === 'signed' || document.status === 'sent') && document.executionResult) {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Результат работы</h2>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-gray-500 text-sm mb-1">Исполнитель</label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
              {document.assignee ? `${document.assignee.lastName} ${document.assignee.firstName} ${document.assignee.middleName || ''}` : '—'}
            </div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm mb-1">Дата исполнения</label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
              {document.executedAt ? new Date(document.executedAt).toLocaleString() : '—'}
            </div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm mb-1">Статус</label>
            <div className="px-4 py-3 bg-green-100 border border-green-200 rounded-lg text-green-600">
              Исполнен
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-500 text-sm mb-1">Отчет об исполнении</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700 whitespace-pre-line min-h-20">
            {document.executionResult || '—'}
          </div>
        </div>

        {/* Прикрепленные файлы */}
        {document.files?.length > 0 && (
          <div className="mb-6">
            <label className="block text-gray-500 text-sm mb-2">Прикрепленные файлы</label>
            {document.files.map((file) => (
              <div key={file.id} className="flex items-center justify-between bg-gray-100 rounded-lg p-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">
                    {file.originalName?.split('.').pop()?.toUpperCase() || 'FILE'}
                  </div>
                  <div>
                    <div className="text-gray-700 font-medium">{file.originalName}</div>
                    <p className="text-gray-500 text-xs">{file.sizeBytes ? `${(file.sizeBytes / 1024 / 1024).toFixed(1)} МБ` : ''}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(file.id, file.originalName)}
                  className="text-orange-500 hover:text-orange-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Сотрудник: форма исполнения
  if (document.status === 'assigned' && user?.role === 'employee') {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Исполнение документа</h2>
          <span className="px-4 py-2 bg-purple-100 border border-purple-200 rounded-lg text-purple-600 text-sm">
            Назначен
          </span>
        </div>

        <div className="mb-6">
          <label className="block text-gray-500 text-sm mb-1">Резолюция</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
            {document.resolutionText || '—'}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-500 text-sm mb-1">Срок исполнения</label>
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {document.deadline ? new Date(document.deadline).toLocaleDateString() : '—'}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-500 text-sm mb-1">Отчет об исполнении</label>
          <textarea
            value={executionResult}
            onChange={(e) => setExecutionResult(e.target.value)}
            placeholder="Опишите результат исполнения..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] outline-none transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-500 text-sm mb-2">Прикрепить файл</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 text-center">
            <p className="text-gray-500 text-sm mb-3">.doc, .docx, .pdf до 10 МБ</p>
            <input
              type="file"
              accept=".doc,.docx,.pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="executionFile"
            />
            <label
              htmlFor="executionFile"
              className="px-6 py-2 bg-[#796DA6] text-white rounded-lg cursor-pointer hover:bg-[#685b94] transition-colors inline-block"
            >
              Выбрать файл
            </label>
            {file && (
              <p className="mt-3 text-green-600 text-sm">✓ {file.name}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleExecute}
            disabled={loading || !executionResult}
            className="px-6 py-2 bg-[#796DA6] hover:bg-[#685b94] text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Отправка...' : 'Исполнить'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}