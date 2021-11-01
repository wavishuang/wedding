import React from 'react';
import SendSmsImgRed from '../images/modal/modal_sendsms-red.png';
import SendSmsImgPurple from '../images/modal/modal_sendsms-purple.png';

const SendProcessing = (props) => {
  console.log(props);
  const theme = props.theme ? props.theme : '';
  let img = '';
  switch(theme) {
    case 'red':
    case 'yellow':
      img = SendSmsImgRed;
      break;
    case 'purple':
    case 'blue':
      img = SendSmsImgPurple;
      break;
  }

  return (
    <div>
      <img src={img} alt="驗證簡訊發送中" title="驗證簡訊發送中" />
    </div>
  );
}

export default SendProcessing;