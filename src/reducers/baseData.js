import { GET_BASE_DATA, SET_BASE_DATA } from "../actions/actionBaseData";

const initialState = {
  CountOfDesktop: 0,
  BrideEmail: "",
  BrideName: "",
  BrideNickName: "",
  GroomEmail: "",
  GroomName: "",
  GroomNickName: "",
  ContactEmail: "",
  ContactName: "",
  ContactPhone: "",
  VenueRoom: "",
  WeddingAddress: "",
  WeddingDate: "",
  WeddingDateDesc: "",
  WeddingVenue: "",
  WhoAmI: 0,
  showCountOfDesktop: ""
};

const baseData = (state = initialState, action) => {
  switch(action.type) {
    case GET_BASE_DATA:
      return Object.assign({}, action.data);
    case SET_BASE_DATA:
      console.log('save data:', action.data)
      return Object.assign({}, action.data);
    default:
      return state;
  }
}


export default baseData;
