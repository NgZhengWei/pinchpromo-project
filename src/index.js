import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const colors = {
  brandYellow: {
    100: '#FFD124',
  },
};

const fonts = {
  body: 'Amiko',
  heading: 'Arial Rounded MT Bold',
};

const theme = extendTheme({ colors, fonts });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
