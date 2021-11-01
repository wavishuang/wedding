import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from "react-redux";
import store from "../store";

import PageLocation from '../pages/PageLocation';

ReactDom.render(
  <Provider store={store}>
    <PageLocation />
  </Provider>,
  document.getElementById('app')
);