/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ChakraProvider, theme } from '@chakra-ui/react';

import rootReducer from './reducers/root';
import LandingPage from './modules/LandingPage/index';
import Login from './modules/Login';
import Register from './modules/Register';
import ForgotPassword from './modules/ForgotPassword';
import EmailSent from './modules/EmailSent';
import ResetPassword from './modules/ResetPassword';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/email-sent" element={<EmailSent />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
