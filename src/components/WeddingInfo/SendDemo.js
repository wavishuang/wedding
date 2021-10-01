import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import ButtonModalClose from '../../components/ButtonModalClose';
import Loading from '../../components/Loading';

import { 
  api_send_email_demo_edm,
  api_send_mms_demo_edm
} from '../../utils/api';

import '../../scss/edm.scss';

const MySwal = withReactContent(Swal);

const SendDemo = (props) => {
  const {SToken, MobilePhone} = props;

  const orderInfo = useSelector(state => state.orderInfo);

  const [ident, setIdent] = useState('');
  const [inviteCardID, setInviteCardID] = useState(null);
  const [groomEmail, setGroomEmail] = useState('');
  const [brideEmail, setBrideEmail] = useState('');

  useEffect(() => {
    if(orderInfo) {
      setIdent(orderInfo.Ident)
      setInviteCardID(orderInfo.InviteCardID);
      setGroomEmail(orderInfo.GroomEmail);
      setBrideEmail(orderInfo.BrideEmail);
    }
  }, [orderInfo]);

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
    <section className="wrapper-s bg-pic-edm">
      <div className="mbr-overlay opacity-40"></div>
      <Container className="pb-2">
        <div className="media-container-row">
          <Col xs={12} md={8} className="title text-center">
            <h3 className="mbr-section-subtitle align-center mbr-white mbr-light pb-0 mbr-fonts-style display-2">
              <strong>測試發送電子邀請函</strong>
            </h3>

            {inviteCardID !== null &&
            <div className="item" style={{transform: 'none', height: '43vh'}}>
              <div className="polaroid">
                <img id="uploaded-image" src={`http://backend.wedding-pass.com/WeddingPass/inviteCard_Order/${ident}/${inviteCardID}/_preview.jpg`} />
              </div>
            </div>}
          </Col>
        </div>

        <div className="w-100 d-flex justify-content-center mt-05">
          <Col xs={12}>
            {orderInfo.LeadingStatus === 6 
              ? <a className="btn btn-3d btn-block px-0 text-light" onClick={() => setMMSModalShow(true)}>測試發送邀請函</a>
              : <a className="btn btn-3d btn-block px-0 text-light" onClick={() => setMailModalShow(true)}>測試發送邀請函</a>
            }
          </Col>
        </div>
        <div className="w-100 d-flex justify-content-center mt-05">
          <Col xs={12}>
            <button className="btn btn-3d btn-block px-0" onClick={() => props.goNextPage('EDM')}>上一步</button>
          </Col>
        </div>
      </Container>

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
    </section>
  );
}

export default SendDemo;

