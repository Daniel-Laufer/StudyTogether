/* eslint-disable default-param-last */
import { Socket } from '../actions';

const initialState = {
  socket: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Socket.SOCKET_CONNECT:
      return {
        ...state,
        Socket: { ...action.socket },
      };
    case socket.SOCKET_DISCONNECT:
      return {
        ...state,
        Socket: null,
      };
    default:
      return state;
  }
};
