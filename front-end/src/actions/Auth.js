/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import axios from 'axios';
import { io } from 'socket.io-client';
import { apiURL } from '../utils/constants';

/* eslint-disable no-console */
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const REGISTRATION_REQUEST = 'REGISTRATION_REQUEST';
export const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS';
export const REGISTRATION_ERROR = 'REGISTRATION_ERROR';
export const SAVE_AUTH_DETAILS = 'SAVE_AUTH_DETAILS';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER_DETAILS = 'UPDATE_USER_DETAILS';

export function login(userDetails) {
  return dispatch => {
    dispatch({ type: LOGIN_REQUEST });
    axios
      .post(`${apiURL}/users/login`, {
        email: userDetails.email,
        password: userDetails.password,
      })
      .then(res => {
        dispatch({ type: REGISTRATION_SUCCESS });
        dispatch({ type: SAVE_AUTH_DETAILS, ...res.data });

        if (userDetails.rememberUser) {
          window.localStorage.setItem(
            'userDetails',
            JSON.stringify(res.data.user)
          );
          window.localStorage.setItem('authToken', res.data.token);
          // window.localStorage.setItem('userDetails', res.data.token);
        }
        window.localStorage.setItem('role', res.data.user.role);
        const socket = io('http://localhost:8000', {
          extraHeaders: {
            userid: res.data.user.id,
          },
        });
        console.log('Login_req', res.data.user.id);
        socket.on('group-change', () => {
          alert('You got new notification! :');
        });
      })
      .catch(err => {
        let errMessage = err.toString();
        if (
          err.response &&
          err.response.data &&
          err.response.data.errors &&
          err.response.data.errors.length
        )
          errMessage = err.response.data.errors[0].msg;
        dispatch({ type: LOGIN_ERROR, error: errMessage });
      });
  };
}

export function logout() {
  // eslint-disable-next-line no-undef
  localStorage.removeItem('authToken');
  localStorage.removeItem('userDetails');
  // localStorage.removeItem('authToken', res.data.token);
  localStorage.removeItem('role');
  return { type: LOGOUT };
}

export function register(userDetails) {
  return dispatch => {
    dispatch({ type: LOGIN_REQUEST });
    axios
      .post(`${apiURL}/users/register`, {
        email: userDetails.email,
        password: userDetails.password,
        role: userDetails.role,
        nickName: userDetails.userName,
        alias: userDetails.userName,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
      })
      .then(res => {
        dispatch({ type: LOGIN_SUCCESS });
        dispatch({ type: SAVE_AUTH_DETAILS, ...res.data });
        if (userDetails.rememberUser)
          window.localStorage.setItem('authToken', res.data.token);
      })
      .catch(err => {
        let errMessage = err.toString();
        if (err.response && typeof err.response.data === 'string') {
          errMessage = err.response.data;
        } else if (
          err.response &&
          err.response.data &&
          err.response.data.errors &&
          err.response.data.errors.length
        )
          errMessage = err.response.data.errors[0].msg;
        dispatch({ type: LOGIN_ERROR, error: errMessage });
      });
  };
}

export function updateUserDetails(userDetails) {
  return dispatch => {
    dispatch({ type: UPDATE_USER_DETAILS, user: userDetails });
    const localUser = window.localStorage.getItem('userDetails');
    if (localUser)
      window.localStorage.setItem('userDetails', JSON.stringify(userDetails));
  };
}
