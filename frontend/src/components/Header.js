'use client';

import Link from 'next/link';
import useAuthStore from '../store/authStore';

export default function Header() {
  const { user } = useAuthStore();

  const roleLabel = {
    secretary: 'Секретарь',
    chief: 'Руководитель',
    employee: 'Сотрудник',
  };

  return (
    <header className="bg-[#796DA6] text-white py-4 px-6 flex justify-between items-center">
      <Link href="/tasks" className="flex items-center gap-2">
        <span className="text-2xl font-bold">Docflow</span>
        <div className="bg-white text-[#796DA6] text-xs font-bold px-2 py-1 rounded">DOC</div>
      </Link>
      <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="text-right">
          <div className="text-sm font-medium">
            {user ? `${user.lastName} ${user.firstName}` : 'Личный кабинет'}
          </div>
          <div className="text-xs opacity-70">
            {user ? roleLabel[user.role] || '' : ''}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </Link>
    </header>
  );
}