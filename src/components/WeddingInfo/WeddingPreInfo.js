import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { isNumber } from '../../utils/tools';

const WeddingPreInfo = () => {  
  const dtList = useSelector(state => state.clientList.dtList);
  const dtColumns = useSelector(state => state.clientList.dtColumns);
  const orderInfo = useSelector(state => state.orderInfo);

  const [countOfGuest, setCountOfGuest] = useState(0); // 賓客數
  const [countOfTotal, setCountOfTotal] = useState(0); // 總出席人數
  const [countOfCake, setCountOfCake] = useState(0); // 喜餅數量
  const [countOfDesktop, setCountOfDesktop] = useState(0); // 預估桌數
  const [peopleDesktop, setPeopleDesktop] = useState(0); // 每桌幾人

  useEffect(() => {
    if(dtList.length > 0 && dtColumns.length > 0 && orderInfo) {
      let CountOfTotal = 0; // 總出席人數
      let CountOfCake = 0; // 喜餅數量
      let PeopleDesktop = parseInt(orderInfo.CountOfDesktop); // 每桌幾人

      const totalObj = dtColumns.find(item => item.Name === '出席人數');
      const DBColumnTotalName = totalObj.DBColumnName;
      const cakeObj = dtColumns.find(item => item.Name === '喜餅數量');
      const DBColumnCakeName = cakeObj.DBColumnName;

      for(let i = 0; i < dtList.length; i++) {
        let vv1 = dtList[i][DBColumnTotalName];
        if(!isNumber(vv1)) vv1 = 1;
        CountOfTotal += parseInt(vv1);

        let vv2 = dtList[i][DBColumnCakeName];
        if(isNumber(vv2)) CountOfCake += parseInt(vv2);
      }

      const CountOfDesktop = (CountOfTotal !== 0 && PeopleDesktop !== 0) ? Math.ceil(CountOfTotal/PeopleDesktop) : 0; // 預估桌數

      setCountOfGuest(dtList.length); // 賓客數
      setCountOfTotal(CountOfTotal); // 總出席人數
      setCountOfCake(CountOfCake); // 喜餅數量
      setCountOfDesktop(CountOfDesktop); // 預估桌數
      setPeopleDesktop(PeopleDesktop); // 每桌幾人
    }
  }, [dtList, dtColumns, orderInfo]);

  return (
    <section className="header12 cid-rW0yhSdFBy bg-color-pink wedding-pre-info" id="header12-4r">
      <Container>
        <Row className="justify-content-center">
          <Col xs={6} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">賓客數</h5>
              <h2 className="text-right val">{countOfGuest}</h2>
            </div>
          </Col>
          <Col xs={6} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">總出席人數</h5>
              <h2 className="text-right val">{countOfTotal}</h2>
            </div>
          </Col>
          <Col xs={6} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">喜餅數量</h5>
              <h2 className="text-right val">{countOfCake}</h2>
            </div>
          </Col>
          <Col xs={6} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">預估桌數 <small>{peopleDesktop} 人/桌</small></h5>
              <h2 className="text-right val">{countOfDesktop}</h2>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default WeddingPreInfo;

