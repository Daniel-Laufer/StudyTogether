export const SOCKET_CONNECT = 'SOCKET_CONNECT';
export const SOCKET_DISCONNECT = 'SOCKET_DISCONNECT';
import { io } from 'socket.io-client';
import { apiURL } from '../utils/constants';

export function connect(userDetails) {
  return dispatch => {
    const socket = io(apiURL, {
      extraHeaders: {
        userid: userDetails.id,
      },
    });
    socket.on('group-change', () => {
      alert('You got new notification! :');
    });

    console.log('Login_req', res.data.user.id);
    dispatch({ type: SOCKET_CONNECT });
  };
}

export function disconnect() {
  return dispatch => {
    dispatch({ type: SOCKET_DISCONNECT });
  };
}
