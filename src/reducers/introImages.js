import { GET_INTRO_IMAGES } from '../actions/actionIntroImage';

const initialState = {
  images: []
};

const introImages = (state = initialState, action) => {
  switch(action.type) {
    case GET_INTRO_IMAGES:  // 取得 intro images
      const newObj = {
        images: action.data
      };
      return Object.assign({}, newObj);
    default:
      return state;
  }
}

export default introImages;
