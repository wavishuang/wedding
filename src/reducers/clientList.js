import { GET_CLIENT_LIST } from '../actions/actionClientList';

const initialState = {
  dtList: [],
  dtColumns: []
};

const ClientList = (state = initialState, action) => {
  switch(action.type) {
    case GET_CLIENT_LIST:  // 取得 Client List
      const dataObj = {};
      dataObj.dtList = action.data.dtList;
      dataObj.dtColumns = action.data.dtColumns;

      return dataObj;
    default:
      return state;
  }
}

export default ClientList;
