import React from 'react';
import ReactDom from 'react-dom';

import PageInformation from '../pages/PageInformation';

import { Provider } from "react-redux";
import store from "../store";

ReactDom.render(
  <Provider store={store}>
    <PageInformation />
  </Provider>,
  document.getElementById('app')
);
