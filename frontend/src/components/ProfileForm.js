'use client';

export default function ProfileForm({ formData, setFormData, onSubmit }) {
  return (
    <main className=" bg-white rounded-2xl border border-gray-200 p-8 h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Персональная информация</h2>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-gray-600 mb-2 text-sm">Имя</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-3 bg-[#F3F4F6] rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] focus:ring-opacity-20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2 text-sm">Отчество</label>
            <input
              type="text"
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              className="w-full px-4 py-3 bg-[#F3F4F6] rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] focus:ring-opacity-20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2 text-sm">Фамилия</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-3 bg-[#F3F4F6] rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] focus:ring-opacity-20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-gray-600 mb-2 text-sm">Почта</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 bg-[#F3F4F6] rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] focus:ring-opacity-20 outline-none transition-all"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#796DA6] hover:bg-[#685b94] active:bg-[#554D7A] text-white font-medium rounded-lg transition-colors"
          >
            Внести изменения
          </button>
        </div>
      </form>
    </main>
  );
}