'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '../../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Экран успешной отправки
  if (message) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden h-150">
          <div className="flex">
            {/* Левая панель - фиолетовая */}
            <div className="hidden md:flex flex-col w-1/2 bg-[#796DA6] p-10 justify-center text-white h-150">
              <div className="flex items-center gap-2 mb-8">
                <span className="text-3xl font-bold">Docflow</span>
                <div className="bg-white text-[#796DA6] text-xs font-bold px-2 py-1 rounded">DOC</div>
              </div>
              <h1 className="text-4xl font-bold leading-tight mb-6">Электронный документооборот</h1>
              <p className="text-lg opacity-90 leading-relaxed">
                Система `&quot;`живого`&quot;` согласования документов с мгновенными уведомлениями через WebSocket.
              </p>
            </div>

            {/* Правая панель - сообщение об успехе */}
            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center items-center text-center">
              <div className="flex justify-center items-center gap-2 mb-6 md:hidden">
                <span className="text-2xl font-bold text-[#796DA6]">Docflow</span>
                <div className="bg-[#796DA6] text-white text-xs font-bold px-2 py-1 rounded">DOC</div>
              </div>

              <div className="flex justify-center items-center gap-2 mb-6">
                <span className="text-2xl font-bold text-[#796DA6]">Docflow</span>
                <div className="bg-[#796DA6] text-white text-xs font-bold px-2 py-1 rounded">DOC</div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Проверьте почту</h2>
              <p className="text-gray-600 mb-2">{message}</p>
              <p className="text-sm text-gray-400 mb-6">Ссылка для сброса пароля выведена в консоль сервера</p>
              
              <Link 
                href="/login" 
                className="w-full block text-center py-3 bg-[#796DA6] hover:bg-[#685b94] active:bg-[#554D7A] text-white font-medium rounded-lg transition-colors"
              >
                Вернуться ко входу
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Основной экран восстановления пароля
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden h-150">
        
        {/* Левая панель (фиолетовая) */}
        <div className="hidden md:flex flex-col w-1/2 bg-[#796DA6] p-10 justify-center text-white">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-3xl font-bold">Docflow</span>
            <div className="bg-white text-[#796DA6] text-xs font-bold px-2 py-1 rounded">
              DOC
            </div>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Электронный документооборот
          </h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Система `&quot;`живого`&quot;` согласования документов с мгновенными уведомлениями через WebSocket.
          </p>
        </div>

        {/* Правая панель (форма) */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="flex justify-center items-center gap-2 mb-6 md:hidden">
            <span className="text-2xl font-bold text-[#796DA6]">Docflow</span>
            <div className="bg-[#796DA6] text-white text-xs font-bold px-2 py-1 rounded">
              DOC
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-[#796DA6]">Docflow</span>
            <div className="bg-[#796DA6] text-white text-xs font-bold px-2 py-1 rounded">
              DOC
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Восстановление пароля</h2>
            <p className="text-gray-500 text-sm">
              Введите ваш email — мы пришлем ссылку для сброса
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="sr-only">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] focus:ring-opacity-20 outline-none transition-all placeholder-gray-400 text-[#333333]"
                placeholder="Почта"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#796DA6] hover:bg-[#685b94] active:bg-[#554D7A] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Отправка...' : 'Отправить ссылку'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              У вас уже есть аккаунт?{' '}
              <Link href="/login" className="text-[#554D7A] font-medium hover:underline">
                Войти
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}