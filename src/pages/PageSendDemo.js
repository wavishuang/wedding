import React, { Fragment, useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import HeaderDiv from '../components/HeaderDiv';
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
import '../scss/edm.scss';

const MySwal = withReactContent(Swal);

const PageSendDemo = function() {
  const LoginInfo = (sessionStorage && sessionStorage.data) ? JSON.parse(sessionStorage.data) : null;
  const SToken = LoginInfo ? LoginInfo.Token : null;
  const MobilePhone = LoginInfo.MobilePhoneCountryCode + LoginInfo.MobilePhone;

  if(!LoginInfo || !SToken) location.href = 'start.html';
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
          location.href = 'start.html';
        }
      }

      check_token();
    } else {
      location.href = 'start.html';
    }
  }, []);

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
      <HeaderDiv />

      <section className="wrapper-s vh-100 bg-pic-edm">
        <div className="mbr-overlay opacity-40"></div>
        <Container>
          <div className="media-container-row">
            <Col xs={12} md={8} className="title text-center">
              <h3 className="mbr-section-subtitle align-center mbr-white mbr-light pb-0 mbr-fonts-style display-2">
                <strong>Step 6. 測試發送電子邀請函</strong>
              </h3>

              {inviteCardID !== null &&
              <div className="item" style={{transform: 'none'}}>
                <div className="polaroid">
                  <img id="uploaded-image" src={`http://backend.wedding-pass.com/WeddingPass/inviteCard_Order/${ident}/${inviteCardID}/_preview.jpg`} />
                </div>
              </div>
              }
            </Col>
          </div>
        </Container>

        <nav className="navbar fixed-bottom justify-content-center d-flex row mx-auto position-fixed container main px-0">      
          <div className="w-100 d-flex justify-content-center">
            <Col xs={12} md={3}>
              {orderInfo.LeadingStatus === 6 
                ? <a className="btn btn-3d btn-block px-0 text-light" onClick={() => setMMSModalShow(true)}>測試發送邀請函</a>
                : <a className="btn btn-3d btn-block px-0 text-light" onClick={() => setMailModalShow(true)}>測試發送邀請函</a>
              }
            </Col>
          </div>
        </nav>
      </section>

      <Modal show={modalMMSShow} onHide={() => setMMSModalShow(false)} centered>
        <Modal.Header>
          <Modal.Title className="mbr-fonts-style display-5">測試：MMS 手機圖文簡訊邀請函發送</Modal.Title>
          <ButtonModalClose handleModalClose={() => setMMSModalShow(false)} />
        </Modal.Header>
        <Modal.Body>
          <form className="mbr-form form-with-styler">
            <div className="dragArea row">
              <div class="col form-group">
                <label>您的手機</label>
                <input type="text" value={MobilePhone} className="form-control display-7" disabled={true} />
                <small className="text-main-color fw-600">WEDDING-PASS 婚禮報到<br />會將您選擇的這一張電子邀請函<br />利用MMS 圖文簡訊發送至您的手機簡訊信箱。<br />適合沒有習慣使用手機接收E-Mail的賓客<br />賓客只要打開手機簡訊即可出示QRCode, 進行婚禮報到</small>
              </div>
            </div>
            <div className="text-center">
              <div className="col-auto">
                <button type="button" onClick={() => sendMMSSample()} className="btn btn-3d rounded-sm">測試發送</button>
              </div>
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
