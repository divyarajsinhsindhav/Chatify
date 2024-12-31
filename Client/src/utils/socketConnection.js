import { io } from "socket.io-client";

const localhost = 'http://localhost:3000';
const token = localStorage.getItem('token');

const socket = io(localhost, {
  autoConnect: false,
  auth: {
    token: token ? token : null,
  },
});

if (token) {
  socket.connect();
}

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;