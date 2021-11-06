import React, { Fragment, useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import ButtonModalClose from '../components/ButtonModalClose';
import Loading from '../components/Loading';
import PopImg from '../components/PopImg';
import PopBgIcon from '../components/PopBgIcon';
import PopStepImg from '../components/PopStepImg';

import { _uuid } from '../utils/tools';
import { 
  api_check_token,
  api_query_order_info,
  api_send_email_demo_edm,
  api_send_mms_demo_edm
} from '../utils/api';

import '../scss/base.scss';
import '../scss/senddemo.scss';
import '../scss/sswal.scss';
import '../scss/smodal.scss';

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

  const handleGroomEmail = (e) => {
    const val = e.target.value;
    setGroomEmail(val);
  }

  const handleBrideEmail = (e) => {
    const val = e.target.value;
    setBrideEmail(val);
  }

  // MMS Modal
  const [modalMMSShow, setMMSModalShow] = useState(false);

  // send MMS(發送中請稍候)
  const sendMMSSample = () => {
    console.log('send mms');
    const theme = linearBg();

    setMMSModalShow(false);

    // 發送中，請稍候
    MySwal.fire({
      html: <PopImg theme={theme} type="send-loading" />,
      customClass: {
        popup: 'bg-img send-loading',
      },
      showConfirmButton: false,
      showCancelButton: false,
    });

    setTimeout(() => {
      MySwal.fire({
        html: <PopBgIcon theme={theme} type="send-mms-success" icon="error" />,
        customClass: {
          popup: `bg-img mms-success bg-${linearBg()}`,
        },
        showCancelButton: false,
        confirmButtonText: "下一步",
        closeOnConfirm: true
      }).then((result) => {
        if (result.isConfirmed) {
          setFakeSendMMS(false);
        }
      });
    }, 2000);

    /*
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
            html: <PopBgIcon theme={theme} type="send-mms-success" icon="success" />,
            customClass: {
              popup: `bg-img mms-success bg-${linearBg()}`,
            },
            showCancelButton: false,
            confirmButtonText: "下一步",
            closeOnConfirm: true
          }).then((result) => {
            if (result.isConfirmed) {
              MySwal.close();
              setMailModalShow(true);
            }
          });
        } else {
          MySwal.fire({
            html: <PopBgIcon theme={theme} type="send-mms-error" icon="error" />,
            customClass: {
              popup: `bg-img mms-error bg-${linearBg()}`,
            },
            showCancelButton: false,
            confirmButtonText: "確認",
            closeOnConfirm: true
          }).then((result) => {
            if (result.isConfirmed) {
              console.log('error confirm');
            }
          });
        }
      }

      sendmms();
    }, 500);
    */
  }

  // Mail Modal
  const [modalMailShow, setMailModalShow] = useState(false);

  // send Mail
  const sendMailSample = () => {
    console.log('send email');
    setMailModalShow(false);

    const theme = linearBg();
    
    // 發送中，請稍候
    MySwal.fire({
      html: <PopImg theme={theme} type="send-loading" />,
      customClass: {
        popup: 'bg-img send-loading',
      },
      showConfirmButton: false,
      showCancelButton: false,
    });

    setTimeout(() => {
      MySwal.fire({
        html: <PopBgIcon theme={theme} type="send-mail-success" icon="success" />,
        customClass: {
          popup: `bg-img mail-success bg-${linearBg()}`,
        },
        showCancelButton: false,
        confirmButtonText: "下一步",
        closeOnConfirm: true
      }).then((result) => {
        if (result.isConfirmed) {
          // 下一步 WEDDING-PASS 婚禮報到：婚禮結束後 賓客感謝函發送與賓客資料統計
          goNextAnalyze();
        }
      });
    }, 2000);

    /*
    setTimeout(() => {
      const formData = new FormData();
      formData.append('SToken', SToken);
      formData.append('MobilePhone', MobilePhone);
      formData.append('GroomEmail', groomEmail);
      formData.append('BrideEmail', brideEmail);

      try {
        const sendemail = async () => {
          const res = await api_send_email_demo_edm(formData);
  
          if(res.data && res.data.Msg === 'OK') {
            MySwal.fire({
              html: <PopBgIcon theme={theme} type="send-mail-success" icon="success" />,
              customClass: {
                popup: `bg-img mail-success bg-${linearBg()}`,
              },
              showCancelButton: false,
              confirmButtonText: "下一步",
              closeOnConfirm: true
            }).then((result) => {
              if (result.isConfirmed) {
                MySwal.fire({
                  html: <PopStepImg theme={theme} type="line" />,
                  customClass: {
                    popup: `bg-img wedding-regist-next bg-${linearBg()}`,
                  },
                  showCancelButton: false,
                  confirmButtonText: "下一頁",
                  closeOnConfirm: true
                }).then((result) => {
                  if (result.isConfirmed) {
                    MySwal.fire({
                      html: <PopStepImg theme={theme} type="pic4" />,
                      customClass: {
                        popup: `bg-img wedding-regist-next2 bg-${linearBg()}`,
                      },
                      showCancelButton: false,
                      confirmButtonText: "開始使用 WEDDING-PASS婚禮報到",
                      closeOnConfirm: true
                    }).then((result) => {
                      if (result.isConfirmed) {
                        MySwal.fire({
                          html: <SendCongratulations theme={theme} />,
                          customClass: {
                            popup: `bg-img wedding-regist-next bg-${linearBg()}`,
                          },
                          showCancelButton: false,
                          confirmButtonText: "下一頁",
                          closeOnConfirm: true
                        }).then((result) => {
                          if (result.isConfirmed) {
                            console.log('SendCongratulations')
                            //MySwal.close();
                            //setMailModalShow(true);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {
            MySwal.fire({
              html: <PopBgIcon theme={theme} type="send-mail-error" icon="error" />,
              customClass: {
                popup: `bg-img mail-error bg-${linearBg()}`,
              },
              showCancelButton: false,
              confirmButtonText: "確認",
              closeOnConfirm: true
            }).then((result) => {
              if (result.isConfirmed) {
                console.log('error confirm');
              }
            });
          }
          console.log(res);
        }
  
        sendemail();
      } catch(e) {
        console.log(e);
      }
      
    }, 500);
    */
  }

  // 下一步 WEDDING-PASS 婚禮報到：婚禮結束後 賓客感謝函發送與賓客資料統計
  const goNextAnalyze = () => {
    const theme = linearBg();
    MySwal.fire({
      html: <PopStepImg theme={theme} type="line" />,
      customClass: {
        popup: `bg-img wedding-regist-next bg-${linearBg()}`,
      },
      showCancelButton: false,
      confirmButtonText: "下一頁",
      closeOnConfirm: true
    }).then((result) => {
      if (result.isConfirmed) {
        // 下一步 WEDDING-PASS 婚禮報到：希望可以讓您們在婚禮籌備上 多一點幸福，少一點煩惱
        MySwal.fire({
          html: <PopStepImg theme={theme} type="pic4" />,
          customClass: {
            popup: `bg-img wedding-regist-next2 bg-${linearBg()}`,
          },
          showCancelButton: false,
          confirmButtonText: "開始使用 WEDDING-PASS婚禮報到",
          closeOnConfirm: true
        }).then((result) => {
          if (result.isConfirmed) {
            MySwal.fire({
              html: <PopStepImg theme={theme} type="congratulations" />,
              customClass: {
                popup: `bg-img congratulations bg-${linearBg()}`,
              },
              showCancelButton: false,
              confirmButtonText: "下一頁",
              closeOnConfirm: true
            }).then((result) => {
              if (result.isConfirmed) {
                MySwal.fire({
                  html: <PopStepImg theme={theme} type="provide" />,
                  customClass: {
                    popup: `bg-img provide bg-${linearBg()}`,
                  },
                  showCancelButton: false,
                  confirmButtonText: "下一頁",
                  closeOnConfirm: true
                }).then((result) => {
                  if (result.isConfirmed) {
                    MySwal.fire({
                      html: <PopStepImg theme={theme} type="sweet" />,
                      customClass: {
                        popup: `bg-img sweet bg-${linearBg()}`,
                      },
                      showCancelButton: false,
                      confirmButtonText: "下一頁",
                      closeOnConfirm: true
                    }).then((result) => {
                      if (result.isConfirmed) {
                      }
                    });
                  }
                });
              }
            });
          }
        });
        /*
        MySwal.fire({
          html: <PopStepImg theme={theme} type="line4" />,
          customClass: {
            popup: `bg-img wedding-regist-next2 bg-${linearBg()}`,
          },
          showCancelButton: false,
          confirmButtonText: "開始使用 WEDDING-PASS婚禮報到",
          closeOnConfirm: true
        }).then((result) => {
          if (result.isConfirmed) {
            // 下一步 WEDDING-PASS 婚禮報到：
            MySwal.fire({
              html: <SendCongratulations theme={theme} />,
              customClass: {
                popup: `bg-img wedding-regist-next bg-${linearBg()}`,
              },
              showCancelButton: false,
              confirmButtonText: "下一頁",
              closeOnConfirm: true
            }).then((result) => {
              if (result.isConfirmed) {
                console.log('SendCongratulations')
                //MySwal.close();
                //setMailModalShow(true);
              }
            });
          }
        });
        */
      }
    });
  }

  const [fakeSendMMS, setFakeSendMMS] = useState(true);

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
            {fakeSendMMS 
            ? <a className={`btn btn-3d btn-block px-0 text-light  ${'display-'+linearBg()}`} onClick={() => setMMSModalShow(true)}>測試發送邀請函</a>
            : <a className={`btn btn-3d btn-block px-0 text-light  ${'display-'+linearBg()}`} onClick={() => setMailModalShow(true)}>測試發送邀請函</a>
            }
              {/*orderInfo.LeadingStatus === 6 
                ? <a className={`btn btn-3d btn-block px-0 text-light  ${'display-'+linearBg()}`} onClick={() => setMMSModalShow(true)}>測試發送邀請函</a>
                : <a className={`btn btn-3d btn-block px-0 text-light  ${'display-'+linearBg()}`} onClick={() => setMailModalShow(true)}>測試發送邀請函</a>
              */}
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

      <Modal show={modalMailShow} className={`modal-mail-test ${'modal-'+linearBg()}`} onHide={() => setMailModalShow(false)} centered>
        <Modal.Header className="d-flex flex-column align-items-center">
          <div className="header-bg">
            <img src="../images/modal/picture_email_test.png" alt="測試：Email 電子邀請函發送" title="測試：Email 電子邀請函發送" />
          </div>
          {/*<Modal.Title className="mbr-fonts-style display-5">測試：Email 電子邀請函發送</Modal.Title>*/}
          <ButtonModalClose handleModalClose={() => setMailModalShow(false)} />
        </Modal.Header>
        <Modal.Body>
          <h2 className="title-text text-center">測試:Email電子邀請函發送</h2>
          <form className="mbr-form form-with-styler d-flex flex-column justify-content-space-between">
            <div className="form-group">
              <label className="label-text">新娘Mail</label>
              <input type="email" placeholder="新娘Mail" className="form-control display-7" value={groomEmail} disabled={orderInfo.LeadingStatus === 9} onChange={(e) => handleGroomEmail(e)} />
            </div>
            <div className="form-group mt-43">
              <label className="label-text">新郎Mail</label>
              <input type="email" placeholder="新郎Mail" required="required" className="form-control display-7" value={brideEmail} disabled={orderInfo.LeadingStatus === 9} onChange={(e) => handleBrideEmail(e)} />
            </div>
            <div className="text-center w-100">
              <button type="button" onClick={() => sendMailSample()} className="btn btn-3d btn-block">測試發送</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
}

export default PageSendDemo;
