import { api_query_payment_info } from '../utils/api';

export const GET_PAYMENT_INFO = 'GET_PAYMENT_INFO';

export const getPaymentInfo = (formData, callback) => {
  return (dispatch) => {
    api_query_payment_info(formData).then(res => {
      if(res.data && res.data.Msg === 'OK') {
        const dataObj = JSON.parse(res.data.JSONContent)[0];
        dataObj.PaymentDone = true;

        dispatch({
          type: GET_PAYMENT_INFO,
          data: dataObj
        })

        if (callback) callback({Msg: 'OK', data: dataObj}, null);
      } else {
        callback(null, {Msg: 'api error'});
      }
    }).catch(err => {
      callback(null, err);
    });;
  }
}
