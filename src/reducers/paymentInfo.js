import { GET_PAYMENT_INFO } from '../actions/actionPaymentInfo';

const initialState = {};

const paymentInfo = (state = initialState, action) => {
  switch(action.type) {
    case GET_PAYMENT_INFO:  // 取得 PAYMENT INFO
      return action.data;
    default:
      return state;
  }
}

export default paymentInfo;
