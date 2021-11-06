import React, { Fragment } from 'react';

import LineImg from '../images/modal/line.png';
import Pic4Img from '../images/modal/picture_4.png';
import Pic5Img from '../images/modal/picture_5.png';
import Pic1Img from '../images/modal/picture_1.png';
import Pic2Img from '../images/modal/picture_2.png';

const PopStepImg = (props) => {
  console.log(props);
  const {theme, type} = props;

  let titleImg = LineImg;

  if(type === 'line') {
    titleImg = LineImg;
  } else if(type === 'pic4') {
    titleImg = Pic4Img;
  } else if(type === 'congratulations') {
    titleImg = Pic5Img;
  } else if(type === 'provide') {
    titleImg = Pic1Img;
  } else if(type === 'sweet') {
    titleImg = Pic2Img;
  }

  const renderText = () => {
    switch(type) {
      case 'line':
        return (
          <Fragment>
            <p className="title">WEDDING-PASS婚禮報到</p>
            <p className="mms-msg">婚禮結束後<br />賓客感謝函發送與賓客資料統計</p>
          </Fragment>
        )
      case 'pic4':
        return (
          <Fragment>
            <p className="title">WEDDING-PASS婚禮報到</p>
            <p className="mms-msg">希望可以讓您們在婚禮籌備上<br />多一點幸福，少一點煩惱</p>
          </Fragment>
        )
      case 'congratulations':
        return (
          <Fragment>
            <p className="title">恭喜您</p>
            <p className="mms-msg">完成了WEDDING-PASS婚禮報到<br />發送電子邀請函的體驗</p>
          </Fragment>
        )
      case 'provide':
        return (
          <Fragment>
            <p className="title">WEDDING-PASS婚禮報到</p>
            <p className="mms-msg">將會提供您婚禮籌備期<br />聰明且方便的賓客名單管理</p>
          </Fragment>
        )
      case 'sweet':
        return (
          <Fragment>
            <p className="title">WEDDING-PASS婚禮報到</p>
            <p className="mms-msg">婚禮當天<br />賓客快速、便利的QRCode報到作業貼心功能，<br />傳統喜帖也可以使用喔</p>
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
      <h2 style={{paddingTop: '91.94px', marginBottom: 0}}>
        <img src={titleImg} />
      </h2>
      {renderText()}
    </div>
  );
}

export default PopStepImg;