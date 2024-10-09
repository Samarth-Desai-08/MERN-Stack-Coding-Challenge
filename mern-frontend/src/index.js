

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Make sure App.js is in the same directory
import './index.css';  // Optional: Add any stylesheets

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Ensure there's a div with id 'root' in public/index.html
);
