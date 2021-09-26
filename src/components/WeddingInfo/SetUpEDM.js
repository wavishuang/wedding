import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import EDM from './EDM';
import SendDemo from './SendDemo';

import '../../scss/edm.scss';

const SetUpEDM = (props) => {
  const {SToken, MobilePhone, orderInfo} = props;

  const [nowPage, setNowPage] = useState('EDM');

  const goNextPage = (page) => {
    setNowPage(page);
  }

  return (
    <section className="features1 cid-rX4jzrRcmX p-0" style={{marginTop: '15px'}}>
      <Container className="p-0">
        <Row className="justify-content-center p-0">
          <Col xs={12}>
            {nowPage === 'EDM'
            ? <EDM orderInfo={orderInfo} MobilePhone={MobilePhone} SToken={SToken} goNextPage={goNextPage} />
            : <SendDemo orderInfo={orderInfo} MobilePhone={MobilePhone} SToken={SToken} goNextPage={goNextPage} />
            }
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default SetUpEDM;

