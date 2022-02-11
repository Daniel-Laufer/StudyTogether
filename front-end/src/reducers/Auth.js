/* eslint-disable no-console */
/* eslint-disable default-param-last */
import { Auth } from '../actions';

const initialState = {
  loading: false,
  error: null,
  authToken: '',
  userDetails: {},
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
    case Auth.REGISTRATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case Auth.REGISTRATION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case Auth.REGISTRATION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case Auth.SAVE_AUTH_DETAILS:
      return {
        ...state,
        userDetails: { ...action.user },
        authToken: action.token,
      };

    default:
      return state;
  }
};
