'use client';

import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getSocket } from '../../services/socket';
import useAuthStore from '../../store/authStore';
import Link from 'next/link';

export default function TableTasks() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Загрузка задач в зависимости от роли
  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      try {
        let endpoint = '/documents';

        switch (user?.role) {
          case 'secretary':
            endpoint = '/documents/secretary';
            break;
          case 'chief':
            endpoint = '/documents/pending';
            break;
          case 'employee':
            endpoint = '/documents/my-tasks';
            break;
        }

        const { data } = await api.get(endpoint);
        if (isMounted) setTasks(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTasks();

    // WebSocket слушатели
    const socket = getSocket();
    if (socket && user) {
      switch (user.role) {
        case 'secretary':
          socket.on('document_received', (doc) => {
            if (isMounted) setTasks((prev) => [doc, ...prev]);
          });
          socket.on('document_executed', (doc) => {
            if (isMounted) setTasks((prev) => prev.map(t => t.id === doc.id ? { ...t, ...doc } : t));
          });
          socket.on('document_signed', (doc) => {
            if (isMounted) setTasks((prev) => prev.map(t => t.id === doc.id ? { ...t, ...doc } : t));
          });
          socket.on('document_assigned', (doc) => {
            if (isMounted) setTasks((prev) => prev.map(t => t.id === doc.id ? { ...t, ...doc } : t));
          });
          break;
        case 'chief':
          socket.on('document_registered', (doc) => {
            if (isMounted) setTasks((prev) => [doc, ...prev]);
          });
          socket.on('document_executed', (doc) => {
            if (isMounted) setTasks((prev) => prev.map(t => t.id === doc.id ? { ...t, ...doc } : t));
          });
          break;
        case 'employee':
          socket.on('document_assigned', (doc) => {
            if (isMounted) setTasks((prev) => [doc, ...prev]);
          });
          break;
      }
    }

    return () => {
      isMounted = false;
      if (socket) {
        socket.off('document_received');
        socket.off('document_registered');
        socket.off('document_executed');
        socket.off('document_assigned');
        socket.off('document_signed');
      }
    };
  }, [user]);

  // Статусы для отображения
  const statusMap = {
    pending_registration: 'Ожидает регистрации',
    registered: 'Зарегистрирован',
    assigned: 'Назначен',
    executed: 'Исполнен',
    signed: 'Подписан',
  };

  // Цвета статусов
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_registration':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'registered':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'assigned':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'executed':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'signed':
        return 'bg-teal-100 text-teal-600 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Действия в зависимости от роли и статуса
  const renderActions = (task) => {
    const role = user?.role;

    if (role === 'secretary' && task.status === 'pending_registration') {
      return (
        <Link
          href={`/documents/${task.id}`}
          className="px-3 py-1 bg-[#796DA6] text-white text-xs sm:text-sm rounded-lg hover:bg-[#685b94] inline-block whitespace-nowrap"
        >
          Зарегистрировать
        </Link>
      );
    }

    if (role === 'chief' && task.status === 'registered') {
      return (
        <Link
          href={`/documents/${task.id}`}
          className="px-3 py-1 bg-[#796DA6] text-white text-xs sm:text-sm rounded-lg hover:bg-[#685b94] inline-block whitespace-nowrap"
        >
          Визировать
        </Link>
      );
    }

    if (role === 'chief' && task.status === 'executed') {
      return (
        <Link
          href={`/documents/${task.id}`}
          className="px-3 py-1 bg-green-600 text-white text-xs sm:text-sm rounded-lg hover:bg-green-700 inline-block whitespace-nowrap"
        >
          Подписать
        </Link>
      );
    }

    if (role === 'employee' && task.status === 'assigned') {
      return (
        <Link
          href={`/documents/${task.id}`}
          className="px-3 py-1 bg-[#796DA6] text-white text-xs sm:text-sm rounded-lg hover:bg-[#685b94] inline-block whitespace-nowrap"
        >
          Исполнить
        </Link>
      );
    }

    return (
      <Link
        href={`/documents/${task.id}`}
        className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg inline-block"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </Link>
    );
  };

  // Фильтрация по поиску
  const filteredTasks = tasks.filter(task =>
    task.title?.toLowerCase().includes(search.toLowerCase()) ||
    task.senderOrg?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="p-6">Загрузка...</p>;

  const handleGenerate = async () => {
    try {
      await api.post('/documents/incoming/generate');
    } catch (err) {
      console.error(err);
    }
  };

  const roleTitle = {
    secretary: 'Очередь на регистрацию',
    chief: 'На визировании',
    employee: 'Мои задания',
  };

  return (
    <div className="p-4 sm:p-6 bg-white h-full rounded-2xl overflow-y-auto border border-gray-200">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        {roleTitle[user?.role] || 'Мои задачи'}
      </h1>

      {/* Поиск и кнопка генерации */}
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
        
        {user?.role === 'secretary' && (
          <button
            onClick={handleGenerate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#796DA6] text-white rounded-lg hover:bg-[#685b94] transition-colors text-sm w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="sm:inline">Сгенерировать письмо</span>
          </button>
        )}
      </div>

      {/* Таблица */}
      <div className="border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-600 text-sm">Отправитель</th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-600 text-sm">Заголовок</th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-600 text-sm">Статус</th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-600 text-sm hidden md:table-cell">Поступил</th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-600 text-sm hidden md:table-cell">Срок</th>
              <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-600 text-sm">Действие</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 text-sm">Нет задач</td>
              </tr>
            ) : (
              paginatedTasks.map((task) => (
                <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-gray-700 text-sm">{task.senderOrg}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-gray-700 text-sm max-w-[200px] truncate">{task.title}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4">
                    <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                      {statusMap[task.status] || task.status}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-sm hidden md:table-cell">
                    {task.receivedDate ? new Date(task.receivedDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-gray-600 text-sm hidden md:table-cell">
                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4">
                    {renderActions(task)}
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