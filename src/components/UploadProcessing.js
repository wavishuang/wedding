import React from 'react';
import UploadImgRed from '../images/modal/modal_upload-red.png';
import UploadImgPurple from '../images/modal/modal_upload-purple.png';
import UploadImgYellow from '../images/modal/modal_upload-yellow.png';
import UploadImgBlue from '../images/modal/modal_upload-blue.png';

const UploadProcessing = (props) => {
  console.log(props);
  const theme = props.theme ? props.theme : '';
  let img = '';
  switch(theme) {
    case 'red':
      img = UploadImgRed;
      break;
    case 'yellow':
      img = UploadImgYellow;
      break;
    case 'purple':
      img = UploadImgPurple;
      break;
    case 'blue':
      img = UploadImgBlue;
      break;
  }

  return (
    <div>
      <img src={img} alt="上傳中請稍候" title="上傳中請稍候" />
    </div>
  );
}

export default UploadProcessing;