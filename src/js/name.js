import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from "react-redux";
import store from "../store";

import PageName from '../pages/PageName';

ReactDom.render(
  <Provider store={store}>
    <PageName />
  </Provider>,
  document.getElementById('app')
);