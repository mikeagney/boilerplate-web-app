import '@babel/polyfill';
import React from 'react';
import { hydrate } from 'react-dom';
import { loadableReady } from '@loadable/component';
import { BrowserRouter } from 'react-router-dom';
import App from './app';

export default function renderPage() {
  loadableReady(() => {
    hydrate(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('root'),
    );
  });
}

renderPage();
