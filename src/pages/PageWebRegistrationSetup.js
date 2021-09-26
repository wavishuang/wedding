import React, { useState, useEffect, Fragment } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import HeaderDiv from '../components/HeaderDiv';
import Loading from '../components/Loading';
// import ButtonPageClose from '../components/ButtonPageClose';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

import { _uuid } from '../utils/tools';
import { 
  api_check_token,
  api_query_intro_image,

  api_query_web_registration_setup_20101501,
  api_query_web_registration_setup_20101501_photo_list,  
  api_save_web_registration_setup_20101501,
  api_add_web_registration_setup_20101501_photo_list
} from '../utils/api';

import '../scss/base.scss';
import '../scss/webregistrationsetup.scss';

const PageWebRegistrationSetup = function() {
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

  const defaultMain = {
    Title: "志明 & 春嬌 婚禮邀請",
    SubTitle: "世紀婚禮 | 百年好合",
    DateDesc: "2021年 5月20號 or 民國110年 5月20日 中午12:05分",
    Location: "OOO 婚宴會館 - 龍鳳廳",
    Address: "婚宴場館地址",
    ContractPhone: "婚宴場館聯絡電話",
    Section2SubTitle: "志明 & 春嬌",
    Section2Title1: "誠摯邀請大家",
    Section2Title2: "參與我們人生中重要的一天",
    Section3Title: "婚禮出席統計"
  };

  // main Data
  const [main, setMain] = useState({...defaultMain});

  // photo list
  const [photoList, setPhotoList] = useState([]);

  // 圖片
  const [introImages, setIntroImages] = useState([]);

  // 初始化
  const initData = async () => {
    const formData = new FormData();
    formData.append('SToken', SToken);
    
    try {
      const introImage = await api_query_intro_image(formData);
      const webRegistrationSetup20101501 = await api_query_web_registration_setup_20101501(formData);
      const webRegistrationSetup20101501PhotoList = await api_query_web_registration_setup_20101501_photo_list(formData);
      // console.log(webRegistrationSetup20101501PhotoList);

      if(webRegistrationSetup20101501.data && webRegistrationSetup20101501.data.Msg === 'OK'
        && webRegistrationSetup20101501PhotoList.data && webRegistrationSetup20101501PhotoList.data.Msg === 'OK'
        && introImage.data && introImage.data.Msg === 'OK')
      {  
        const images = JSON.parse(introImage.data.JSONContent);
        const reswebRegistrationSetup20101501 = JSON.parse(webRegistrationSetup20101501.data.JSONContent)[0];
        const reswebRegistrationSetup20101501PhotoList = webRegistrationSetup20101501PhotoList.data.JSONContent !== null && JSON.parse(webRegistrationSetup20101501PhotoList.data.JSONContent);
        
        // main data
        setMain({...main, ...reswebRegistrationSetup20101501});
        
        // photo list
        setPhotoList([...reswebRegistrationSetup20101501PhotoList]);

        // intro image
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

  // 修改欄位
  const handleChangeForm = (e, columnName) => {
    let val = e.target.value;
    let newMain = Object.assign({}, main);
    switch(columnName) {
      // 區塊一
      case 'Title':  // 標題
        newMain.Title = val;
        break;
      case 'SubTitle': // 副標
        newMain.SubTitle = val;
        break;
      case 'DateDesc': // 日期
        newMain.DateDesc = val;
        break;
      case 'Location':  // 婚宴場館
        newMain.Location = val;
        break;
      case 'Address': // 婚宴場館地址
        newMain.Address = val;
        break;
      case 'ContractPhone':  // 婚宴場館聯絡電話
        newMain.ContractPhone = val;
        break;
      // 區塊二
      case 'Section2SubTitle':  // 小標
        newMain.Section2SubTitle = val;
        break;
      case 'Section2Title1': // 標題第一行
        newMain.Section2Title1 = val;
        break;
      case 'Section2Title2': // 標題第二行
        newMain.Section2Title2 = val;
        break;
      // 區塊三
      case 'Section3Title':  // 標題
        newMain.Section3Title = val;
        break;
      default:
        return ;
    }

    setMain(newMain);
  }

  const formColumns = [
    'Title',
    'SubTitle',
    'DateDesc',
    'Location',
    'Address',
    'ContractPhone',
    'Section2SubTitle',
    'Section2Title1',
    'Section2Title2',
    'Section3Title',
    'Head1',
    'Head2'
  ];

  // 儲存設定
  const handleSubmit = () => {
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
      api_save_web_registration_setup_20101501(formData)
        .then(res => {
          // console.log(res);
          const result = res.data;
          if(result.Msg && result.Msg === 'OK') {
            MySwal.fire({
              title: '更新成功',
              icon: 'success'
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

  // file upload
  const upload = (columnName) => {
    document.getElementById(columnName).click();
  }

  // file upload
  const fileUpload = (isHead, columnName) => {
    const msgTitle = "上傳中請稍候";
    const msgOK = "上傳成功";
    const msgError = "上傳失敗";

    //取得該filebox中的檔案資料：
    const files = document.getElementById(columnName).files;

    if (files.length < 0) MySwal.fire(msgError, "", "error");
    //用JQ也可以寫成：
    // var files = $('#'+id)[0].files;

    const TargetFileName = _uuid() + "." + files[0].name.split('.').pop();
    //再來將剛剛取得的檔案資料放進FormData裡
    const fileData = new FormData();
    //files[0].name會回傳包含副檔名的檔案名稱
    //所以要做檔案類型的判斷也可以用file[0].name做

    MySwal.fire({
      title: msgTitle,
      html: <Loading />,
      customClass: {
        popup: 'bg-white',
      },
      showConfirmButton: false,
      showCancelButton: false,
      confirmButtonColor: "#713f94",
    });

    setTimeout(function () {
      fileData.append('SToken', SToken);
      const TableID = (isHead) ? 4874 : 4875;
      fileData.append('TableID', TableID);
      fileData.append('FileName', TargetFileName);
      fileData.append(files[0].name, files[0]);

      //之後送ashx做處理
      $.ajax({
        url: "http://backend.wedding-pass.com/WebService_SRT_T01_FileUpload.ashx",
        type: "post",
        data: fileData,
        contentType: false,
        processData: false,
        async: true,
        success: function (data) {
          if (data.Msg == "OK") {
            if (isHead == false) {
              photoList.push({Photo: TargetFileName})
              setPhotoList([...photoList]);

              const formData = new FormData();
              formColumns.map(item => {
                formData.append(item, main[item]);
              });
              formData.append('SToken', SToken);
              formData.append('Photo', TargetFileName);

              const fileupload_photo = async () => {
                const res = await api_add_web_registration_setup_20101501_photo_list(formData);
                MySwal.fire(msgOK, "", "success");
              }

              fileupload_photo();
            } else {
              let newMain = Object.assign({}, main);
              if(columnName === 'Head1') {
                newMain.Head1 = TargetFileName;
              }
              if(columnName === 'Head2') {
                newMain.Head2 = TargetFileName;
              }

              setMain({...main, ...newMain});
              MySwal.close();
            }
          } else {
            MySwal.fire(msgError, "", "error");
          }
        }
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
              {introImages && introImages[15] && introImages[15].Image && 
              <img src={`http://backend.wedding-pass.com/ERPUpload/4878/${introImages[15].Image}`} className="img-fluid" />}
            </Col>

            <Col xs={11} md={8} className="mx-auto mbr-form page-form">
              <form className="mbr-form pb-4" id="form" method="post">
                <div className="dragArea form-row mt-30">
                  <Col xs={12}>
                    <h4 className="mbr-fonts-style display-5 text-center text-main-color">婚禮報名網站編輯</h4>
                  </Col>
                  <Col xs={12}>
                    <hr />
                  </Col>
                  
                  <Col sm={12} md={12} lg={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">標題</label>
                    <input type="text" placeholder={defaultMain.Title} required="required" className="form-control display-7" value={main.Title} onChange={(e) => handleChangeForm(e, 'Title')} />
                  </Col>

                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">副標</label>
                    <input type="text" placeholder={defaultMain.SubTitle} required="required" className="form-control display-7" value={main.SubTitle} onChange={(e) => handleChangeForm(e, 'SubTitle')} />
                  </Col>

                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">日期</label>
                    <input type="text" placeholder={defaultMain.DateDesc} required="required" className="form-control display-7" value={main.DateDesc} onChange={(e) => handleChangeForm(e, 'DateDesc')} />
                  </Col>

                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">婚宴場館</label>
                    <input type="text" placeholder={defaultMain.Location} required="required" className="form-control display-7" value={main.Location} onChange={(e) => handleChangeForm(e, 'Location')} />
                  </Col>

                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">婚宴場館地址</label>
                    <input type="text" placeholder={defaultMain.Address} required="required" className="form-control display-7" value={main.Address} onChange={(e) => handleChangeForm(e, 'Address')} />
                  </Col>

                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">婚宴場館聯絡電話</label>
                    <input type="text" placeholder={defaultMain.ContractPhone} required="required" className="form-control display-7" value={main.ContractPhone} onChange={(e) => handleChangeForm(e, 'ContractPhone')} />
                  </Col>
                </div>

                <div className="dragArea form-row mt-50">
                  <Col xs={12}>
                    <h4 className="mbr-fonts-style display-5 text-center">區塊二設定</h4>
                  </Col>
                  <Col xs={12}>
                    <hr />
                  </Col>

                  <Col sm={12} md={12} lg={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">小標</label>
                    <input type="text" placeholder={defaultMain.Section2SubTitle} required="required" className="form-control display-7" value={main.Section2SubTitle} onChange={(e) => handleChangeForm(e, 'Section2SubTitle')} />
                  </Col>

                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">標題第一行</label>
                    <input type="text" placeholder={defaultMain.Section2Title1} required="required" className="form-control display-7" value={main.Section2Title1} onChange={(e) => handleChangeForm(e, 'Section2Title1')} />
                  </Col>

                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">標題第二行</label>
                    <input type="text" placeholder={defaultMain.Section2Title2} required="required" className="form-control display-7" value={main.Section2Title2} onChange={(e) => handleChangeForm(e, 'Section2Title2')} />
                  </Col>

                  {main.Head1 &&
                  <Col xs={12} className="form-group mt-10 text-center">
                    <img className="img-fluid rounded" src={`http://backend.wedding-pass.com/ERPUpload/4874/M/${main.Head1}`} />
                  </Col>
                  }

                  <Col xs={12} md={6} lg={3} className="card text-center">
                    <div className="icon-block">
                      <a onClick={() => upload('Head1')}>
                        <span className="mbr-iconfont mbrib-upload"></span>
                      </a>
                    </div>
                    <h5 className="mbr-fonts-style display-7 upload-text-color">上傳左邊新郎或新娘頭像</h5>
                    <input type="file" className="form-control" hidden readOnly={true} id="Head1" accept="image/x-png,image/jpg,image/jpeg" onChange={() => fileUpload(true, 'Head1')} />
                  </Col>

                  {main.Head2 &&
                  <Col xs={12} className="form-group mt-10 text-center mt-50">
                    <img className="img-fluid rounded" src={`http://backend.wedding-pass.com/ERPUpload/4874/M/${main.Head2}`} />
                  </Col>
                  }

                  <Col xs={12} md={6} lg={3} className="card text-center">
                    <div className="icon-block">
                      <a onClick={() => upload('Head2')}>
                        <span className="mbr-iconfont mbrib-upload"></span>
                      </a>
                    </div>
                    <h5 className="mbr-fonts-style display-7 upload-text-color">上傳右邊新郎或新娘頭像</h5>
                    <input type="file" className="form-control" hidden readOnly={true} id="Head2" accept="image/x-png,image/jpg,image/jpeg" onChange={() => fileUpload(true, 'Head2')} />
                  </Col>
                </div>

                <div className="dragArea form-row mt-50">
                  <Col xs={12}>
                    <h4 className="mbr-fonts-style display-5 text-center">區塊三設定</h4>
                  </Col>
                  <Col xs={12}>
                    <hr />
                  </Col>

                  <Col sm={12} md={12} lg={6} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">標題</label>
                    <input type="text" placeholder={defaultMain.Section3Title} required="required" className="form-control display-7" value={main.Section3Title} onChange={(e) => handleChangeForm(e, 'Section3Title')} />
                  </Col>
                </div>
                
                <div className="dragArea form-row mt-50 mb-5">
                  <Col xs={12}>
                    <h4 className="mbr-fonts-style display-5 text-left">婚紗照上傳</h4>
                  </Col>
                  <Col xs={12}>
                    <hr />
                  </Col>

                  {photoList && photoList.length > 0 && photoList.map((item, index) => 
                  <Col xs={12} className="text-center mt-10" key={index}>
                    <img className="img-fluid rounded" src={`http://backend.wedding-pass.com/ERPUpload/4875/M/${item.Photo}`} />
                  </Col>
                  )}

                  <Col xs={12} md={6} lg={3} className="card text-center">
                    <div className="icon-block">
                      <a onClick={() => upload('UploadPhoto')}>
                        <span className="mbr-iconfont mbrib-upload"></span>
                      </a>
                    </div>
                    <h5 className="mbr-fonts-style display-7 upload-text-color">上傳婚紗照</h5>
                    <input type="file" className="form-control" hidden readOnly={true} id="UploadPhoto" accept="image/x-png,image/jpg,image/jpeg" onChange={() => fileUpload(false, 'UploadPhoto')} />
                  </Col>
                </div>
                <a className="btn btn-3d btn-block px-0 text-light mt-5" onClick={() => handleSubmit()}>儲存</a>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
}

export default PageWebRegistrationSetup;
