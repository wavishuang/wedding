import React, { Fragment, useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);

import HeaderDiv from '../components/HeaderDiv';
import Loading from '../components/Loading';

import '../scss/base.scss';
import '../scss/start.scss';

import ApiCaller from '../utils/ApiCaller';

const PageStart = function() {
  // Step2: 輸入 & 簡訊驗證碼
  const [checkSMS, setCheckSMS] = useState('');
  
  const handleSMS = (e) => {
    let sms = e.target.value;
    const reg = /09\d{2}(\d{6}|-\d{3}-\d{3})/
    //Strip all non-numeric characters from string in JavaScripts
    sms = sms.replace(/\D/g,'');
    setCheckSMS(sms);
  }

  const CheckLogin = () => {
    MySwal.fire({
      title: "簡訊驗證中",
      html: <Loading />,
      customClass: {
        popup: 'bg-white',
      },
      showConfirmButton: false,
      showCancelButton: false,
    });
    
    setTimeout(function(){
      const formData = new FormData();

      formData.append('MobilePhoneCountryCode', mobilePhoneCountryCode);
      formData.append('MobilePhone', mobilePhone);
      formData.append('CheckSMS', checkSMS);

      ApiCaller.connector().check_login(formData, (res, err) => {
        if (res.Msg == "OK") {
          sessionStorage.data = JSON.stringify(res);

          if (parseInt(res.LeadingStatus) === 2) {
            location.href="name.html";
          } else {
            location.href="main.html";
          }

          window.navigator.vibrate(200); 
          window.navigator.vibrate(200);
        } else {
          MySwal.fire('Oops...', res.Msg, 'error');
        }
      });
    }, 500);
  }

  // Step1: 輸入 & 檢查電話號碼
  const mobilePhoneCountryCode = '+886';
  const [sendSMS, setSendSMS] = useState(false);

  const [mobilePhone, setMobilePhone] = useState('');
  const [checkPhone, setCheckPhone] = useState(true);
  const handleMobilePhone = (e) => {
    let phone = e.target.value;
    const reg = /09\d{2}(\d{6}|-\d{3}-\d{3})/
    //Strip all non-numeric characters from string in JavaScript
    phone = phone.replace(/\D/g,'');
    setMobilePhone(phone);
  }

  useEffect(() => {
    const reg = /09\d{2}(\d{6}|-\d{3}-\d{3})/
    const checkPhone = reg.test(mobilePhone);
    setCheckPhone(!checkPhone);
  }, [mobilePhone]);

  // 輸入完手機號碼後登入
  const Login = () => {
    MySwal.fire({
      title: "驗證簡訊發送中",
      html: <Loading />,
      customClass: {
        popup: 'bg-white',
      },
      showConfirmButton: false,
      showCancelButton: false,
    });

    setTimeout(() => {
      const formData = new FormData();

      formData.append('MobilePhoneCountryCode', mobilePhoneCountryCode);
      formData.append('MobilePhone', mobilePhone);

      ApiCaller.connector().login(formData, (res, err) => {
        //console.log(res);
        if (res.Msg == "OK") {
          setSendSMS(true);
          MySwal.close();
        } else {
          MySwal.fire('Oops...', res.Msg, 'error');
        }
      });
    }, 500);
  }

  return (
    <Fragment>
      <HeaderDiv />

      <nav id="page_start_nav" className="navbar fixed-bottom justify-content-center d-flex row mx-auto position-fixed container main px-0">
        <div className="col-12 col-md-2 form-group opacity-10">
          <input type="tel" className="form-control display-7 text-center opacity-10 font-weight-600" />
        </div>
      </nav>

      <section className="wrapper-s vh-100 bg-pic-start">
        <div className="mbr-overlay"></div>
        <Container className="main">
          <Row className="justify-content-center">
            <Col sm={10} className="mb-5">
              {sendSMS ? (
                <h1 className="mbr-fonts-style mbr-section-title mbr-white mbr-bold align-center display-2">Step 2: 請輸入您的簡訊驗證碼</h1>
                ) : ( 
                <h1 className="mbr-fonts-style mbr-section-title mbr-white mbr-bold align-center display-2">Step 1: 請輸入您的手機號碼</h1>
              )}
            </Col>

            <Col sm={12} className="input-form page_start-col">
              <form className="mbr-form form-with-styler">
                {sendSMS ? (
                  <div className="dragArea form-row justify-content-center">
                    <Col xs={8} className="form-group">
                      <input type="tel" className="form-control display-7 text-center font-weight-600 opacity-80 letter-spacing-3-rem" value={checkSMS} onChange={(e) => handleSMS(e)} />
                    </Col>
                    <Col xs={12} className="input-group-btn mbr-section-btn text-center mt-2-rem">
                      <button type="button" className="btn btn-3d display-4" onClick={() => CheckLogin()}>請輸入簡訊驗證碼</button>
                    </Col>
                  </div>
                  ) : (
                  <div className="dragArea form-row justify-content-center">
                    <Col md={2} sm={4} xs={4} className="form-group">
                      <input type="text" name="886" placeholder="+886" className="form-control display-7 text-center font-weight-600 opacity-80 letter-spacing-3-rem" value={mobilePhoneCountryCode} readOnly={true} disabled={true} />
                    </Col>
                    <Col md={4} sm={8} xs={8} className="form-group">
                      <input type="tel" placeholder="09xx-xxx-xxx" maxLength={10} className="form-control display-7 text-center font-weight-600 opacity-80 letter-spacing-3-rem" value={mobilePhone} onChange={(e) => handleMobilePhone(e)} />
                    </Col>

                    <Col sm={12} className="input-group-btn mbr-section-btn text-center mt-2-rem">
                      <button type="button" className="btn btn-3d display-4" onClick={() => Login()} disabled={checkPhone}>取得一次性登入密碼</button>
                    </Col>
                  </div>
                )}
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
}

export default PageStart;
