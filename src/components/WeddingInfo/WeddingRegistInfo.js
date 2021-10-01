import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { 
  getNow, 
  isNumber 
} from '../../utils/tools';

const WeddingRegistInfo = (props) => {
  const lastDashboardDateTime = getNow();
  
  const dtList = useSelector(state => state.clientList.dtList);
  const dtColumns = useSelector(state => state.clientList.dtColumns);
  const orderInfo = useSelector(state => state.orderInfo);
  const multiCheckinInfo = useSelector(state => state.checkinInfo.dashboard_info_multi_checkin);
  const checkinInfo = useSelector(state => state.checkinInfo.dashboard_info_checkin);

  const [checkIn, setCheckIn] = useState(0); // 報到人數
  const [total, setTotal] = useState(0); // 賓客數
  const [checkInRate, setCheckInRate] = useState(0); // 報到率

  const [countOfTotalCheckIn, setCountOfTotalCheckIn] = useState(0); // 目前總出席人數
  const [countOfTotal, setCountOfTotal] = useState(0); // 總出席人數
  const [estimateCheckInRate, setEstimateCheckInRate] = useState(0); // 預估出席率

  const [dashboardInfoMultiCheckInCount, setDashboardInfoMultiCheckInCount] = useState(0); // 已領取喜餅數量
  const [countOfCake, setCountOfCake] = useState(0); // 喜餅數量
  const [receiveCakeRate, setReceiveCakeRate] = useState(0); // 領取率

  useEffect(() => {
    if(dtList.length > 0 && dtColumns.length > 0 && orderInfo && checkinInfo && multiCheckinInfo) {
      const checkIn = Number(checkinInfo.CheckIn); // 報到人數
      const total = Number(checkinInfo.Total); // 賓客數
      const checkInRate = (total === 0 || checkIn === 0) ? 0 : ((checkIn / total)*100).toFixed(2); // 報到率
      const dashboardInfoMultiCheckInCount = Number(multiCheckinInfo.Count); // 已領取喜餅數量

      let countOfTotal = 0; // 總出席人數
      let countOfCake = 0; // 喜餅數量
      let countOfTotalCheckIn = 0; // 出席數

      const totalObj = dtColumns.find(item => item.Name === '出席人數');
      const DBColumnTotalName = totalObj.DBColumnName;
      const cakeObj = dtColumns.find(item => item.Name === '喜餅數量');
      const DBColumnCakeName = cakeObj.DBColumnName;

      for(let i = 0; i < dtList.length; i++) {
        let vv1 = dtList[i][DBColumnTotalName];
        if(!isNumber(vv1)) vv1 = 1;
        countOfTotal += parseInt(vv1);

        let vv2 = dtList[i][DBColumnCakeName];
        if(isNumber(vv2)) countOfCake += parseInt(vv2);

        if(dtList[i]['CheckInTimeStamp']) countOfTotalCheckIn += vv1;
      }

      const estimateCheckInRate = (countOfTotal === 0 || countOfTotalCheckIn === 0) ? 0 : ((countOfTotalCheckIn/countOfTotal)*100).toFixed(2);
      const receiveCakeRate = (countOfCake === 0 || dashboardInfoMultiCheckInCount === 0) ? 0 : ((dashboardInfoMultiCheckInCount/countOfCake)*100).toFixed(2);

      setCheckIn(checkIn); // 目前報到人數
      setTotal(total); // 賓客數
      setCheckInRate(checkInRate); // 報到率

      setCountOfTotalCheckIn(countOfTotalCheckIn); // 目前總出席人數
      setCountOfTotal(countOfTotal); // 總出席人數
      setEstimateCheckInRate(estimateCheckInRate); // 預估出席率

      setDashboardInfoMultiCheckInCount(dashboardInfoMultiCheckInCount); // 已領取喜餅數量
      setCountOfCake(countOfCake); // 喜餅數量
      setReceiveCakeRate(receiveCakeRate); // 領取率
    }
  }, [dtList, dtColumns, orderInfo, multiCheckinInfo, checkinInfo]);

  return (
    <section className="header12 cid-rW0yhSdFBy bg-color-pink wedding-regist-info" id="header12-4r">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">目前報到人數 / 賓客數 / 報到率</h5>
              <h2 className="text-right val">{checkIn} / {total} / {checkInRate}%</h2>
            </div>
            <h5 className="mbr-fonts-style display-7 text-right latest-update">最後更新時間:{lastDashboardDateTime}</h5>
          </Col>
          <Col xs={12} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">目前總出席人數 / 總出席人數 / 預估出席率</h5>
              <h2 className="text-right val">{countOfTotalCheckIn} / {countOfTotal} / {estimateCheckInRate}%</h2>
            </div>
            <h5 className="mbr-fonts-style display-7 text-right latest-update">最後更新時間:{lastDashboardDateTime}</h5>
          </Col>
          <Col xs={12} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">已領取喜餅數量 / 預計喜餅數量 / 領取率</h5>
              <h2 className="text-right val">{dashboardInfoMultiCheckInCount} / {countOfCake} / {receiveCakeRate}%</h2>
            </div>
            <h5 className="mbr-fonts-style display-7 text-right latest-update">最後更新時間:{lastDashboardDateTime}</h5>
          </Col>

          <Col xs={12} className="my-3"></Col>
        </Row>
      </Container>
    </section>
  );
}

export default WeddingRegistInfo;
