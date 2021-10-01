import { 
  GET_DASHBOARD_INFO_CHECKIN, 
  GET_DASHBOARD_INFO_MULTI_CHECKIN 
} from '../actions/actionCheckinInfo';

const initialState = {
  dashboard_info_multi_checkin: {},
  dashboard_info_checkin: {}
};

const CheckinInfo = (state = initialState, action) => {
  switch(action.type) {
    case GET_DASHBOARD_INFO_MULTI_CHECKIN:  // 取得 dashboard info multi checkin
      return Object.assign({}, action.data);
    case GET_DASHBOARD_INFO_CHECKIN:  // 取得 dashboard info checkin
      return Object.assign({}, action.data);  
    default:
      return state;
  }
}

export default CheckinInfo;
