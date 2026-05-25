'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../store/authStore';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden">
        
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

        {/* Правая панель (форма входа) */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="flex justify-center items-center gap-2 mb-6 md:hidden">
            <span className="text-2xl font-bold text-[#796DA6]">Docflow</span>
            <div className="bg-[#796DA6] text-white text-xs font-bold px-2 py-1 rounded">
              DOC
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#796DA6] mb-1">Добро пожаловать</h2>
            <p className="text-gray-500">Пожалуйста, введите ваши данные для входа</p>
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

            <div>
              <label className="sr-only">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] focus:ring-opacity-20 outline-none transition-all placeholder-gray-400 text-[#333333]"
                placeholder="Пароль"
                required
              />
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-[#554D7A] hover:underline"
              >
                Забыли пароль?
              </Link>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#796DA6] hover:bg-[#685b94] active:bg-[#554D7A] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              У вас нет аккаунта?{' '}
              <button
                type="button"
                className="text-[#554D7A] font-medium hover:underline"
              >
                Зарегистрируйтесь
              </button>
            </p>
          </div> */}

          {/* Блок с демо-доступами (оставлен для удобства) */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Демо-доступы:</h3>
            <p className="text-xs text-gray-500">Секретарь: secretary@docflow.ru</p>
            <p className="text-xs text-gray-500">Руководитель: chief@docflow.ru</p>
            <p className="text-xs text-gray-500">Сотрудник: employee@docflow.ru</p>
            <p className="text-xs text-gray-500">Пароль: password123</p>
          </div>
        </div>

      </div>
    </div>
  );
}