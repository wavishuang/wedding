import { api_query_intro_image } from '../utils/api';

export const GET_INTRO_IMAGES = 'GET_INTRO_IMAGES';

export const getIntroImages = (formData, callback) => {
  return (dispatch) => {
    api_query_intro_image(formData).then(res => {
      //console.log("res:", res, res.data);
      if(res.data && res.data.Msg === 'OK') {
        const images = JSON.parse(res.data.JSONContent);
        dispatch({
          type: GET_INTRO_IMAGES,
          data: images
        })

        if (callback) callback('images:', images);
      } else {
        callback(null, {Msg: 'api error'});
      }
    }).catch(err => {
      callback(null, err);
    });;
  }
}
