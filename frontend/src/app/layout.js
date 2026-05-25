'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '../store/authStore';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './globals.css';

const AUTH_PAGES = ['/login', '/forgot-password', '/reset-password'];

export default function RootLayout({ children }) {
  const { checkAuth, isAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const isAuthPage = AUTH_PAGES.includes(pathname);

  useEffect(() => {
    checkAuth().finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready && !isAuth && !isAuthPage) {
      router.push('/login');
    }
  }, [ready, isAuth, isAuthPage]);

  if (isAuthPage || !ready) {
    return (
      <html lang="ru">
        <body>{children}</body>
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