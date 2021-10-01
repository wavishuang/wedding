import { api_query_order_info } from '../utils/api';

export const GET_ORDER_INFO = 'GET_ORDER_INFO';
export const SET_COUNT_OF_DESKTOP = 'SET_COUNT_OF_DESKTOP';

export const getOrderInfo = (formData, callback) => {
  return (dispatch) => {
    api_query_order_info(formData).then(res => {
      if(res.data && res.data.Msg === 'OK') {
        const dataObj = JSON.parse(res.data.JSONContent)[0];
        dispatch({
          type: GET_ORDER_INFO,
          data: dataObj
        })

        if (callback) callback({data: dataObj}, null);
      } else {
        callback(null, {Msg: 'api error'});
      }
    }).catch(err => {
      callback(null, err);
    });;
  }
}

export const setCountOfDesktop = (CountOfDesktop, callback) => {
  return (dispatch, getState) => {
    //console.log("getState:", getState());
    const orderInfo = getState().orderInfo;
    const newOrderInfo = {...orderInfo, CountOfDesktop};

    //console.log('order info:', orderInfo);
    //console.log('new order info:', newOrderInfo);

    dispatch({
      type: SET_COUNT_OF_DESKTOP,
      data: newOrderInfo
    });
  }
}
