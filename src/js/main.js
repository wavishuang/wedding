import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from "react-redux";
import store from "../store";

import PageMain from '../pages/PageMain';

ReactDom.render(
  <Provider store={store}>
    <PageMain />
  </Provider>,
  document.getElementById('app')
);