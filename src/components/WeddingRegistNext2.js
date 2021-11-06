import React from 'react';

import LineImg from '../images/modal/picture_4.png';

const WeddingRegistNext2 = (props) => {
  console.log(props);
  const theme = props.theme ? props.theme : '';
  
  return (
    <div className='modal-send-comer'>
      <h2 style={{paddingTop: '91.94px', marginBottom: 0}}>
        <img src={LineImg} />
      </h2>
      <p className="title">WEDDING-PASS婚禮報到</p>
      <p className="mms-msg">希望可以讓您們在婚禮籌備上<br />多一點幸福，少一點煩惱</p>
    </div>
  );
}

export default WeddingRegistNext2;