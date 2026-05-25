'use client';

import Image from "next/image";

export default function ProfileCard({ activeTab, setActiveTab, user }) {

  const roleLabel = {
    secretary: 'Секретарь',
    chief: 'Руководитель',
    employee: 'Сотрудник',
  };

  const tabs = [
    { id: 'personal', label: 'Персональная информация', icon: '👤' },
    { id: 'password', label: 'Пароль', icon: '🔒' },
    // { id: 'interface', label: 'Интерфейс', icon: '⚙️' },
  ];

  return (
    <aside className="bg-white rounded-2xl p-6 flex flex-col items-center border border-gray-200">
      <div className="relative mb-4">
        <div className="w-32 h-32 rounded-full bg-[#796DA6]/10 flex items-center justify-center border-4 border-gray-100">
          <svg className="w-16 h-16 text-[#796DA6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <button className="absolute bottom-0 right-0 bg-[#796DA6] text-white p-2 rounded-full hover:bg-[#685b94] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      <h2 className="text-xl font-bold text-gray-800 text-center">
        {user?.lastName} {user?.firstName} {user?.middleName}
      </h2>
      <p className="text-gray-500 mb-6">{roleLabel[user?.role] || 'Пользователь'}</p>

      <div className="w-full space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
              activeTab === tab.id
                ? 'bg-[#796DA6] text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}