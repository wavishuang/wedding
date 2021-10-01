import { api_query_client_column_setup } from '../utils/api';

export const GET_WP_COLUMN_SETUP = 'GET_WP_COLUMN_SETUP';

export const getWPColumnSetup = (formData, callback) => {
  return (dispatch) => {
    api_query_client_column_setup(formData).then(res => {
      if(res.data && res.data.Msg === 'OK') {
        const dataObj = JSON.parse(res.data.JSONContent);
        
        dispatch({
          type: GET_WP_COLUMN_SETUP,
          data: [...dataObj]
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
