import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './app/store';
import { ThemeProvider } from 'styled-components';
const test = React.createElement(App, null, null);
console.log(test);
console.log(test);
const theme = {
  lightBg: '#395490',
  bgColor: '#315cb9',
  hoverColor: '#2c57af1f',
  hoverTextColor: '#708292',
  blackTextColor: '#2b2b2b',
  linkTextColor: '#4d69d2',
  navTextColor: '#dfe6ff'
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
