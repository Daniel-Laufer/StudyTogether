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
import Groups from './modules/Groups/index';
import Login from './modules/Login';
import Register from './modules/Register';
import ForgotPassword from './modules/ForgotPassword';
import EmailSent from './modules/EmailSent';
import ResetPassword from './modules/ResetPassword';
import GroupCreator from './modules/GroupCreator';
import NavBar from './components/NavBar';
import NotFoundPage from './modules/NotFoundPage';
import AccountInfo from './modules/AccountInfo';
import GroupView from './modules/GroupView';
import CustomCalendar from './modules/CustomCalendar';
import GroupEditor from './modules/GroupEditor';
import About from './modules/About';
import NotificationPage from './modules/NotificationPage';
import Following from './modules/Following';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <BrowserRouter style={{ height: '100vh' }}>
          <NavBar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/dashboard"
              element={
                <Groups
                  studyGroupsEndPoint="studygroups"
                  headerContent="Study groups near you"
                />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/email-sent" element={<EmailSent />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/groups"
              element={
                <Groups
                  studyGroupsEndPoint="studygroups"
                  headerContent="Study groups near you"
                />
              }
            />
            <Route path="/groups/create" element={<GroupCreator />} />
            <Route path="/groups/edit/:id" element={<GroupEditor />} />
            <Route
              path="/saved-groups"
              element={
                <Groups
                  studyGroupsEndPoint="studygroups/saved"
                  headerContent="Your saved study groups"
                  noGroupsFoundHeaderContent="You don't have any saved study groups."
                />
              }
            />
            <Route
              path="/group-history"
              element={
                <Groups
                  studyGroupsEndPoint="studygroups/attended"
                  headerContent="Study groups you have attended"
                  noGroupsFoundHeaderContent="You don't have any saved study groups."
                />
              }
            />
            <Route path="/groups/:id" element={<GroupView />} />
            <Route path="/group-history/:id" element={<GroupView />} />
            <Route path="/user/:id" element={<AccountInfo />} />
            <Route path="/user/notifications" element={<NotificationPage />} />
            <Route path="/cal" element={<CustomCalendar />} />
            <Route path="/following/:id" element={<Following />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
