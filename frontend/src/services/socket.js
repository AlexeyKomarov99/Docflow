import { io } from 'socket.io-client';

let socket = null;

export function connectSocket(token) {
  if (socket) {
    socket.disconnect();
  }

  socket = io(process.env.NEXT_PUBLIC_WS_URL, {
    auth: { token: `Bearer ${token}` },
  });

  socket.on('connect', () => {
    console.log('WebSocket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function joinRoom(room) {
  if (socket) {
    socket.emit('join_room', { room });
  }
}

export function leaveRoom(room) {
  if (socket) {
    socket.emit('leave_room', { room });
  }
}