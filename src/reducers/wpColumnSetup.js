import { GET_WP_COLUMN_SETUP } from '../actions/actionWPColumnSetup';

const initialState = [];

const WPColumnSetup = (state = initialState, action) => {
  switch(action.type) {
    case GET_WP_COLUMN_SETUP:  // 取得 WPColumnSetup
      return [...action.data];
    default:
      return state;
  }
}

export default WPColumnSetup;
