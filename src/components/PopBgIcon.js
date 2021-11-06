import React, { Fragment } from 'react';

// Info
import IconInfoRed from '../images/icon/icon_info-red.png';
import IconInfoYellow from '../images/icon/icon_info-yellow.png';
import IconInfoBlue from '../images/icon/icon_info-blue.png';
import IconInfoPurple from '../images/icon/icon_info-purple.png';

// Success
import IconCheckRed from '../images/icon/icon_check-red.png';
import IconCheckYellow from '../images/icon/icon_check-yellow.png';
import IconCheckBlue from '../images/icon/icon_check-blue.png';
import IconCheckPurple from '../images/icon/icon_check-purple.png';

// Error
import IconErrorRed from '../images/icon/icon_error-red.png';
import IconErrorYellow from '../images/icon/icon_error-yellow.png';
import IconErrorBlue from '../images/icon/icon_error-blue.png';
import IconErrorPurple from '../images/icon/icon_error-purple.png';

const PopBgIcon = (props) => {
  console.log(props);
  const {theme, type, icon} = props;

  const colorIcon = [
    { bg: 'red', 
      icons: [
        { type: 'info', img: IconInfoRed },
        { type: 'success', img: IconCheckRed },
        { type: 'error', img: IconErrorRed },
      ]
    },
    { bg: 'yellow', 
      icons: [
        { type: 'info', img: IconInfoYellow },
        { type: 'success', img: IconCheckYellow },
        { type: 'error', img: IconErrorYellow },
      ]
    },
    { bg: 'blue', 
      icons:[
        { type: 'info', img: IconInfoBlue },
        { type: 'success', img: IconCheckBlue },
        { type: 'error', img: IconErrorBlue },
      ]
    },
    { bg: 'purple', 
      icons: [
        { type: 'info', img: IconInfoPurple },
        { type: 'success', img: IconCheckPurple },
        { type: 'error', img: IconErrorPurple },
      ]
    }
  ];

  const getIcon = () => {
    const iconObj = colorIcon.find(item => item.bg === theme);
    //console.log(iconObj);
    const imgIcon = iconObj.icons.find(subItem => subItem.type === icon);
    return imgIcon ? imgIcon.img : '';
  }

  const iconImg = getIcon();

  const renderText = () => {
    switch(type) {
      case 'new-comer':
        return <p className="">您還沒輸入新人名稱<br />是否就讓我們先稱呼您們為 <br />“春嬌” 與 “志明”？!</p>
      case 'location':
        return <p className="text-center">您還沒輸入婚禮預計地點<br />是否就讓我們先幫您安排<br /> OOO 婚宴會館？!</p>
      case 'send-mms-success':
        return (
          <Fragment>
            <p className="title">發送成功</p>
            <p className="mms-msg">WEDDING-PASS<br />已經將測試的婚禮邀請函發送至您手機 !</p>
          </Fragment>
        )
      case 'send-mms-error':
        return (
          <Fragment>
            <p className="title">發送失敗</p>
            <p className="mms-msg">請確認手機號碼是否正確</p>
          </Fragment>
        )
      case 'send-mail-success':
        return (
          <Fragment>
            <p className="title">發送成功</p>
            <p className="mms-msg">WEDDING-PASS已經將測試的婚禮邀請函<br />發送至您跟另一半的信箱!</p>
          </Fragment>
        )
      case 'send-mail-error':
        return (
          <Fragment>
            <p className="title">發送失敗</p>
            <p className="mms-msg">請確認信箱格式是否正確</p>
          </Fragment>
        )
    }

    return '';
  }

  return (
    <div className='modal-send-comer'>
      <h2 style={{paddingTop: '78.18px'}}>
        <img src={iconImg} />
      </h2>
      {renderText()}
    </div>
  );
}

export default PopBgIcon;