// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import the main App component
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);

reportWebVitals();
