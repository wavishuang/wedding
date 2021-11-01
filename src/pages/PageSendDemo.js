import React, { Fragment, useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import ButtonModalClose from '../components/ButtonModalClose';
import Loading from '../components/Loading';

import { _uuid } from '../utils/tools';
import { 
  api_check_token,
  api_query_order_info,
  api_send_email_demo_edm,
  api_send_mms_demo_edm
} from '../utils/api';

import '../scss/base.scss';
import '../scss/senddemo.scss';

//import BrandImg from '../images/logo_b-2x.png';

const MySwal = withReactContent(Swal);

const PageSendDemo = function() {
  const LoginInfo = (sessionStorage && sessionStorage.data) ? JSON.parse(sessionStorage.data) : null;
  const SToken = LoginInfo ? LoginInfo.Token : null;

  if(!LoginInfo || !SToken) location.href = 'index.html';
  const MobilePhone = LoginInfo.MobilePhoneCountryCode + LoginInfo.MobilePhone;

  // 確認是否登入 && 檢查token是否有效
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

    if(LoginInfo && SToken) { 
      // 檢查 token 是否有效
      const formData = new FormData();
      formData.append('SToken', SToken);

      const check_token = async () => {
        const res = await api_check_token(formData);
        if(!res.data || res.data.Msg !== 'OK' ) {
          location.href = 'index.html';
        }
      }

      check_token();
    } else {
      location.href = 'index.html';
    }
  }, []);

  // 版面樣式(背景顏色)
  const bgColor = [
    { id: 1, name: 'yellow', classes: 'btn-circle-yellow'},
    { id: 2, name: 'purple', classes: 'btn-circle-purple'},
    { id: 3, name: 'blue', classes: 'btn-circle-blue'},
    { id: 4, name: 'red', classes: 'btn-circle-red'}
  ];

  // 取得 背景顏色(樣式)
  const [activeBg, setActiveBg] = useState(() => {
    if(localStorage && localStorage.themeId) {
      return parseInt(localStorage.themeId);
    }
    return 1;
  });

  const linearBg = () => {
    const activeColor = bgColor.find(item => item.id === activeBg);
    return activeColor.name;
  }

  // 改變背景顏色(樣式) & 存入 localStorage.themeId
  const changeBg = (themeId) => {
    localStorage.setItem('themeId', themeId);
    setActiveBg(themeId);
  }

  // 步驟(step)
  let stepList = [false, false, false, false, false, false, true];
  const [activeStep, setActiveStep] = useState(stepList);

  // 初始化
  const [orderInfo, setOrderInfo] = useState({});

  const initData = async () => {
    const formData = new FormData();
    formData.append('SToken', SToken);

    try {
      const orderInfo = await api_query_order_info(formData);

      if(orderInfo.data && orderInfo.data.Msg === 'OK') {
        const resOrderInfo = JSON.parse(orderInfo.data.JSONContent)[0];

        initSendDemo(resOrderInfo);

        setOrderInfo({...resOrderInfo});
        MySwal.close();
      } else {
        MySwal.fire('Oops...', '系統發生錯誤', 'error');
      }
    } catch(err) {
      console.log(err);
      MySwal.fire('Oops...', '系統發生錯誤', 'error');
    };
  }

  useEffect(() => {
    initData();
  }, []);

  // 處理過的資料
  const [ident, setIdent] = useState('');
  const [inviteCardID, setInviteCardID] = useState(null);
  const [groomEmail, setGroomEmail] = useState('');
  const [brideEmail, setBrideEmail] = useState('');

  const initSendDemo = (orderInfo) => {
    setIdent(orderInfo.Ident)
    setInviteCardID(orderInfo.InviteCardID);
    setGroomEmail(orderInfo.GroomEmail);
    setBrideEmail(orderInfo.BrideEmail);
    MySwal.close();
  }

  // MMS Modal
  const [modalMMSShow, setMMSModalShow] = useState(false);

  // send MMS
  const sendMMSSample = () => {
    console.log('send mms');
    setMailModalShow(false);
    MySwal.fire({
      title: "發送中，請稍候",
      html: <Loading />,
      customClass: {
        popup: 'bg-white'
      },
      showConfirmButton: false,
      showCancelButton: false,
      confirmButtonColor: "#713f94",
    });

    setTimeout(() => {
      const formData = new FormData();
      formData.append('SToken', SToken);
      formData.append('MobilePhone', MobilePhone);
      formData.append('GroomEmail', groomEmail);
      formData.append('BrideEmail', brideEmail);

      const sendmms = async () => {
        const res = await api_send_mms_demo_edm(formData);

        if(res.data && res.data.Msg === 'OK') {
          MySwal.fire({
            title: "發送成功",
            text: "WEDDING-PASS 已經將測試的婚禮邀請函發送至您手機簡訊信箱!",
            icon: "success"
          }).then(() => {
            console.log('success');
            MySwal.close();
            setMailModalShow(true);
          });
        } else {
          MySwal.fire("發送失敗", data.Msg, "error");
        }
      }

      sendmms();
    }, 500);
  }

  // Mail Modal
  const [modalMailShow, setMailModalShow] = useState(false);

  // send Mail
  const sendMailSample = () => {
    console.log('send email');
    setMailModalShow(false);
    MySwal.fire({
      title: "發送中，請稍候",
      html: <Loading />,
      customClass: {
        popup: 'bg-white'
      },
      showConfirmButton: false,
      showCancelButton: false,
      confirmButtonColor: "#713f94",
    });

    setTimeout(() => {
      const formData = new FormData();
      formData.append('SToken', SToken);
      formData.append('MobilePhone', MobilePhone);
      formData.append('GroomEmail', groomEmail);
      formData.append('BrideEmail', brideEmail);

      const sendemail = async () => {
        const res = await api_send_email_demo_edm(formData);

        if(res.data && res.data.Msg === 'OK') {
          MySwal.fire({
            title: "發送成功",
            text: "WEDDING-PASS 已經將測試的婚禮邀請函發送至您跟另一半的信箱!",
            icon: "success"
          }).then(() => {
            location.href = "main.html";
          });
        } else {
          MySwal.fire("發送失敗", data.Msg, "error");
        }
        console.log(res);
      }

      sendemail();
    }, 500);
  }

  return (
    <Fragment>
      <section className="wrapper-s vh-100 bg-pic-edm">
        {/** 漸層底色 */}
        <div className={`bg-linear ${'bg-'+ linearBg()}`}></div>

        <Container className="pt-157">
          <div className="media-container-row">
            <Col xs={12} md={8} className="title text-center">
              <h3 className="mbr-section-subtitle align-center mbr-white mbr-light pb-0 mbr-fonts-style display-2">
                Step 7. 測試發送電子邀請函
              </h3>

              {inviteCardID !== null &&
              <div className="item" style={{transform: 'none'}}>
                {/*<div className="polaroid" style={{backgroundImage: `url("http://backend.wedding-pass.com/WeddingPass/inviteCard_Order/"+ ${ident} +"/"+ ${item.ID} +"/_preview.jpg")`}}>
                  <img id="uploaded-image" src={"../images/phone-portrait.png"} className="phone-bg" />
                </div>
                <div className="polaroid" style={{backgroundImage: `url("http://backend.wedding-pass.com/WeddingPass/inviteCard_Order/"+ ${ident} +"/"+ ${inviteCardID} +"/_preview.jpg")`}}>
                  <img id="uploaded-image" src={"../images/phone-portrait.png"} className="phone-bg" />
                </div>
              */}
                <div className="polaroid" style={{backgroundImage: `url(http://backend.wedding-pass.com/WeddingPass/inviteCard_Order/${ident}/${inviteCardID}/_preview.jpg)`}}>
                  <img id="uploaded-image" src={"../images/phone-portrait.png"} className="phone-bg" />
                </div>
              </div>
              }
            </Col>
          </div>
        </Container>

        <div className="w-100 bottom-nav">
          <div className="step-btns">
            <div className="w-btn d-flex justify-content-center mt-05">
              {orderInfo.LeadingStatus === 6 
                ? <a className={`btn btn-3d btn-block px-0 text-light  ${'display-'+linearBg()}`} onClick={() => setMMSModalShow(true)}>測試發送邀請函</a>
                : <a className={`btn btn-3d btn-block px-0 text-light  ${'display-'+linearBg()}`} onClick={() => setMailModalShow(true)}>測試發送邀請函</a>
              }
            </div>
          </div>

          <div className="nav-bottom d-flex justify-content-between">
            <ul className="nav nav-bg">
              {bgColor.map(item => 
                <li key={item.name}>
                  <button type="button" className={`btn btn-circle ${item.classes} ${item.id === activeBg ? 'active': ''}`} onClick={() => changeBg(item.id)}></button>
                </li>
              )}
            </ul>

            <ul className="nav nav-list">
              {activeStep.map((item, index) => 
                <li key={index}>
                  <div className={`btn-list ${item ? 'btn-circle-'+ linearBg(): ''}`}></div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <Modal show={modalMMSShow} className={`${'modal-'+linearBg()}`} onHide={() => setMMSModalShow(false)} centered>
        <Modal.Header className="d-flex flex-column align-items-center">
          <div className="header-bg">
            <img src="../images/modal/picture_1-2x.png" alt="測試:MMS手機圖文簡訊邀請函發送" title="測試:MMS手機圖文簡訊邀請函發送" />
          </div>
          {/*<Modal.Title className="mbr-fonts-style display-5">測試:MMS手機圖文簡訊邀請函發送</Modal.Title>*/}
          <ButtonModalClose handleModalClose={() => setMMSModalShow(false)} />
        </Modal.Header>
        <Modal.Body>
          <h2 className="title-text">測試:MMS手機圖文簡訊邀請函發送</h2>
          <form className="mbr-form form-with-styler d-flex flex-column justify-content-space-between">
            <div className="form-group">
              <label className="label-text">您的手機</label>
              <input type="text" value={MobilePhone} className="form-control display-7" disabled={true} />
            </div>

            <div className="text-center w-100">
              <button type="button" onClick={() => sendMMSSample()} className="btn btn-3d btn-block">測試發送</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={modalMailShow} onHide={() => setMailModalShow(false)} centered>
        <Modal.Header>
          <Modal.Title className="mbr-fonts-style display-5">測試：Email 電子邀請函發送</Modal.Title>
          <ButtonModalClose handleModalClose={() => setMailModalShow(false)} />
        </Modal.Header>
        <Modal.Body>
          <form className="mbr-form form-with-styler">
            <div className="dragArea row">
              <div className="col form-group">
                <label>新娘Mail</label>
                <input type="email" placeholder="新娘Mail" className="form-control display-7" value={groomEmail} disabled={orderInfo.LeadingStatus === 9} />
              </div>
            </div>
            <div className="dragArea row">
              <div className="col form-group">
                <label>新郎Mail</label>
                <input type="email" placeholder="新郎Mail" required="required" className="form-control display-7" value={brideEmail} disabled={orderInfo.LeadingStatus === 9} />
                <small className="text-main-color fw-600">WEDDING-PASS 婚禮報到<br />會將您選擇的這一張電子邀請函<br />發送至您跟另一半的 Email信箱<br />常用手機收發Email的賓客會是一個很好的選擇。</small>
              </div>
            </div>
            <div className="text-center">
              <div className="col-auto">
                <button type="button" onClick={() => sendMailSample()} className="btn btn-3d rounded-sm">測試發送</button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
}

export default PageSendDemo;
