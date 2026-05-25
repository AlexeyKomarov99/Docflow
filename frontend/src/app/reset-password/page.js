'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../services/api';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(token ? null : false);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const verifyToken = async () => {
      try {
        await api.get(`/auth/reset-token/${token}`);
        if (isMounted) setValidToken(true);
      } catch {
        if (isMounted) setValidToken(false);
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/reset-password', {
        token,
        password,
      });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Экран загрузки проверки токена
  if (validToken === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500">Проверка токена...</div>
      </div>
    );
  }

  // Экран ошибки токена
  if (validToken === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ошибка</h1>
          <p className="text-red-500 mb-6">Токен недействителен или истек</p>
          <Link
            href="/forgot-password"
            className="inline-block w-full py-3 bg-[#796DA6] hover:bg-[#685b94] text-white font-medium rounded-lg transition-colors"
          >
            Запросить новый сброс
          </Link>
        </div>
      </div>
    );
  }

  // Экран успешного обновления
  if (message) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden h-[600px]">
          {/* Левая панель - фиолетовая */}
          <div className="hidden md:flex flex-col w-1/2 bg-[#796DA6] p-10 justify-center text-white">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-3xl font-bold">Docflow</span>
              <div className="bg-white text-[#796DA6] text-xs font-bold px-2 py-1 rounded">DOC</div>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-6">
              Электронный документооборот
            </h1>
            <p className="text-lg opacity-90 leading-relaxed">
              Система `&quot;`живого`&quot;` согласования документов с мгновенными уведомлениями через WebSocket.
            </p>
          </div>

          {/* Правая панель - успех */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center items-center text-center">
            <div className="flex justify-center items-center gap-2 mb-6">
              <span className="text-2xl font-bold text-[#796DA6]">Docflow</span>
              <div className="bg-[#796DA6] text-white text-xs font-bold px-2 py-1 rounded">DOC</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Пароль обновлен</h2>
            <p className="text-green-600 mb-8">{message}</p>
            <Link href="/login" className="w-full block text-center py-3 bg-[#796DA6] hover:bg-[#685b94] text-white font-medium rounded-lg transition-colors">
              Войти в приложение
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Основной экран — сброс пароля
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden h-[600px]">
        
        {/* Левая панель (фиолетовая) */}
        <div className="hidden md:flex flex-col w-1/2 bg-[#796DA6] p-10 justify-center text-white">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-3xl font-bold">Docflow</span>
            <div className="bg-white text-[#796DA6] text-xs font-bold px-2 py-1 rounded">DOC</div>
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
            <div className="bg-[#796DA6] text-white text-xs font-bold px-2 py-1 rounded">DOC</div>
          </div>

          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-[#796DA6]">Docflow</span>
            <div className="bg-[#796DA6] text-white text-xs font-bold px-2 py-1 rounded">DOC</div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Восстановление пароля</h2>
            <p className="text-gray-500 text-sm">Создайте новый пароль</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="sr-only">Новый пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] focus:ring-opacity-20 outline-none transition-all placeholder-gray-400"
                placeholder="Новый пароль"
                required
              />
            </div>

            <div>
              <label className="sr-only">Повторите новый пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] focus:ring-opacity-20 outline-none transition-all placeholder-gray-400"
                placeholder="Повторите новый пароль"
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
              {loading ? 'Обновление...' : 'Обновить пароль'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}