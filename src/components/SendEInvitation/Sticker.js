import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Loading from '../../components/Loading';

import { 
  api_add_sticker_request
} from '../../utils/api';

import '../../scss/send.scss';

const MySwal = withReactContent(Swal);

const Sticker = (props) => {
  const { SToken } = props;

  const introImage = useSelector(state => state.introImages.images);

  const titleImg = (imgNum) => {
    const bgImage = introImage && introImage.length > imgNum && `url(http://backend.wedding-pass.com/ERPUpload/4878/${introImage[imgNum].Image})`;
    return (bgImage) ? {backgroundImage: bgImage, backgroundSize: 'cover'} : '';
  }

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
      api_add_sticker_request(formData)
        .then(res => {
          const result = res.data;
          if(result.Msg && result.Msg === 'OK') {
            MySwal.fire({
              title: '資料送出成功',
              html: `<p style='color: rgb(254 82 91);font-weight:400'>請注意!! <br />系統會發送資料驗證信至您的管理者信箱，請您再次確認收件者資料無誤。</p>`,
              icon: 'success'
            }).then(() => {
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
    <section className="header12 cid-rW0yhSdFBy bg-color-pink">
      <section className="form p-0 cid-rLQ7009Pot bg-transparent">
        <div className="fixed-title-img" style={titleImg(7)}></div>
        <Container className="bg-transparent">
          <Row className="bg-transparent">
            <Col md={12} lg={10} className="mx-auto mbr-form">
              <form className="mbr-form" method="post">
                <div className="dragArea form-row">
                  <Col xs={12}>
                    <hr />
                  </Col>

                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">收件人姓名</label>
                    <input type="text" className="form-control display-7" placeholder="新娘姓名" required="required" value={sticker.RecipientName} onChange={(e) => handleChangeForm(e, 'RecipientName')} />
                  </Col>

                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">收件人電話</label>
                    <input type="tel" className="form-control display-7" placeholder="收件人電話" required="required" value={sticker.RecipientPhone} onChange={(e) => handleChangeForm(e, 'RecipientPhone')} />
                  </Col>

                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">收件人 - Email</label>
                    <input type="email" className="form-control display-7" placeholder="e.g. abc@123.com" required="required" value={sticker.RecipientEmail} onChange={(e) => handleChangeForm(e, 'RecipientEmail')} />
                  </Col>

                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">收件人 - 郵遞區號</label>
                    <input type="tel" className="form-control display-7" maxLength="5" placeholder="收件人 - 郵遞區號" required="required" value={sticker.RecipientAreaCode} onChange={(e) => handleChangeForm(e, 'RecipientAreaCode')} />
                  </Col>

                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">收件人 - 地址</label>
                    <input type="text" className="form-control display-7" placeholder="收件人 - 地址" required="required" value={sticker.RecipientAddress} onChange={(e) => handleChangeForm(e, 'RecipientAddress')} />
                  </Col>

                  <Col xs={12} className="mt-5">
                    <a className="btn btn-3d btn-block px-0 text-light" onClick={() => handleSubmit()}>送出索取</a>
                  </Col>
                </div>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </section>
  );
}

export default Sticker;

