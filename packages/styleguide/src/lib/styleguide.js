import React from 'react';
import ReactDOM from 'react-dom';
import App, { MdxWrapper } from '../components/App/App';

export * from '../components';
export * from '../utils';

export default function({ config = {}, routes = [] }) {
  ReactDOM.render(
    React.createElement(App, { config, routes }),
    document.getElementById('root')
  );
}

export { App, MdxWrapper };
