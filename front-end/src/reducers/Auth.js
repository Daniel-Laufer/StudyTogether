/* eslint-disable default-param-last */
import { Auth } from '../actions';

const initialState = {
  loading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Auth.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case Auth.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case Auth.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
};
