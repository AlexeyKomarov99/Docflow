'use client';

import Link from 'next/link';
import useAuthStore from '../store/authStore';

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  const menuItems = {
    secretary: [
      { href: '/tasks', label: 'Мои задачи', icon: '📋' },
      { href: '/archive', label: 'Архив', icon: '📂' },
    ],
    chief: [
      { href: '/tasks', label: 'Мои задачи', icon: '📋' },
      { href: '/archive', label: 'Архив', icon: '📂' },
    ],
    employee: [
      { href: '/tasks', label: 'Мои задания', icon: '📝' },
      { href: '/archive', label: 'Архив', icon: '📂' },
    ],
  };

  const items = user ? menuItems[user.role] || [] : [];

  return (
    <aside className="h-full bg-white rounded-2xl p-4 flex flex-col border border-gray-200">
      <div className="h-full flex flex-col justify-between">
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="space-y-2 pt-4 border-t border-gray-100">
          <Link
            href="/profile"
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>👤</span>
            <span>Профиль</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span>🚪</span>
            <span>Выйти</span>
          </button>
        </div>
      </div>
    </aside>
  );
}