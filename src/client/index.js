import '@babel/polyfill';
import React from 'react';
import { hydrate } from 'react-dom';
import { loadableReady } from '@loadable/component';
import { BrowserRouter } from 'react-router-dom';
import App from './app';

export default function renderPage() {
  const initialState = window.__PRELOADED_STATE__;
  delete window.__PRELOADED_STATE__;

  loadableReady(() => {
    hydrate(
      <BrowserRouter>
        <App initialState={initialState} />
      </BrowserRouter>,
      document.getElementById('root'),
    );
  });
}

renderPage();
