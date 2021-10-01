import { 
  GET_ORDER_INFO, 
  SET_COUNT_OF_DESKTOP 
} from '../actions/actionOrderInfo';

const initialState = {};

const orderInfo = (state = initialState, action) => {
  switch(action.type) {
    case GET_ORDER_INFO:  // 取得 order info
      return action.data;
    case SET_COUNT_OF_DESKTOP:
      return Object.assign({}, action.data);
    default:
      return state;
  }
}

export default orderInfo;
