'use client';

import { useState, useEffect } from 'react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

export default function AssignmentBlock({ document, onUpdate }) {
  const [employees, setEmployees] = useState([]);
  const [assignedTo, setAssignedTo] = useState('');
  const [resolutionText, setResolutionText] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const { data } = await api.get('/users/employees');
        setEmployees(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadEmployees();
  }, []);

  const handleApprove = async () => {
    if (!assignedTo || !deadline) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/documents/${document.id}/approve`, {
        resolution_text: resolutionText,
        assigned_to: parseInt(assignedTo),
        deadline,
      });
      onUpdate(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Readonly — если уже назначен
  if (document.assignedTo && document.status !== 'registered') {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Исполнитель назначен</h2>
        
        <div className="grid grid-cols-3 gap-6 mb-6">
          
          <div>
            <label className="block text-gray-500 text-sm mb-1">Исполнитель</label>
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
              {document.assignee ? `${document.assignee.lastName} ${document.assignee.firstName} ${document.assignee.middleName || ''}` : '—'}
            </div>
          </div>

          <div>
            <label className="block text-gray-500 text-sm mb-1">Срок исполнения</label>
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {document.deadline ? new Date(document.deadline).toLocaleDateString() : '—'}
            </div>
          </div>

          <div>
            <label className="block text-gray-500 text-sm mb-1">Статус</label>
            <div className="px-4 py-3 bg-purple-100 border border-purple-200 rounded-lg text-purple-600">Назначен</div>
          </div>

        </div>

        <div className="mb-6">
          <label className="block text-gray-500 text-sm mb-1">Резолюция руководителя</label>
          <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700 min-h-20">{document.resolutionText || '—'}</div>
        </div>
      </div>
    );
  }

  if (document.status === 'registered' && user?.role === 'chief') {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Назначить исполнителя</h2>
        </div>

        <div className="mb-6">
          <label className="block text-gray-500 text-sm mb-1">Исполнитель</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] outline-none transition-all"
          >
            <option value="">Выбрать сотрудника</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.lastName} {emp.firstName} {emp.middleName || ''}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-500 text-sm mb-1">Срок исполнения</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] outline-none transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-500 text-sm mb-1">Резолюция руководителя</label>
          <textarea
            value={resolutionText}
            onChange={(e) => setResolutionText(e.target.value)}
            placeholder="Текст поручения..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg border border-gray-200 text-[#333333] focus:border-[#796DA6] focus:bg-white focus:ring-2 focus:ring-[#796DA6] outline-none transition-all"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-6 py-2 bg-[#796DA6] hover:bg-[#685b94] text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Назначить'}
          </button>
        </div>
      </div>
    )
  }

  return null;
}