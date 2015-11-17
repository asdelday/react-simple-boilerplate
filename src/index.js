import React from 'react';
import ReactDom from 'react-dom';
import App from './components/App';

((window) => {
  const app = document.createElement('div');
  window.document.body.appendChild(app);
  ReactDom.render(<App />, app);
})(window);
