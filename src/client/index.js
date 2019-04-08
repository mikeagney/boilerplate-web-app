import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';

export default function renderPage() {
  render(<h1>Hello World from React!</h1>, document.getElementById('root'));
}

renderPage();
