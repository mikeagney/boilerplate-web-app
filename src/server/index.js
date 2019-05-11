import '@babel/polyfill';
import App from './app';

const app = new App();
app.initialize().listen();
