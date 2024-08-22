import { io } from "socket.io-client";

const localhost = 'http://localhost:3000';

const socket = new io(localhost, {
    auth: {
        token: localStorage.getItem('token'),
      },
});

export default socket;