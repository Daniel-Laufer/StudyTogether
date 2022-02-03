/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers/root';
import LandingPage from './modules/LandingPage/index';
import Groups from './modules/Groups/index';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/heyo" element={<div>heyo</div>} />
          <Route
            path="/group"
            element={
              <div>
                <Groups></Groups>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
