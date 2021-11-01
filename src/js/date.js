import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from "react-redux";
import store from "../store";

import PageDate from '../pages/PageDate';

ReactDom.render(
  <Provider store={store}>
    <PageDate />
  </Provider>,
  document.getElementById('app')
);