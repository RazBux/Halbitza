import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //STRICT MOOD for development pourpes. can print this or rerander thing couple of times. 
  <React.StrictMode>
    <App />
  </React.StrictMode>

  // Use this for debugging without Strict Mode
  // <App/>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
