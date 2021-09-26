import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Loading from '../Loading';

import '../../scss/congratulation.scss';

const MySwal = withReactContent(Swal);

const Congratulation = (props) => {
  const {SToken, introImage, dtList, dtColumns, WPColumnSetup} = props;

  const titleImg = (imgNum) => {
    const bgImage = introImage && introImage.length > 0 && `url(http://backend.wedding-pass.com/ERPUpload/4878/${introImage[imgNum].Image})`;
    return (bgImage) ? {backgroundImage: bgImage, backgroundSize: 'cover'} : '';
  }

  // 初始化
  useEffect(() => {
    MySwal.fire({
      title: "",
      html: <Loading />,
      customClass: {
        popup: 'bg-transparent',
      },
      showConfirmButton: false,
      showCancelButton: false,
    });

    initCongratulation(dtList, dtColumns);
  }, []);

  // 處理過的資料
  const [keyColumn1, setKeyColumnName1] = useState({ Name: '賓客姓名', DBColumnName: null });
  const [keyColumn2, setKeyColumnName2] = useState({ Name: '賓客關係', DBColumnName: null });
  const [keyColumn3, setKeyColumnName3] = useState({ Name: '前台報名_婚禮賀詞', DBColumnName: null });
  const [congrationList, setCongrationList] = useState([]);

  const initCongratulation = (dtList, dtColumns) => {
    let congrationList = [];

    dtColumns.map(item => {
      if(item.Name === keyColumn1.Name) setKeyColumnName1({...keyColumn1, DBColumnName: item.DBColumnName});
      if(item.Name === keyColumn2.Name) setKeyColumnName2({...keyColumn2, DBColumnName: item.DBColumnName});
      if(item.Name === keyColumn3.Name){
        setKeyColumnName3({...keyColumn3, DBColumnName: item.DBColumnName});
        dtList.map(subItem => {
          if(!!subItem[item.DBColumnName]){
            congrationList.push(subItem);
          }
        });

        setCongrationList([...congrationList]);
        MySwal.close();
      }
    });
  }

  return (
    <section className="features1 cid-rX4jzrRcmX bg-color-pink">
      <section className="form cid-rLQ7009Pot p-0 bg-color-pink">
        <div className="fixed-title-img" style={titleImg(16)}></div>
        <Container>
          <Row>
          {(congrationList && congrationList.length > 0) ? congrationList.map((item, index) => (
            <div className="col-11 col-md-8 mx-auto mbr-form border-radius-15 bg-card mb-50" key={index}>
              <div className="dragArea form-row mt-30">
                <Col xs={12}>
                  <h4 className="mbr-fonts-style display-5 text-gray-333">{item[keyColumn1.DBColumnName]}</h4>
                </Col>
                <Col xs={12}>
                  <hr />
                </Col>
                <Col xs={4}>
                  <svg width="48" height="48" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" fill="#fdd4d4">
                    <path d="M832 320v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136zm896 0v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136z"></path>
                  </svg>
                </Col>
                <Col xs={8} className="congratulation-content">
                  <p>
                    {item[keyColumn3.DBColumnName]}
                  </p>
                </Col>
                <Col xs={12} className="text-right">
                  <small className="pr-20">
                    {item._SRT_EDIT_TIMESTAMP.substr(0,10)}
                  </small>
                </Col>
              </div>
              <div className="mt-30"></div>
            </div>))
            :
            <Col xs={12} className="text-center mt-100">
              <div className="nowrap">
                <svg width="48" height="48" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" fill="#fdd4d4">
                  <path d="M832 320v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136zm896 0v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136z"></path>
                </svg>
                尚未收到賓客的祝賀喔
              </div>
            </Col>
            }
          </Row>
        </Container>
      </section>
    </section>
  );
}

export default Congratulation;
