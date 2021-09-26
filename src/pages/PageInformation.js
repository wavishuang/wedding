import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import HeaderDiv from '../components/HeaderDiv';
import Loading from '../components/Loading';
//import ButtonPageClose from '../components/ButtonPageClose';

import { 
  api_check_token,
  api_query_intro_image,
  api_query_base_data,
  api_save_base_data
} from '../utils/api';

import '../scss/base.scss';
import '../scss/information.scss';

const MySwal = withReactContent(Swal);

const PageInformation = function() {
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

  // main data => baseData
  const [main, setMain] = useState({
    CountOfDesktop: 0,
    BrideEmail: "",
    BrideName: "",
    BrideNickName: "",
    GroomEmail: "",
    GroomName: "",
    GroomNickName: "",
    ContactEmail: "",
    ContactName: "",
    ContactPhone: "",
    VenueRoom: "",
    WeddingAddress: "",
    WeddingDate: "",
    WeddingDateDesc: "",
    WeddingVenue: "",
    WhoAmI: 0,
    showCountOfDesktop: ""
  });

  // 圖片 intro images
  const [introImage, setIntroImage] = useState([]);

  // 初始化
  const initData = async () => {
    const formData = new FormData();
    formData.append('SToken', SToken);
    
    try {
      const baseData = await api_query_base_data(formData);
      const introImage = await api_query_intro_image(formData);
      // console.log(baseData, introImage);

      let resMain = null;
      let images = null;
      if(baseData.data && baseData.data.Msg === 'OK' 
        && introImage.data && introImage.data.Msg === 'OK') {
        resMain = JSON.parse(baseData.data.JSONContent)[0];
        images = JSON.parse(introImage.data.JSONContent);

        let weddingDate = new Date(resMain.WeddingDate).getTime();
        let momentWeddingDate = moment(weddingDate).format('YYYY-MM-DD');
        resMain.WeddingDate = momentWeddingDate;
        resMain.showCountOfDesktop = (resMain.CountOfDesktop).toString();

        setMain({...main, ...resMain});
        setIntroImage({...images});
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

  // 修改欄位
  const handleChangeForm = (e, columnName) => {
    let val = e.target.value;
    let newMain = Object.assign({}, main);
    switch(columnName) {
      case 'BrideEmail':  // 新娘Email
        newMain.BrideEmail = val;
        break;
      case 'BrideName': // 新娘姓名
        newMain.BrideName = val;
        break;
      case 'BrideNickName': // 新娘稱呼
        newMain.BrideNickName = val;
        break;
      case 'showCountOfDesktop':  // 單桌人數
        const regex = /\d/;
        let lastChar = val.charAt(val.length - 1);
        if(!regex.test(lastChar) && lastChar !== '') {
          return ;
        }

        let CountOfDesktop = parseInt(val) ? parseInt(val) : 1;
        newMain.showCountOfDesktop = val;
        newMain.CountOfDesktop = CountOfDesktop;
        break;
      case 'ContactPhone':  // 管理者電話
        newMain.ContactPhone = val;
        break;
      case 'ContactName': // 管理者姓名
        newMain.ContactName = val;
        break;
      case 'ContactEmail':  // 管理者Email
        newMain.ContactEmail = val;
        break;
      case 'GroomEmail':  // 新郎Email
        newMain.GroomEmail = val;
        break;
      case 'GroomName': // 新郎姓名
        newMain.GroomName = val;
        break;
      case 'GroomNickName': // 新郎稱呼
        newMain.GroomNickName = val;
        break;
      case 'VenueRoom': // 宴會廳名稱
        newMain.VenueRoom = val;
        break;
      case 'WeddingAddress':  // 婚宴地址
        newMain.WeddingAddress = val;
        break;
      case 'WeddingDate': // 婚宴日期
        newMain.WeddingDate = val;
        break;
      case 'WeddingDateDesc': // 婚宴日期顯示
        newMain.WeddingDateDesc = val;
        break;
      case 'WeddingVenue':  // 婚宴場地
        newMain.WeddingVenue = val;
        break;
      case 'WhoAmI':  // 與新人的關係
        newMain.WhoAmI = parseInt(val);
        break;
      default:
        return ;
    }

    setMain(newMain);
  }

  // 儲存設定
  const handleSubmit = () => {
    const formColumns = [
      'CountOfDesktop',
      'BrideEmail',
      'BrideName',
      'BrideNickName',
      'GroomEmail',
      'GroomName',
      'GroomNickName',
      'ContactEmail',
      'ContactName',
      'ContactPhone',
      'VenueRoom',
      'WeddingAddress',
      'WeddingDate',
      'WeddingDateDesc',
      'WeddingVenue',
      'WhoAmI'
    ];
    const formData = new FormData();
    formData.append('SToken', SToken);
    formColumns.map(item => {
      formData.append(item, main[item]);
    });

    MySwal.fire({
      title: "更新中請稍候",
      html: <Loading />,
      customClass: {
        popup: 'bg-white',
      },
      showConfirmButton: false,
      showCancelButton: false,
    });

    setTimeout(() => {
      // 婚禮資訊
      api_save_base_data(formData)
        .then(res => {
          // console.log(res);
          const result = res.data;
          if(result.Msg && result.Msg === 'OK') {
            MySwal.fire({
              title: '更新完成',
              icon: 'success'
            }).then(result => {
              if(result.isConfirmed) {
                location.href = 'main.html';
              }
            });
          }
        })
        .catch(err => {
          MySwal.fire({
            title: '更新失敗',
            icon: 'error'
          });
        });
    }, 500);
  }

  return (
    <Fragment>
      <HeaderDiv goBack={true} />
      {/*<ButtonPageClose />*/}
      
      <section className="form cid-rLQ7009Pot pt-0">
        <Container>
          <Row>
            <Col xs={{ span: 10, offset: 1 }} md={{ span: 5, offset: 4}} className="form-group">
              {introImage && introImage[7] && introImage[7].Image && 
              <img src={`http://backend.wedding-pass.com/ERPUpload/4878/${introImage[7].Image}`} className="img-fluid" />}
            </Col>

            <Col xs={11} md={8} className="mx-auto mbr-form page-form">
              <form className="mbr-form" id="form" method="post">
                <div className="dragArea form-row mt-30">
                  <Col xs={12}>
                    <h4 className="mbr-fonts-style display-5 text-center text-main-color">婚禮基本資料編輯</h4>
                  </Col>
                  <Col xs={12}>
                    <hr />
                  </Col>
                  
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">與新人的關係？</label>

                    <select className="form-control display-7" required="required" value={main.WhoAmI} style={{WebkitAppearance: 'none'}} onChange={(e) => handleChangeForm(e, 'WhoAmI')}>
                      <option value={0} disabled>未選擇 </option>
                      <option value={1}>我是新娘 </option>
                      <option value={2}>我是新郎 </option>
                      <option value={3}>我是婚禮顧問 </option>
                      <option value={4}>我是幫忙新郎，管理婚禮流程的。</option>
                      <option value={5}>我是幫忙新娘，管理婚禮流程的。</option>
                      <option value={6}>其他</option>
                    </select>
                  </Col>

                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">WEDDING-PASS 管理者 電話</label>
                    <input type="tel" placeholder="聯絡人電話" required="required" className="form-control display-7" value={main.ContactPhone} readOnly />
                    <small className="text-main-color">** WEDDDING-PASS 會將一次性登入密碼發送至此信箱</small>
                  </Col>
                </div>

                <div className="dragArea form-row">
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">WEDDING-PASS 管理者姓名</label>
                    <input type="text" placeholder="聯絡人姓名" required="required" className="form-control display-7" value={main.ContactName} onChange={(e) => handleChangeForm(e, 'ContactName')} />
                  </Col>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">WEDDING-PASS 管理者 Email</label>
                    <input type="text" placeholder="聯絡人Email" required="required" className="form-control display-7" value={main.ContactEmail} onChange={(e) => handleChangeForm(e, 'ContactEmail')} />
                  </Col>
                </div>

                <div className="dragArea form-row mt-50">
                  <Col xs={12}>
                    <h4 className="mbr-fonts-style display-5 text-center">新人資料編輯</h4>
                  </Col>
                  <Col xs={12}>
                    <hr />
                  </Col>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">新娘姓名</label>
                    <input type="text" placeholder="新娘姓名"className="form-control display-7" required="required" value={main.BrideName} onChange={(e) => handleChangeForm(e, 'BrideName')} />
                  </Col>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">新郎姓名</label>
                    <input type="text" placeholder="新郎姓名" className="form-control display-7" required="required" value={main.GroomName} onChange={(e) => handleChangeForm(e, 'GroomName')} />
                  </Col>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">新娘Email</label>
                    <input type="text" placeholder="新娘姓名" className="form-control display-7" required="required" value={main.BrideEmail} onChange={(e) => handleChangeForm(e, 'BrideEmail')} />
                  </Col>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">新郎Email</label>
                    <input type="text" placeholder="新郎姓名" className="form-control display-7" required="required" value={main.GroomEmail} onChange={(e) => handleChangeForm(e, 'GroomEmail')} />
                  </Col>

                  <Col xs={12} className="mt-50">
                    <h4 className="mbr-fonts-style display-5 text-center">婚禮基本資料設定</h4>
                  </Col>
                  <Col xs={12}>
                    <hr />
                  </Col>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">新娘稱呼</label>
                    <input type="text" placeholder="新娘姓名" className="form-control display-7" required="required" value={main.BrideNickName} onChange={(e) => handleChangeForm(e, 'BrideNickName')} />
                    <small className="text-main-color">此資訊會呈現在電子喜帖等相關資訊上<br /></small>
                  </Col>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">新郎稱呼</label>
                    <input type="text" placeholder="新郎姓名" className="form-control display-7" required="required" value={main.GroomNickName} onChange={(e) => handleChangeForm(e, 'GroomNickName')} />
                    <small className="text-main-color">此資訊會呈現在電子喜帖等相關資訊上<br /></small>
                  </Col>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">婚宴日期</label>
                    <input type="date" required="required" className="form-control display-7" value={main.WeddingDate} onChange={(e) => handleChangeForm(e, 'WeddingDate')} />
                  </Col>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">婚宴日期顯示</label>
                    <input type="text" placeholder="例如：2021年5月20號 (情人節當天)" required="required" className="form-control display-7" value={main.WeddingDateDesc} onChange={(e) => handleChangeForm(e, 'WeddingDateDesc')} />
                    <small className="text-main-color">例如：2021年5月20號 (情人節當天)<br />以下資訊會呈現在電子喜帖等相關資訊上</small>
                  </Col>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">婚宴場地</label>
                    <input type="text" placeholder="婚宴場地" data-form-field="text" required="required" className="form-control display-7" value={main.WeddingVenue} onChange={(e) => handleChangeForm(e, 'WeddingVenue')} />
                    <small className="text-main-color">以下資訊會呈現在電子喜帖等相關資訊上<br /></small>
                  </Col>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">宴會廳名稱</label>
                    <input type="text" placeholder="宴會廳名稱" data-form-field="text" required="required" className="form-control display-7" value={main.VenueRoom} onChange={(e) => handleChangeForm(e, 'VenueRoom')} />
                    <small className="text-main-color">以下資訊會呈現在電子喜帖等相關資訊上<br /></small>
                  </Col>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">婚宴地址</label>
                    <input type="text" placeholder="婚宴地址" data-form-field="text1" required="required" className="form-control display-7" value={main.WeddingAddress} onChange={(e) => handleChangeForm(e, 'WeddingAddress')} />
                    <small className="text-main-color">此資訊會呈現在電子喜帖等相關資訊上<br /></small>
                  </Col>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">單桌人數</label>
                    <input type="text" placeholder="單桌人數" min="1" data-form-field="text1" required="required" className="form-control display-7" value={main.showCountOfDesktop} onChange={(e) => handleChangeForm(e, 'showCountOfDesktop')} />
                  </Col>
                </div>
                <a className="btn btn-3d btn-block px-0 text-light" onClick={() => handleSubmit()}>儲存設定</a>
              </form>

              <div style={{marginTop: '30px'}}></div>
            </Col>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
}

export default PageInformation;
