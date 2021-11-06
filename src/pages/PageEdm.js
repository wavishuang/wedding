import React, { Fragment, useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Loading from '../components/Loading';
import PopImg from '../components/PopImg';

import UploadProcessing from '../components/UploadProcessing';

import { _uuid } from '../utils/tools';
import { 
  api_check_token,
  api_query_order_info,
  api_query_invite_card_setup,
  api_update_active_invite_card_setup
} from '../utils/api';

import '../scss/base.scss';
import '../scss/edm.scss';
import '../scss/sswal.scss';

import BrandImg from '../images/logo_b-2x.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const MySwal = withReactContent(Swal);

const PageEdm = function() {
  const LoginInfo = (sessionStorage && sessionStorage.data) ? JSON.parse(sessionStorage.data) : null;
  const SToken = LoginInfo ? LoginInfo.Token : null;
  if(!LoginInfo || !SToken) location.href = 'index.html';
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
            location.href = 'index.html';
          }
        })
        .catch(err => {
          location.href = 'index.html';
        });
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
  let stepList = [false, false, false, false, false, true, false];
  const [activeStep, setActiveStep] = useState(stepList);

  // 初始化
  const [orderInfo, setOrderInfo] = useState({});
  const [inviteCard, setInviteCard] = useState([]);

  const initData = async () => {
    const formData = new FormData();
    formData.append('SToken', SToken);

    try {
      const orderInfo = await api_query_order_info(formData);
      const inviteCardSetup = await api_query_invite_card_setup(formData);

      if(orderInfo.data && orderInfo.data.Msg === 'OK' 
        && inviteCardSetup.data && inviteCardSetup.data.Msg === 'OK') {
        const resOrderInfo = JSON.parse(orderInfo.data.JSONContent)[0];
        const resInviteCardSetup = inviteCardSetup.data.InviteCard;

        initEDM(resOrderInfo);

        setOrderInfo({...resOrderInfo});
        setInviteCard([...resInviteCardSetup]);
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
  const [isUpload, setIsUpload] = useState(0);
  const [ident, setIdent] = useState('');

  const initEDM = (orderInfo) => {
    const isUpload = (orderInfo.UserUpload_Photo !== null) ? 1 : 0;
    setIsUpload(isUpload);
    setIdent(orderInfo.Ident)
    MySwal.close();
  }

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const handleNext = () => {
    if((index + 1) >= inviteCard.length) {
      return ;
    }
    
    setIndex(index + 1);
  }

  const handlePrev = () => {
    if(index <= 0) {
      return ;
    }
    setIndex(index - 1);
  }

  // 上一頁
  const handleGoBack = () => {
    location.href = 'location.html';
  }

  // 下一步
  const handleGoNext = () => {
    const ActiveID = inviteCard[index].ID;
    const theme = linearBg();

    // 處理中
    MySwal.fire({
      html: <PopImg theme={theme} type="loading" />,
      customClass: {
        popup: 'bg-img loading',
      },
      showConfirmButton: false,
      showCancelButton: false,
    });

    // Fake
    setTimeout(() => {
      location.href = "senddemo.html";
    }, 2000);
    
    /*
    setTimeout(function(){
      const sendActiveInviteCardSetup = async () => {
        const formData = new FormData();
        formData.append('SToken', SToken);
        formData.append('InviteCardSetupID', ActiveID);
        const res = await api_update_active_invite_card_setup(formData);

        if(res.data && res.data.Msg === 'OK') {
          location.href = "senddemo.html";
        } else {
          MySwal.fire("Error", data.Msg, "error");
        }
      }

      sendActiveInviteCardSetup();
    }, 500);
    */
  }

  // file uploaod 上傳婚紗照
  const [fakeStep, setFakeStep] = useState(6);

  const UploadVideo = (columnName) => {
    // document.getElementById(columnName).click();

    // fake 上傳婚紗照
    const theme = linearBg();

    MySwal.fire({
      html: <PopImg theme={theme} type="upload-wedding-photo" />,
      customClass: {
        popup: 'bg-img upload-wedding-photo',
      },
      showConfirmButton: false,
      showCancelButton: false,
    });

    setTimeout(() => {
      MySwal.close();
      setFakeStep(7);
    }, 2000);
  }

  // file upload
  const fileUpload = (columnName) => {
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

    const theme = linearBg();

    MySwal.fire({
      //title: "上傳中請稍候",
      html: <UploadProcessing theme={theme} />,
      customClass: {
        popup: 'bg-img',
      },
      showConfirmButton: false,
      showCancelButton: false,
    });

    setTimeout(function () {
      fileData.append('SToken', SToken);
      fileData.append(files[0].name, files[0]);

      //之後送ashx做處理
      $.ajax({
        url: "http://backend.wedding-pass.com/WebService_SF_WEDDING_PASS_UploadPhotoToCreateInviteCard.ashx",
        type: "post",
        data: fileData,
        contentType: false,
        processData: false,
        async: true,
        success: function (data) {
          if (data.Msg == "OK") {
            setIsUpload(isUpload + 1);
            MySwal.close();
          } else {
            MySwal.fire(msgError, "", "error");
          }
        }
      });
    }, 500);
  }

  return (
    <Fragment>
      <section className="wrapper-s vh-100 bg-pic-edm">

        {/** 漸層底色 */}
        <div className={`bg-linear ${'bg-'+ linearBg()}`}></div>

        <div className="main-brand">
          <div className="img-cover">
            <img src={BrandImg} title="WEDDING PASS" alt="WEDDING PASS" />
          </div>
        </div>

        <Container className="pt-157">
          <div className="media-container-row">
            <Col xs={12} md={8} className="title text-center">
              <h3 className="mbr-section-subtitle step-title">
                {orderInfo.LeadingStatus === 9 ?
                '選擇您的電子喜帖' :
                'Step 6. 產生您的電子喜帖'
                }
              </h3>

              <Carousel indicators={false} interval={null} controls={false} activeIndex={index} onSelect={handleSelect} className="carousel slide">
                {inviteCard.map(item => (
                  <Carousel.Item className="carousel-item" key={item.ID}>
                    <div className="item">
                      {isUpload ? 
                        <div className="polaroid" style={{backgroundImage: `url(${item.Img})`}}>
                          <img src={"../images/phone-portrait.png"} className="phone-bg" />
                        </div> :
                        <div className="polaroid" style={{backgroundImage: `url("http://backend.wedding-pass.com/WeddingPass/inviteCard_Order/"+ ${ident} +"/"+ ${item.ID} +"/_preview.jpg")`}}>
                          <img src={"../images/phone-portrait.png"} className="phone-bg" />
                        </div>
                      }
                    </div>
                  </Carousel.Item>
                ))}

                <a className="carousel-control carousel-control-prev" onClick={(e) => handlePrev()}>
                  <FontAwesomeIcon icon={faChevronLeft} size="lg" className="text-white" />
                </a>
                  
                <a className="carousel-control carousel-control-next" onClick={(e) => handleNext()}>
                  <FontAwesomeIcon icon={faChevronRight} size="lg" className="text-white" />
                </a>
              </Carousel>
            </Col>
          </div>
        </Container>

        <div className="w-100 bottom-nav">
          <div className="step-btns">
            <div className="w-btn d-flex justify-content-center mt-05">
              <button className={`btn btn-3d btn-block px-0 ${'display-'+linearBg()}`} onClick={() => UploadVideo('upload_img')}>上傳婚紗照</button>
              <input hidden disabled={false} name="file" type="file" id="upload_img" accept="image/png, image/jpeg" onChange={() => fileUpload('upload_img')} />
            </div>

            {fakeStep > 6 &&
            <div className="w-btn d-flex justify-content-center mt-05">
              <button type="button" className={`btn btn-3d btn-block ${'display-'+linearBg()}`} tabIndex="-1" onClick={() => handleGoNext()}>下一步</button>
            </div>
            }

            {/*orderInfo.LeadingStatus === 9 ?
              <div className="w-btn d-flex justify-content-center mt-05">
                {isUpload !== 0 &&
                <>
                  <button type="button" className={`btn btn-3d btn-block ${'display-'+linearBg()}`} tabIndex="-1" onClick={() => handleGoBack()}>上ㄧ步</button>
                  <button type="button" className={`btn btn-3d btn-block ${'display-'+linearBg()}`} tabIndex="-1" onClick={() => handleGoNext()}>下一步</button>
                </>
                }
              </div> :
              <div className="w-btn d-flex justify-content-center mt-05">
                {isUpload !== 0 &&
                  <button type="button" className={`btn btn-3d btn-block ${'display-'+linearBg()}`} tabIndex="-1" onClick={() => handleGoNext()}>下一步</button>
                }
              </div>
              */}
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
    </Fragment>
  );
}

export default PageEdm;
