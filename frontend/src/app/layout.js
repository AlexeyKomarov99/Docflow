'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '../store/authStore';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './globals.css';

export default function RootLayout({ children }) {
  const { checkAuth, isAuth, user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuth === false) {
      const isAuthPage = pathname === '/login' || 
                         pathname === '/forgot-password' || 
                         pathname === '/reset-password';
      if (!isAuthPage) {
        router.push('/login');
      }
    }
  }, [isAuth, pathname]);

  const isAuthPage = pathname === '/login' || 
                     pathname === '/forgot-password' || 
                     pathname === '/reset-password';

  if (isAuthPage) {
    return (
      <html lang="ru">
        <body>{children}</body>
      </html>
    );
  }

  // Ждем пока checkAuth завершится
  if (!user) {
    return (
      <html lang="ru">
        <body><div className="p-6">Загрузка...</div></body>
      </html>
    );
  }

  return (
    <html lang="ru">
      <body>
        <div className="h-screen bg-[#F8F9FA] flex flex-col overflow-hidden">
          <Header />
          <div className="grid grid-cols-[300px_1fr] gap-6 p-6 flex-1 overflow-hidden">
            <div className='overflow-hidden h-full'>
              <Sidebar />
            </div>
            <div className='overflow-hidden'>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}