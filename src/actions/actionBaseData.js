import {
  api_query_base_data, 
  api_save_base_data 
} from "../utils/api";

export const GET_BASE_DATA = 'GET_BASE_DATA';
export const SET_BASE_DATA = 'GET_BASE_DATA';

// 取得婚禮資訊
export const getBaseData = (formData, callback) => {
  return (dispatch) => {
    api_query_base_data(formData).then(res => {
      if(res.data && res.data.Msg === 'OK') {
        const baseData = JSON.parse(res.data.JSONContent)[0];

        dispatch({
          type: GET_BASE_DATA,
          data: baseData
        })

        if (callback) callback({Msg: 'OK', data: baseData}, null);
      } else {
        callback(null, {Msg: 'api error'});
      }
    }).catch(err => {
      callback(null, err);
    });
  }
}

// 儲存婚禮資訊
export const setBaseData = (SToken, dataObj, callback) => {
  return (dispatch) => {
    const formData = new FormData();
    formData.append('SToken', SToken);

    const formColumns = [
      'CountOfDesktop',
      'BrideEmail',
      'BrideName',
      'BrideNickName',
      'GroomEmail',
      'GroomName',
      'GroomNickName',
      'ContactEmail',
      'ContactName',
      'ContactPhone',
      'VenueRoom',
      'WeddingAddress',
      'WeddingDate',
      'WeddingDateDesc',
      'WeddingVenue',
      'WhoAmI'
    ];
    
    formColumns.map(item => {
      formData.append(item, dataObj[item]);
    });

    api_save_base_data(formData).then(res => {
      console.log(res);
      if(res.data && res.data.Msg === 'OK') {
        dispatch({
          type: SET_BASE_DATA,
          data: dataObj
        });

        if (callback) callback({Msg: 'OK'}, null);
      } else {
        callback(null, {Msg: 'api error'});
      }
    }).catch(err => {
      callback(null, err);
    });
  }
}
