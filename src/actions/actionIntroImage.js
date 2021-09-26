import ApiCaller from "../utils/ApiCaller";
// 圖片
export const SET_INTRO_IMAGES = 'SET_INTRO_IMAGES'; // 取得 intro images

export const introImages = introImages => ({
  type: SET_INTRO_IMAGES,
  data: introImages
});

// 非同步
export const queryIntroImage = (formData, callback) => async (dispatch) => {
  console.log('action:', formData);
  const response = await ApiCaller.query_intro_image(formData, (res, err) => {
    console.log('action:', res, err);
  })
  //const products = await response.json();
  console.log("response:", response);
  dispatch(introImages(response.result));
}