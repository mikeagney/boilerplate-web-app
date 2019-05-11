import '@babel/polyfill';
import React from 'react';
import { hydrate } from 'react-dom';
import App from './app';

export default function renderPage() {
  hydrate(<App />, document.getElementById('root'));
}

renderPage();
