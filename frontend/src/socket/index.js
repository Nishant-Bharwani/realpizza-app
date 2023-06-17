import { io } from 'socket.io-client';
import { config } from '../config';

export const socketInit = () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],

    };

    return io(`${config.API_URL}`, options);
};