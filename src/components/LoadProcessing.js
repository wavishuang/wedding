import React from 'react';
import LoadingImgRed from '../images/modal/modal_loading-red.png';
import LoadingImgPurple from '../images/modal/modal_loading-purple.png';
import LoadingImgYellow from '../images/modal/modal_loading-yellow.png';
import LoadingImgBlue from '../images/modal/modal_loading-blue.png';

const LoadProcessing = (props) => {
  console.log(props);
  const theme = props.theme ? props.theme : '';
  let img = '';
  switch(theme) {
    case 'red':
      img = LoadingImgRed;
      break;
    case 'yellow':
      img = LoadingImgYellow;
      break;
    case 'purple':
      img = LoadingImgPurple;
      break;
    case 'blue':
      img = LoadingImgBlue;
      break;
  }

  return (
    <div>
      <img src={img} alt="處理中請稍候" title="處理中請稍候" />
    </div>
  );
}

export default LoadProcessing;