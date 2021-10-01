import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Loading from '../../components/Loading';

const MySwal = withReactContent(Swal);

import { getBaseData, setBaseData } from '../../actions/actionBaseData';
import { setCountOfDesktop } from '../../actions/actionOrderInfo';

const WeddingBaseSetting = (props) => {
  const { SToken } = props;

  const introImage = useSelector(state => state.introImages.images);

  const titleImg = (imgNum) => {
    const bgImage = introImage && introImage.length > imgNum && `url(http://backend.wedding-pass.com/ERPUpload/4878/${introImage[imgNum].Image})`;
    return (bgImage) ? {backgroundImage: bgImage, backgroundSize: 'cover'} : '';
  }

  const dispatch = useDispatch();

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

    // 檢查 token 是否有效
    const formData = new FormData();
    formData.append('SToken', SToken);

    // 取得婚禮資訊
    dispatch(getBaseData(formData, (res, err) => {
      if(res.Msg === 'OK') {
        let result = res.data;
        let weddingDate = new Date(result.WeddingDate).getTime();
        let momentWeddingDate = moment(weddingDate).format('YYYY-MM-DD');
        result.WeddingDate = momentWeddingDate;
        result.showCountOfDesktop = (result.CountOfDesktop).toString();

        setMain({...main, ...result});
        MySwal.close();
      } else {
        MySwal.fire('Oops...', '系統發生錯誤', 'error');
      }
    }));
  }, []);
  
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
      // 儲存婚禮資訊
      dispatch(setBaseData(SToken, main, (res, err) => {
        console.log(res);
        if(res.Msg === 'OK') {
          MySwal.fire({
            title: '更新完成',
            icon: 'success'
          }).then(() => {
            console.log("更改單桌人數");
            // 更改單桌人數
            dispatch(setCountOfDesktop(main.CountOfDesktop), null);
          });
        } else {
          MySwal.fire({
            title: '更新失敗',
            icon: 'error'
          });
        }
      }));

      
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
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">WEDDING-PASS 管理者 電話</label>
                    <input type="tel" placeholder="聯絡人電話" required="required" className="form-control display-7" value={main.ContactPhone} readOnly />
                    <small className="text-main-color">** WEDDDING-PASS 會將一次性登入密碼發送至此信箱</small>
                  </Col>
                </div>
                <div className="dragArea form-row">
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">WEDDING-PASS 管理者姓名</label>
                    <input type="text" placeholder="聯絡人姓名" required="required" className="form-control display-7" value={main.ContactName} onChange={(e) => handleChangeForm(e, 'ContactName')} />
                  </Col>
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">WEDDING-PASS 管理者 Email</label>
                    <input type="text" placeholder="聯絡人Email" required="required" className="form-control display-7" value={main.ContactEmail} onChange={(e) => handleChangeForm(e, 'ContactEmail')} />
                  </Col>
                </div>

                <div className="dragArea form-row mt-50">
                  <Col xs={12}>
                    <h4 className="mbr-fonts-style display-5 text-center" style={{fontSize: '1.2rem'}}>新人資料編輯</h4>
                  </Col>
                  <Col xs={12}>
                    <hr />
                  </Col>
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">新娘姓名</label>
                    <input type="text" placeholder="新娘姓名"className="form-control display-7" required="required" value={main.BrideName} onChange={(e) => handleChangeForm(e, 'BrideName')} />
                  </Col>
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">新郎姓名</label>
                    <input type="text" placeholder="新郎姓名" className="form-control display-7" required="required" value={main.GroomName} onChange={(e) => handleChangeForm(e, 'GroomName')} />
                  </Col>
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">新娘Email</label>
                    <input type="text" placeholder="新娘姓名" className="form-control display-7" required="required" value={main.BrideEmail} onChange={(e) => handleChangeForm(e, 'BrideEmail')} />
                  </Col>
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">新郎Email</label>
                    <input type="text" placeholder="新郎姓名" className="form-control display-7" required="required" value={main.GroomEmail} onChange={(e) => handleChangeForm(e, 'GroomEmail')} />
                  </Col>
                  <Col xs={6} className="form-group mt-50">
                    <h4 className="mbr-fonts-style display-5" style={{fontSize: '1.2rem'}}>婚禮基本資料設定</h4>
                  </Col>
                  <Col xs={6}>
                    <hr />
                  </Col>
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">新娘稱呼</label>
                    <input type="text" placeholder="新娘姓名" className="form-control display-7" required="required" value={main.BrideNickName} onChange={(e) => handleChangeForm(e, 'BrideNickName')} />
                    <small className="text-main-color">此資訊會呈現在電子喜帖等相關資訊上<br /></small>
                  </Col>
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">新郎稱呼</label>
                    <input type="text" placeholder="新郎姓名" className="form-control display-7" required="required" value={main.GroomNickName} onChange={(e) => handleChangeForm(e, 'GroomNickName')} />
                    <small className="text-main-color">此資訊會呈現在電子喜帖等相關資訊上<br /></small>
                  </Col>
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">婚宴日期</label>
                    <input type="date" required="required" className="form-control display-7" value={main.WeddingDate} onChange={(e) => handleChangeForm(e, 'WeddingDate')} />
                  </Col>
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">婚宴日期顯示</label>
                    <input type="text" placeholder="例如：2021年5月20號 (情人節當天)" required="required" className="form-control display-7" value={main.WeddingDateDesc} onChange={(e) => handleChangeForm(e, 'WeddingDateDesc')} />
                    <small className="text-main-color">例如：2021年5月20號 (情人節當天)<br />以下資訊會呈現在電子喜帖等相關資訊上</small>
                  </Col>
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">婚宴場地</label>
                    <input type="text" placeholder="婚宴場地" data-form-field="text" required="required" className="form-control display-7" value={main.WeddingVenue} onChange={(e) => handleChangeForm(e, 'WeddingVenue')} />
                    <small className="text-main-color">以下資訊會呈現在電子喜帖等相關資訊上<br /></small>
                  </Col>
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">宴會廳名稱</label>
                    <input type="text" placeholder="宴會廳名稱" data-form-field="text" required="required" className="form-control display-7" value={main.VenueRoom} onChange={(e) => handleChangeForm(e, 'VenueRoom')} />
                    <small className="text-main-color">以下資訊會呈現在電子喜帖等相關資訊上<br /></small>
                  </Col>
                  <Col xs={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">婚宴地址</label>
                    <input type="text" placeholder="婚宴地址" data-form-field="text1" required="required" className="form-control display-7" value={main.WeddingAddress} onChange={(e) => handleChangeForm(e, 'WeddingAddress')} />
                    <small className="text-main-color">此資訊會呈現在電子喜帖等相關資訊上<br /></small>
                  </Col>
                  <Col xs={6} className="form-group">
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
    </section>
  );
}

export default WeddingBaseSetting;

