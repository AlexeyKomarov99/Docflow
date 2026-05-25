'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/authStore';

export default function HomePage() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const router = useRouter();

  useEffect(() => {
    if (isAuth) {
      router.push('/tasks');
    } else {
      router.push('/login');
    }
  }, [isAuth, router]);

  return <p>Загрузка...</p>;
}