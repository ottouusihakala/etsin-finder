import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';

import ErrorBoundary from './components/errorBoundary'
import Footer from './layout/footer';
import Header from './layout/header';
import Content from './layout/content';

import Stores from './stores';

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'test') {
  console.log('We are in test');
} else if (process.env.NODE_ENV === 'development') {
  console.log('We are in development');
} else if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <Provider Stores={Stores}>
          <Router history={Stores.history}>
            <ErrorBoundary>
              <Header />
              <Content />
              <Footer />
            </ErrorBoundary>
          </Router>
        </Provider>
      </div>
    );
  }
}