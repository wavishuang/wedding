import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

const SectionTitle = (props) => {
  const {title} = props;
  return (
    <section className="mbr-section pb-0 section-title">
      <Container>
        <div className="media-container-row title">
          <Col md={12}>
            <div className="text-center">
              <div className="line">
                <img src="./images/line_title.png" />
              </div>
              <h2 className="mbr-section-title align-center mbr-fonts-style mbr-bold display-7 mt-20">{title}</h2>
            </div>
          </Col>
        </div>
      </Container>
    </section>
  );
}

export default SectionTitle;