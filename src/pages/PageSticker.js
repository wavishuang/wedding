import React, { useState, useEffect, Fragment } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import HeaderDiv from '../components/HeaderDiv';
import ButtonSendInvitation from '../components/ButtonSendInvitation';
import Loading from '../components/Loading';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { 
  api_check_token,
  api_query_intro_image,
  api_add_sticker_request
} from '../utils/api';

import '../scss/base.scss';
import '../scss/send.scss';

const MySwal = withReactContent(Swal);

const PageSticker = function() {
  const LoginInfo = (sessionStorage && sessionStorage.data) ? JSON.parse(sessionStorage.data) : null;
  const SToken = LoginInfo ? LoginInfo.Token : null;

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

      api_check_token(formData)
        .then(res => {
          const result = res.data;
          if(!result.Msg || result.Msg !== 'OK') {
            location.href = 'start.html';
          }
        })
        .catch(err => {
          location.href = 'start.html';
        });
    } else {
      location.href = 'start.html';
    }
  }, []);

  // ＊＊＊＊＊＊ initial Data ＊＊＊＊＊＊
  // 圖片
  const [introImages, setIntroImages] = useState([]);

  // 初始化
  const initData = async () => {
    const formData = new FormData();
    formData.append('SToken', SToken);
    
    try {
      const introImage = await api_query_intro_image(formData);

      if(introImage.data && introImage.data.Msg === 'OK') {
        // intro image
        const images = JSON.parse(introImage.data.JSONContent);
        setIntroImages({...images});

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

  // sticker data
  const defaultSticker = {
    RecipientName: "",
    RecipientPhone: "",
    RecipientEmail: "",
    RecipientAreaCode: "",
    RecipientAddress: ""
  };
  const [sticker, setSticker] = useState({...defaultSticker});

  // 修改欄位
  const handleChangeForm = (e, columnName) => {
    let val = e.target.value;
    let newSticker = Object.assign({}, sticker);
    switch(columnName) {
      case 'RecipientName':  // 收件人姓名
        newSticker.RecipientName = val;
        break;
      case 'RecipientPhone': // 收件人電話
        newSticker.RecipientPhone = val;
        break;
      case 'RecipientEmail': // 收件人 Email
        newSticker.RecipientEmail = val;
        break;
      case 'RecipientAreaCode':  // 收件人 郵遞區號
        const regex = /\d/;
        let lastChar = val.charAt(val.length - 1);
        if(!regex.test(lastChar) && lastChar !== '') {
          return ;
        }

        newSticker.RecipientAreaCode = val;
        break;
      case 'RecipientAddress':  // 收件人 地址
        newSticker.RecipientAddress = val;
        break;
      default:
        return ;
    }

    setSticker(newSticker);
  }

  // 儲存設定
  const handleSubmit = () => {
    const formColumns = [
      'RecipientName',
      'RecipientPhone',
      'RecipientEmail',
      'RecipientAreaCode',
      'RecipientAddress'
    ];

    const formData = new FormData();
    formData.append('SToken', SToken);
    formColumns.map(item => {
      formData.append(item, sticker[item]);
    });

    MySwal.fire({
      title: "資料送出中，請稍候",
      html: <Loading />,
      customClass: {
        popup: 'bg-white',
      },
      showConfirmButton: false,
      showCancelButton: false,
      confirmButtonColor: "#713f94",
    });

    setTimeout(() => {
      // 婚禮資訊
      api_add_sticker_request(formData)
        .then(res => {
          const result = res.data;
          if(result.Msg && result.Msg === 'OK') {
            MySwal.fire({
              title: '資料送出成功',
              html: `<p style='color: rgb(254 82 91);font-weight:400'>請注意!! <br />系統會發送資料驗證信至您的管理者信箱，請您再次確認收件者資料無誤。</p>`,
              icon: 'success'
            }).then(result => {
              setSticker({...sticker, ...defaultSticker});
            });
          }
        })
        .catch(err => {
          MySwal.fire('更新失敗', '', 'error');
        });
    }, 500);
  }

  return (
    <Fragment>
      <HeaderDiv />
      <ButtonSendInvitation isBatchProcess={true} sendAll={null} isSticker={true} saveSticker={handleSubmit} />
      
      <section className="form cid-rLQ7009Pot pt-5">
        <Container>
          <Row>
            <Col xs={{ span: 10, offset: 1 }} md={{ span: 5, offset: 4}} className="form-group">
              {introImages && introImages[7] && introImages[7].Image && 
              <img src={`http://backend.wedding-pass.com/ERPUpload/4878/${introImages[7].Image}`} className="img-fluid" />}
            </Col>

            <Col xs={11} md={8} className="mx-auto mbr-form bg-main-color border-radius-15">
              <div className="dragArea form-row mt-30 pb-4">
                <Col xs={12}>
                  <h4 className="mbr-fonts-style display-5 text-center text-main-color">賓客專屬QRCode索取貼紙</h4>
                </Col>
                <Col xs={12}>
                  <hr />
                </Col>

                <Col sm={12} md={12} lg={6} className="form-group">
                  <label className="form-control-label mbr-fonts-style display-7">收件人姓名</label>
                  <input type="text" className="form-control display-7" placeholder="新娘姓名" required="required" value={sticker.RecipientName} onChange={(e) => handleChangeForm(e, 'RecipientName')} />
                </Col>

                <Col sm={12} md={12} lg={6} className="form-group">
                  <label className="form-control-label mbr-fonts-style display-7">收件人電話</label>
                  <input type="tel" className="form-control display-7" placeholder="收件人電話" required="required" value={sticker.RecipientPhone} onChange={(e) => handleChangeForm(e, 'RecipientPhone')} />
                </Col>

                <Col sm={12} md={12} lg={6} className="form-group">
                  <label className="form-control-label mbr-fonts-style display-7">收件人 - Email</label>
                  <input type="email" className="form-control display-7" placeholder="e.g. abc@123.com" required="required" value={sticker.RecipientEmail} onChange={(e) => handleChangeForm(e, 'RecipientEmail')} />
                </Col>

                <Col sm={12} md={12} lg={6} className="form-group">
                  <label className="form-control-label mbr-fonts-style display-7">收件人 - 郵遞區號</label>
                  <input type="tel" className="form-control display-7" maxLength="5" placeholder="收件人 - 郵遞區號" required="required" value={sticker.RecipientAreaCode} onChange={(e) => handleChangeForm(e, 'RecipientAreaCode')} />
                </Col>

                <Col sm={12} md={12} lg={6} className="form-group">
                  <label className="form-control-label mbr-fonts-style display-7">收件人 - 地址</label>
                  <input type="text" className="form-control display-7" placeholder="收件人 - 地址" required="required" value={sticker.RecipientAddress} onChange={(e) => handleChangeForm(e, 'RecipientAddress')} />
                </Col>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
}

export default PageSticker;
