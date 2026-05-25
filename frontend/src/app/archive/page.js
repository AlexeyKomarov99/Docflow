'use client';

import { useState, useEffect } from 'react';
import api from '../../services/api';
import Link from 'next/link';

export default function ArchivePage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    let isMounted = true;

    const loadArchive = async () => {
      try {
        const params = filter ? { type: filter } : {};
        const { data } = await api.get('/documents/archive', { params });
        if (isMounted) setTasks(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadArchive();
  }, [filter]);

  const filteredTasks = tasks.filter(task =>
    task.title?.toLowerCase().includes(search.toLowerCase()) ||
    task.senderOrg?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="p-4 sm:p-6">Загрузка...</p>;

  return (
    <div className="p-4 sm:p-6 bg-white h-full rounded-2xl overflow-y-auto border border-gray-200">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Архив документов</h1>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Поиск документа"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#796DA6] focus:border-transparent text-[#333333] text-sm"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-[#333333] text-sm focus:outline-none focus:ring-2 focus:ring-[#796DA6] w-full sm:w-auto"
        >
          <option value="">Все типы</option>
          <option value="incoming">Входящие</option>
          <option value="outgoing">Исходящие</option>
        </select>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-600 text-sm">Отправитель</th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-600 text-sm">Заголовок</th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-600 text-sm hidden md:table-cell">Исх. номер</th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-600 text-sm hidden md:table-cell">Дата отправки</th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-600 text-sm">Кому</th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-600 text-sm"></th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 text-sm">Нет документов</td>
              </tr>
            ) : (
              paginatedTasks.map((task) => (
                <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-gray-700 text-sm max-w-[150px] truncate">{task.senderOrg}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-gray-700 text-sm max-w-[200px] truncate">{task.title}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-gray-700 text-sm hidden md:table-cell">{task.outgoingNumber || '—'}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-sm hidden md:table-cell">
                    {task.outgoingDate ? new Date(task.outgoingDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-sm max-w-[150px] truncate">{task.sentTo || '—'}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4">
                    <Link
                      href={`/documents/${task.id}`}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg inline-block"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 p-3 sm:p-4 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[#333333]"
            >
              Назад
            </button>
            <span className="text-xs sm:text-sm text-gray-600">
              {currentPage} из {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-[#333333]"
            >
              Далее
            </button>
          </div>
        )}
      </div>
    </div>
  );
}