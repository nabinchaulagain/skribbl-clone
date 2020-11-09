import io from 'socket.io-client';
const socket = io('/', { transports: ['websocket'] });
export default socket;
