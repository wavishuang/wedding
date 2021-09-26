import ApiCaller from '../utils/ApiCaller';

export default class actionAuth {
  // 檢查 token 是否過期
  static check_token = (token, callback) => {
    if(token) {
      const formData = new FormData();
      formData.append('SToken', token);
      ApiCaller.connector().check_token(formData, (res) => {
        callback(res);
      });
    } else {
      callback({Msg: 'token 過期'});
    }
  }
};
