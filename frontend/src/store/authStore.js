import { create } from 'zustand';
import api from '../services/api';
import { connectSocket, joinRoom } from '../services/socket';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuth: false,

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    
    localStorage.setItem('access_token', data.access_token);
    
    set({
      user: data.user,
      token: data.access_token,
      isAuth: true,
    });

    connectSocket(data.access_token);
    if (data.user.role === 'employee') {
      joinRoom(`employee_${data.user.id}`);
    } else {
      joinRoom(data.user.role);
    }

    return data;
  },

  checkAuth: async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return false;

      try {
        const { data } = await api.get('/auth/me');
        
        set({
          user: data.user,
          token,
          isAuth: true,
        });

        connectSocket(token);
        if (data.user.role === 'employee') {
          joinRoom(`employee_${data.user.id}`);
        } else {
          joinRoom(data.user.role);
        }
        return true;
      } catch {
        localStorage.removeItem('access_token');
        set({ user: null, token: null, isAuth: false });
        return false;
      }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null, isAuth: false });
    window.location.href = '/login';
  },
}));

export default useAuthStore;