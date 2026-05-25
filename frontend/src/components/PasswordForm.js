'use client';

import { useState } from 'react';
import api from '../services/api';

export default function PasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    try {
      await api.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      setMessage('Пароль успешно изменен');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <main className="bg-white rounded-2xl border border-gray-200 p-8 h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Изменение пароля</h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-600 mb-2 text-sm">Текущий пароль</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="text-[#333333] w-full px-4 py-3 bg-[#F3F4F6] rounded-lg border border-gray-200 focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] focus:ring-opacity-20 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2 text-sm">Новый пароль</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-[#333333] w-full px-4 py-3 bg-[#F3F4F6] rounded-lg border border-gray-200 focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] focus:ring-opacity-20 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2 text-sm">Повторите новый пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-[#333333] w-full px-4 py-3 bg-[#F3F4F6] rounded-lg border border-gray-200 focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] focus:ring-opacity-20 outline-none transition-all"
              required
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#796DA6] hover:bg-[#685b94] active:bg-[#554D7A] text-white font-medium rounded-lg transition-colors"
          >
            Изменить пароль
          </button>
        </div>
      </form>
    </main>
  );
}