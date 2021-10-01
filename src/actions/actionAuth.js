import { api_check_token } from '../utils/api';

export const check_token = (formData, callback) => {
  return (dispatch) => {
    api_check_token(formData).then(res => {
      //console.log("res:", res, res.data);
      if(!res.data.Msg || res.data.Msg !== 'OK') {
        callback(null, err);
      } else {
        callback('OK', null);
      }
      callback(res, null);
    }).catch(err => {
      callback(null, err);
    });;
  }
}
