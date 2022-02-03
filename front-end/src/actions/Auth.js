import axios from 'axios';
import { apiURL } from '../utils/constants';
/* eslint-disable no-console */
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const REGISTRATION_REQUEST = 'REGISTRATION_REQUEST';
export const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS';
export const REGISTRATION_ERROR = 'REGISTRATION_ERROR';

export function login(userDetails) {
  return dispatch => {
    dispatch({ type: LOGIN_REQUEST });
    axios
      .post(`${apiURL}/login`, {
        email: userDetails.password,
        username: userDetails.username,
      })
      .then(res => console.log(res))
      .catch(err => {
        dispatch({ type: LOGIN_ERROR, error: err.toString() });
      });
  };
}
export function register(userDetails) {
  console.log(userDetails);
  return dispatch => {
    dispatch({ type: LOGIN_REQUEST });
    axios
      .post(`${apiURL}/register`, {
        email: userDetails.password,
        password: userDetails.password,
        role: userDetails.role,
        nickName: userDetails.userName,
      })
      .then(res => console.log(res))
      .catch(err => {
        dispatch({ type: LOGIN_ERROR, error: err.toString() });
      });
  };
}
