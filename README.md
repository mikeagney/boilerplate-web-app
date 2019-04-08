# boilerplate-web-app

A boilerplate mono-repo Node.js web application, intended to be forked to
make the actual web application of your choice.

## Technologies

- [Express](https://expressjs.com/)  
  Used for serving both the web application itself and for hosting a
  REST middle tier for the web application to communicate with other
  back-end systems.
- [React](https://reactjs.org/)  
  Used for generating the user interface.
- [Redux](https://redux.js.org/)  
  Used as the client-side store for React (with, of course, binding
  supplied by [react-redux](https://react-redux.js.org/)).
- [Winston](https://github.com/winstonjs/winston)
  Logging support (definitely server-side logging, and will attempt to
  use it for client-side logging as well).

## On the roadmap
In no particular order:

- Server-side rendering
- Page emulation with [react-router](https://reacttraining.com/react-router/)
- Dynamic loading of page modules with [@loadable/components](https://www.smooth-code.com/open-source/loadable-components/)
- [Docker](https://www.docker.com/)-based deployment
