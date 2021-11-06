import React from 'react';

// 簡訊發送中
import ImgSendSMSRed from '../images/modal/modal_sendsms-red.png';
import ImgSendSMSYellow from '../images/modal/modal_sendsms-yellow.png';  // 缺
import ImgSendSMSBlue from '../images/modal/modal_sendsms-blue.png';      // 缺
import ImgSendSMSPurple from '../images/modal/modal_sendsms-purple.png';

// 處理中，請稍候
import ImgLoadingRed from '../images/modal/modal_loading-red.png';
import ImgLoadingYellow from '../images/modal/modal_loading-yellow.png';
import ImgLoadingBlue from '../images/modal/modal_loading-blue.png';  // 缺
import ImgLoadingPurple from '../images/modal/modal_loading-purple.png'; // 缺

// 婚宴準備中
import VenueLoadingImgRed from '../images/modal/modal_venue_loading-red.png'; // 缺
import VenueLoadingImgYellow from '../images/modal/modal_venue_loading-yellow.png';
import VenueLoadingImgBlue from '../images/modal/modal_venue_loading-blue.png';
import VenueLoadingImgPurple from '../images/modal/modal_venue_loading-purple.png'; // 缺

// 上傳婚紗照
import UploadImgRed from '../images/modal/modal_upload-red.png';
import UploadImgYellow from '../images/modal/modal_upload-yellow.png';
import UploadImgBlue from '../images/modal/modal_upload-blue.png';
import UploadImgPurple from '../images/modal/modal_upload-purple.png'; // 缺

// 發送中，請稍候
import MMSTestRed from '../images/modal/modal_mmstest_loading-red.png';
import MMSTestYellow from '../images/modal/modal_mmstest_loading-yellow.png';
import MMSTestBlue from '../images/modal/modal_mmstest_loading-blue.png';
import MMSTestPurple from '../images/modal/modal_mmstest_loading-purple.png';

const PopImg = (props) => {
  console.log(props);
  const theme = props.theme;
  const type = props.type;

  const colorBg = [
    { bg: 'red', 
      imgs: [
        { type: 'sendsms', img: ImgSendSMSRed },
        { type: 'loading', img: ImgLoadingRed },
        { type: 'venue-loading', img: VenueLoadingImgRed },
        { type: 'upload-wedding-photo', img: UploadImgRed },
        { type: 'send-loading', img: MMSTestRed },
      ]
    },
    { bg: 'yellow', 
      imgs: [
        { type: 'sendsms', img: ImgSendSMSYellow },
        { type: 'loading', img: ImgLoadingYellow},
        { type: 'venue-loading', img: VenueLoadingImgYellow },
        { type: 'upload-wedding-photo', img: UploadImgYellow },
        { type: 'send-loading', img: MMSTestYellow },
      ]
    },
    { bg: 'blue', 
      imgs:[
        { type: 'sendsms', img: ImgSendSMSBlue },
        { type: 'loading', img: ImgLoadingBlue },
        { type: 'venue-loading', img: VenueLoadingImgBlue },
        { type: 'upload-wedding-photo', img: UploadImgBlue },
        { type: 'send-loading', img: MMSTestBlue },
      ]
    },
    { bg: 'purple', 
      imgs: [
        { type: 'sendsms', img: ImgSendSMSPurple },
        { type: 'loading', img: ImgLoadingPurple },
        { type: 'venue-loading', img: VenueLoadingImgPurple },
        { type: 'upload-wedding-photo', img: UploadImgPurple },
        { type: 'send-loading', img: MMSTestPurple },
      ]
    }
  ];

  const getImg = () => {
    const imgObj = colorBg.find(item => item.bg === theme);
    const bg = imgObj.imgs.find(subItem => subItem.type === type);
    return bg ? bg.img : '';
  }

  const img = getImg();

  return (
    <div>
      <img src={img} alt="驗證簡訊發送中" title="驗證簡訊發送中" />
    </div>
  );
}

export default PopImg;