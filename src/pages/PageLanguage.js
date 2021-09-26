import React, { Fragment } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import HeaderNav from '../components/HeaderNav';

import '../scss/base.scss';

const PageLanguage = function() {
  const lang = [
    {id: 1, text: '繁體中文', val: 'zh-tw'},
    {id: 2, text: '簡体中文', val: 'zh-cn'},
    {id: 3, text: 'English', val: 'en'},
    {id: 4, text: '日本語', val: 'ja'},
    {id: 5, text: '한국어', val: 'ka'},
    {id: 6, text: 'français', val: 'fr'},
    {id: 7, text: 'Español', val: 'es'},
    {id: 8, text: 'Portugues', val: 'po'},
  ];

  const selectLang = (val) => {
    location.href = 'start.html';
  }

  return (
    <Fragment>
      <HeaderNav />
      
      <section className="engine">
        <a href="https://mobirise.info/a">online website builder</a>
      </section>

      <section className="extFeatures cid-rWNvEZmmkk vh-100" id="extFeatures8-5h">
        <Container>
          <h2 className="mbr-fonts-style mbr-section-title align-center display-2 mb-4">
            <strong>Wedding Pass</strong>
          </h2>
          <Row md={3} xs={4} className="justify-content-center">
            {lang.map(item => (
              <Col className="lan-btn lan-btn-shape" onClick={() => selectLang(item.val)} key={item.id}>
                <span>{item.text}</span>
              </Col>)
            )}
          </Row>
        </Container>
      </section>
    </Fragment>
  );
}

export default PageLanguage;
