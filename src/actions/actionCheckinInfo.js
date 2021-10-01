import { 
  api_query_dashboard_info_multi_checkin,
  api_query_dashboard_info_checkin
 } from '../utils/api';

export const GET_DASHBOARD_INFO_MULTI_CHECKIN = 'GET_DASHBOARD_INFO_MULTI_CHECKIN';
export const GET_DASHBOARD_INFO_CHECKIN = 'GET_DASHBOARD_INFO_CHECKIN';

// Multi Checkin Info
export const getDashboardInfoMultiCheckin = (formData, callback) => {
  return (dispatch, getState) => {
    api_query_dashboard_info_multi_checkin(formData).then(res => {
      if(res.data && res.data.length > 0) {
        const dashboard_info_multi_checkin = res.data[0];

        const checkinInfo = getState().checkinInfo;
        const dataObj = {...checkinInfo, dashboard_info_multi_checkin};

        dispatch({
          type: GET_DASHBOARD_INFO_MULTI_CHECKIN,
          data: dataObj
        });

        if (callback) callback({Msg: 'OK'}, null);
      } else {
        callback(null, {Msg: 'api error'});
      }
    }).catch(err => {
      callback(null, err);
    });;
  }
}

// Checkin Info
export const getDashboardInfoCheckin = (formData, callback) => {
  return (dispatch, getState) => {
    api_query_dashboard_info_checkin(formData).then(res => {
      
      if(res.data && res.data.rows && res.data.rows.length > 0) {
        const dashboard_info_checkin = res.data.rows[0];

        const checkinInfo = getState().checkinInfo;
        const dataObj = {...checkinInfo, dashboard_info_checkin};
        
        dispatch({
          type: GET_DASHBOARD_INFO_CHECKIN,
          data: dataObj
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
