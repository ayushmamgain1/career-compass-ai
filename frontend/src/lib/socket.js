import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket = null;

/**
 * Connects to the backend's Socket.IO server, matching the auth pattern in
 * utils/socket.js on the backend (userId passed via handshake query - that's
 * how the backend keys its onlineUser map).
 *
 * The backend currently only tracks/broadcasts online presence
 * ("getOnlineUsers"). This client is structured so more event listeners can
 * be added later (live interview feedback, job match notifications) without
 * touching call sites elsewhere in the app.
 */
export const connectSocket = (userId) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    query: { userId },
    withCredentials: true,
    reconnectionAttempts: 5,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;