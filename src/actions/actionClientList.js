import { api_query_client_list } from '../utils/api';

export const GET_CLIENT_LIST = 'GET_CLIENT_LIST';

export const getClientList = (formData, callback) => {
  return (dispatch) => {
    api_query_client_list(formData).then(res => {
      
      if(res.data && res.data.Msg === 'OK') {
        const dtList = res.data.dtList;
        const dtColumns = res.data.dtColumns;

        dispatch({
          type: GET_CLIENT_LIST,
          data: Object.assign({}, {dtList, dtColumns})
        })

        if (callback) callback({Msg: 'OK'}, null);
      } else {
        callback(null, {Msg: 'api error'});
      }
    }).catch(err => {
      callback(null, err);
    });;
  }
}
