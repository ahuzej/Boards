import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import configureStore from './app/store';
import { ThemeProvider } from 'styled-components';
import { PersistGate } from 'redux-persist/integration/react';

const theme = {
  lightBg: '#395490',
  bgColor: '#315cb9',
  hoverColor: '#2c57af1f',
  hoverTextColor: '#708292',
  blackTextColor: '#2b2b2b',
  linkTextColor: '#4d69d2'
};

const { store, persistor } = configureStore();
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <App />

        </ThemeProvider>

      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
