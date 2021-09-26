import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { getNow } from '../../utils/tools';

const WeddingRegistInfo = (props) => {
  const lastDashboardDateTime = getNow();
  const {
    CheckIn, // 報到人數
    Total, // 賓客數
    CheckInRate, // 報到率

    CountOfTotal, // 總出席人數
    CountOfTotalCheckIn, // 目前總出席人數
    EstimateCheckInRate, // 預估出席率
    
    DashboardInfoMultiCheckInCount,  // 已領取喜餅數量
    CountOfCake, // 預計喜餅數量
    ReceiveCakeRate
  } = props.registInfo;

  return (
    <section className="header12 cid-rW0yhSdFBy bg-color-pink wedding-regist-info" id="header12-4r">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">目前報到人數 / 賓客數 / 報到率</h5>
              <h2 className="text-right val">{CheckIn} / {Total} / {CheckInRate}%</h2>
            </div>
            <h5 className="mbr-fonts-style display-7 text-right latest-update">最後更新時間:{lastDashboardDateTime}</h5>
          </Col>
          <Col xs={12} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">目前總出席人數 / 總出席人數 / 預估出席率</h5>
              <h2 className="text-right val">{CountOfTotalCheckIn} / {CountOfTotal} / {EstimateCheckInRate}%</h2>
            </div>
            <h5 className="mbr-fonts-style display-7 text-right latest-update">最後更新時間:{lastDashboardDateTime}</h5>
          </Col>
          <Col xs={12} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">已領取喜餅數量 / 預計喜餅數量 / 領取率</h5>
              <h2 className="text-right val">{DashboardInfoMultiCheckInCount} / {CountOfCake} / {ReceiveCakeRate}%</h2>
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

