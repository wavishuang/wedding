import React from 'react';
import BgSheetBlue from '../images/modal/bottom_sheet_modal_venue-blue.png';
import BgSheetRed from '../images/modal/bottom_sheet_modal_venue-red.png';
import BgSheetYellow from '../images/modal/bottom_sheet_modal_venue-yellow.png';
import BgSheetPurple from '../images/modal/bottom_sheet_modal_venue-purple.png';

import IconInfoBlue from '../images/icon/icon_info-blue.png';
import IconInfoRed from '../images/icon/icon_info-red.png';
import IconInfoYellow from '../images/icon/icon_info-yellow.png';
import IconInfoPurple from '../images/icon/icon_info-purple.png';

const SendNewComer = (props) => {
  console.log(props);
  const theme = props.theme ? props.theme : '';
  let img = '';
  let iconImg = '';
  switch(theme) {
    case 'red':
      img = BgSheetRed;
      iconImg = IconInfoRed;
      break;
    case 'yellow':
      img = BgSheetYellow;
      iconImg = IconInfoYellow;
      break;
    case 'purple':
      img = BgSheetPurple;
      iconImg = IconInfoPurple;
      break;
    case 'blue':
      img = BgSheetBlue;
      iconImg = IconInfoBlue;
      break;
    default:
      img = BgSheetRed;
      iconImg = IconInfoRed;
  }

  return (
    <div className='modal-send-comer'>
      <h2 style={{paddingTop: '78.18px'}}>
        <img src={iconImg} />
      </h2>
      <p className="">您還沒輸入新人名稱<br />是否就讓我們先稱呼您們為 <br />“春嬌” 與 “志明”？!</p>
    </div>
  );
}

export default SendNewComer;