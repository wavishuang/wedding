import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode, faChartPie, faChartBar } from "@fortawesome/free-solid-svg-icons";


import IconCard from './IconCard';
import SectionTitle from './SectionTitle';

const SectionContent = (props) => {
  const {title, icons, introImage} = props;

  const returnFaIcons = (faId) => {
    switch(faId) {
      case 44:
        return <FontAwesomeIcon icon={faQrcode} className="mbr-icon-extra-css" />;
      case 61:
        return <FontAwesomeIcon icon={faChartPie} className="mbr-icon-extra-css" />;
      case 62:
        return <FontAwesomeIcon icon={faChartBar} className="mbr-icon-extra-css" />;
    }
  }

  const renderIcon = (iconClass, faId) => {
    if(iconClass.match('fa')) return <span>{returnFaIcons(faId)}</span>;
    return <span className={iconClass}></span>;
  }

  return (
    <Col sm={12} className="d-block d-lg-none px-0 py-3">
      <SectionTitle title={title} />
      <section className="header12 cid-rW0yhSdFBy bg-color-pink">
        <Container fluid style={{maxWidth: '768px'}}>
          <Row className="justify-content-center">
            {icons.map(item =>
              <IconCard title={item.text} key={item.id}>
                {item.link === '#'
                ? (item.introImg 
                  ? <a onClick={() => props.popModalShow(item.introImg)}>{renderIcon(item.iconClass, item.id)}</a>
                  : <a>{renderIcon(item.iconClass, item.id)}</a>)
                : <a href={item.link}>{renderIcon(item.iconClass, item.id)}</a>
              }
              </IconCard>
            )}
          </Row>
        </Container>
      </section>
    </Col>
  );
}

export default SectionContent;