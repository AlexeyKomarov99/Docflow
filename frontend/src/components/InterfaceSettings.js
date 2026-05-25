'use client';

import { useState } from 'react';

const colors = [
  { name: 'Фиолетовый', value: '#796DA6' },
  { name: 'Синий', value: '#3B82F6' },
  { name: 'Зеленый', value: '#10B981' },
  { name: 'Красный', value: '#EF4444' },
  { name: 'Оранжевый', value: '#F97316' },
];

export default function InterfaceSettings() {
  const [accentColor, setAccentColor] = useState('#796DA6');

  return (
    <main className="bg-white rounded-2xl border border-gray-200 p-8 h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Настройки интерфейса</h2>

      <div>
        <label className="block text-gray-600 mb-4 text-sm">Акцентный цвет</label>
        <div className="space-y-3">
          {colors.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setAccentColor(color.value)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg border-2 transition-all ${
                accentColor === color.value
                  ? 'border-[#796DA6] bg-[#796DA6]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: color.value }}
              />
              <span className="text-gray-700">{color.name}</span>
              {accentColor === color.value && (
                <span className="ml-auto text-[#796DA6]">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}