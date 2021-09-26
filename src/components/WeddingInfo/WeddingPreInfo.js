import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const WeddingPreInfo = (props) => {
  const { CountOfGuest, CountOfTotal, CountOfCake, PeopleDesktop } = props.weddingInfo;
  const CountOfDesktop = (CountOfTotal !== 0 && PeopleDesktop !== 0) ? Math.ceil(CountOfTotal/PeopleDesktop) : 0; // 預估桌數

  return (
    <section className="header12 cid-rW0yhSdFBy bg-color-pink wedding-pre-info" id="header12-4r">
      <Container>
        <Row className="justify-content-center">
          <Col xs={6} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">賓客數</h5>
              <h2 className="text-right val">{CountOfGuest}</h2>
            </div>
          </Col>
          <Col xs={6} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">總出席人數</h5>
              <h2 className="text-right val">{CountOfTotal}</h2>
            </div>
          </Col>
          <Col xs={6} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">喜餅數量</h5>
              <h2 className="text-right val">{CountOfCake}</h2>
            </div>
          </Col>
          <Col xs={6} className="my-3">
            <div className="icon-block wp_frame_dashboard">
              <h5 className="mbr-fonts-style display-7 text-left title">預估桌數 <small>{PeopleDesktop} 人/桌</small></h5>
              <h2 className="text-right val">{CountOfDesktop}</h2>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default WeddingPreInfo;

