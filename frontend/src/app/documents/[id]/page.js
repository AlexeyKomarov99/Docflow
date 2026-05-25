'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../services/api';
import useAuthStore from '../../../store/authStore';
import RequisitesBlock from '../../../components/detail/RequisitesBlock';
import RegistrationBlock from '../../../components/detail/RegistrationBlock';
import AssignmentBlock from '../../../components/detail/AssignmentBlock';
import ExecutionBlock from '../../../components/detail/ExecutionBlock';
import SigningBlock from '../../../components/detail/SigningBlock';
import OutgoingBlock from '../../../components/detail/OutgoingBlock';
import OutgoingReadonly from '../../../components/detail/OutgoingReadonly';
import { getSocket } from '../../../services/socket';

export default function DocumentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Загрузка документа
  useEffect(() => {
    const loadDocument = async () => {
      try {
        const { data } = await api.get(`/documents/${id}`);
        setDocument(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadDocument();
  }, [id]);

  // 2. WebSocket слушатель
  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      const handleUpdate = (updatedDoc) => {
        if (updatedDoc.id === parseInt(id)) {
          setDocument(prev => ({ ...prev, ...updatedDoc }));
        }
      };

      socket.on('document_registered', handleUpdate);
      socket.on('document_assigned', handleUpdate);
      socket.on('document_executed', handleUpdate);
      socket.on('document_signed', handleUpdate);
      socket.on('document_sent', handleUpdate);
    }
    return () => {
      if (socket) {
        socket.off('document_registered');
        socket.off('document_assigned');
        socket.off('document_executed');
        socket.off('document_signed');
        socket.off('document_sent');
      }
    };
  }, [id]);

  if (loading) return <p className="p-6">Загрузка...</p>;
  if (!document) return <p className="p-6">Документ не найден</p>;

  const showSigning = user?.role === 'chief' && document.status === 'executed';
  const showOutgoing = user?.role === 'secretary' && document.status === 'signed';
  const showOutgoingReadonly = document.status === 'sent';

  return (
    <div className="h-full bg-white rounded-2xl p-6 border border-gray-200 scrollbar-hide">
      <div className='overflow-y-auto h-full scrollbar-hide'>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors mb-6"
        >
          ← Назад
        </button>

        <RequisitesBlock document={document} />
        <RegistrationBlock document={document} onUpdate={setDocument} />
        <AssignmentBlock document={document} onUpdate={setDocument} />
        <ExecutionBlock document={document} onUpdate={setDocument} />
        {showSigning && (
          <SigningBlock document={document} onUpdate={setDocument} />
        )}
        {showOutgoing && (
          <OutgoingBlock document={document} onUpdate={setDocument} />
        )}
        {showOutgoingReadonly && (
          <OutgoingReadonly document={document} />
        )}
      </div>

    </div>
  );
}