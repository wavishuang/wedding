import React, { useState, useEffect, Fragment } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

import ButtonModalClose from '../components/ButtonModalClose';
import HeaderDiv from '../components/HeaderDiv';
import ButtonSendInvitation from '../components/ButtonSendInvitation';
import Loading from '../components/Loading';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { 
  api_check_token,
  api_query_client_list,
  api_query_intro_image,
  api_query_postman_progress,
  api_send_email_invite_card,
  api_send_all_email_edm,
  api_query_client_invite_card_image
} from '../utils/api';

import '../scss/base.scss';
import '../scss/send.scss';

const MySwal = withReactContent(Swal);

const PageSend = function() {
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
  // Client List(dtColumns, dtList)
  const [columns, setColumns] = useState([]); // dtColumns
  const [list, setList] = useState([]); // dtList
  const [listCount, setListCount] = useState(0); // list count

  // 圖片
  const [introImages, setIntroImages] = useState([]);

  // 初始化
  const initData = async () => {
    const formData = new FormData();
    formData.append('SToken', SToken);
    
    try {
      const clientList = await api_query_client_list(formData);
      const introImage = await api_query_intro_image(formData);

      if(clientList.data && clientList.data.Msg === 'OK'
        && introImage.data && introImage.data.Msg === 'OK') 
      {
        // intro image
        const images = JSON.parse(introImage.data.JSONContent);
        setIntroImages({...images});

        // client list
        const {dtColumns, dtList} = clientList.data;
        setList([...dtList]);

        // setInterval: UpdateProgress
        UpdateProgress();
        updateInterval = setInterval(UpdateProgress, 3000);

        // 初始化 頁面資料
        initSend(dtList, dtColumns);

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

  // Update Progress
  const [isBatchProcess, setIsBatchProcess] = useState(true);
  let updateInterval;

  const UpdateProgress = async () => {
    const formData = new FormData();
    formData.append('SToken', SToken);

    const postManProgress = await api_query_postman_progress(formData);
    if(postManProgress.data && postManProgress.data.Msg === 'OK') {
      const resPostManProgress = postManProgress.data.Count;
      if (resPostManProgress > 0) {
        setIsBatchProcess(true);
      }
      else {
        setIsBatchProcess(false);
        clearInterval(updateInterval);
      }
    }
  }

  // 處理過的資料
  const [keyColumn1, setKeyColumnName1] = useState({ Name: '賓客關係', DBColumnName: null });
  const [keyColumn2, setKeyColumnName2] = useState({ Name: '賓客姓名', DBColumnName: null });

  const initSend = (dtList, dtColumns) => {
    let listCount = 0;
    dtList.map(item => {
      if(!!item.EDMSendDateTime) {
        listCount++;
      }
    })

    setListCount(listCount);

    let newColumns = [...dtColumns];

    newColumns.map(item => {
      if(item.Name === keyColumn1.Name) setKeyColumnName1({...keyColumn1, DBColumnName: item.DBColumnName});
      if(item.Name === keyColumn2.Name) setKeyColumnName2({...keyColumn2, DBColumnName: item.DBColumnName});
    });

    setColumns([...columns, ...newColumns]);
  }

  // Event
  // 重新發送 & 寄送 Email電子邀請函
  const sendEmail = (data) => {
    MySwal.fire({
      title: "發送中請稍候",
      html: <Loading />,
      customClass: {
        popup: 'bg-white',
      },
      showConfirmButton: false,
      showCancelButton: false,
      confirmButtonColor: "#713f94",
    });
    
    setTimeout(() => {
      let formData = new FormData();
      formData.append('SToken', SToken);
      formData.append('ClientID', data.ID);

      async function triggerSend() {
        const sendEmailInviteCard = await api_send_email_invite_card(formData);

        if(sendEmailInviteCard.data && sendEmailInviteCard.data.Msg === 'OK') {
          formData = new FormData();
          formData.append('SToken', SToken);

          const clientList = await api_query_client_list(formData);
          if(clientList.data && clientList.data.Msg === 'OK') {
            const {dtColumns, dtList} = clientList.data;
            setList([...dtList]);

            let listCount = 0;
            dtList.map(item => {
              if(!!item.EDMSendDateTime) {
                listCount++;
              }
            })

            setListCount(listCount);
          }

          MySwal.fire("發送成功", "", "success");
        }
      }

      triggerSend();
    }, 500);
    console.log('send email', data);
  }

  // 批次發送全部
  const sendEmailAll = () => {
    MySwal.fire({
      title: "準備中請稍候",
      html: <Loading />,
      customClass: {
        popup: 'bg-white',
      },
      showConfirmButton: false,
      showCancelButton: false,
      confirmButtonColor: "#713f94",
    });

    setTimeout(function () {
      const formData = new FormData();
      formData.append('SToken', SToken);

      api_send_all_email_edm(formData)
        .then(res => {
          const result = res.data;
          if(result.Msg === 'OK') {
            UpdateProgress();
            updateInterval = setInterval(UpdateProgress, 3000);
            MySwal.fire("後台正在發送中", "", "success");
          }
        })
        .catch(err => {
          MySwal.fire('發送失敗', '', 'error');
        });
    }, 500);
  }

  // 線上檢視
  const viewEmail = (data) => {
    MySwal.fire({
      title: "準備中請稍候",
      html: <Loading />,
      customClass: {
        popup: 'bg-white',
      },
      showConfirmButton: false,
      showCancelButton: false,
      confirmButtonColor: "#713f94",
    });

    setActiveClient({...activeClient, ...data})
    setActiveInviteCard(null);
    const formData = new FormData();
    formData.append('SToken', SToken);
    formData.append('ClientID', data.ID);
    api_query_client_invite_card_image(formData)
      .then(res => {
        const result = res.data;
        if(result.Msg === 'OK') {
          setActiveInviteCard(result.File);
          setModalShow(true);
          MySwal.close();
        }
      })
      .catch(err => {
        MySwal.fire('無法檢視', err, 'error');
      });
  }

  const renderEmailList = (list) => {
    if(list && list.length > 0) {
      const lists = list.map((item, index) => {
        let state = isBatchProcess 
          ? <small>正在排隊等候寄送</small>
          : null;

        let sendStatus = item.EDMSendDateTime 
          ? <small>{item.EDMSendDateTime.substr(0,19).replace("T", " ")}已寄送</small>
          : state;

        let sendBtn = item.EDMSendDateTime
          ? <button className="btn sendButtons-retry btn-block px-0 text-light btn-padding" onClick={() => sendEmail(item)}>重新寄送</button>
          : <button className="btn sendButtons btn-block px-0 text-light btn-padding" onClick={() => sendEmail(item)}>寄送 Email電子邀請函</button>
        let sendButtons = isBatchProcess 
          ? null 
          : (<>
              <Col xs={8} md={6} className="mb-15">
                {sendBtn}
              </Col>
              <Col xs={4} md={6} className="mb-15">
                <button className="btn sendButtons btn-block px-0 text-light btn-padding" onClick={() => viewEmail(item)}>線上檢視</button>
              </Col>
            </>)
        
        return (
          <Row className={`card-margin card-border-radius ${isBatchProcess ? 'card-disabled-bg-color' : 'card-bg-color'}`} key={item.ID}>
            <Col xs={12} className="mt-15 text-gray-333">
              <h2 className="mbr-fonts-style mbr-black pb-3 display-7">
                <span className="mr-4">{index + 1}. </span>
                <span>{item[keyColumn2.DBColumnName]}</span> /
                <small>{item[keyColumn1.DBColumnName]}</small>
              </h2>
            </Col>
            <Col xs={12} className="mb-15 text-right">
              {sendStatus}
            </Col>
            {sendButtons}
          </Row>
        );
      });

      return lists;
    }

    return '';
  }

  const [modalShow, setModalShow] = useState(false);
  const [activeClient, setActiveClient] = useState(null);
  const [activeInviteCard, setActiveInviteCard] = useState(null);

  // 複製連結
  const copyLink = () => {
    let textArea = document.createElement("textarea");
    textArea.value = activeInviteCard;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      let successful = document.execCommand('copy');
      let msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg)
      console.log('link: ', activeInviteCard);
    } catch (err) {
      console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
    MySwal.fire('已複製', '', 'success');
  }

  return (
    <Fragment>
      <HeaderDiv />
      <ButtonSendInvitation isBatchProcess={isBatchProcess} sendAll={sendEmailAll} isSticker={false} />
      
      <section className="form cid-rLQ7009Pot pt-5">
        <Container>
          <Row>
            <Col xs={{ span: 10, offset: 1 }} md={{ span: 5, offset: 4}} className="form-group">
              {introImages && introImages[7] && introImages[7].Image && 
              <img src={`http://backend.wedding-pass.com/ERPUpload/4878/${introImages[7].Image}`} className="img-fluid" />}
            </Col>
          
            <Col xs={11} md={8} className="mx-auto mbr-form bg-main-color border-radius-15">
              <div className="dragArea form-row mt-30">
                <Col xs={12}>
                  <h4 className="mbr-fonts-style display-5 text-center text-main-color">Email 電子邀請函發送</h4>
                </Col>
                <Col xs={12}>
                  <hr />
                </Col>
                <Col xs={12}>
                  <Row className="card-bg-color card-margin card-border-radius">
                    <Col xs={12} className="card-bg-color text-center mt-15">
                      <h2 className="mbr-fonts-style pb-3 display-7 ">
                        <span>已發送</span> /
                        <span>全部賓客清單</span>
                      </h2>
                      <h2 className="mbr-fonts-style pb-3 text-main-color font-38">
                        <span>{listCount}</span> / <span>{list.length}</span>
                      </h2>
                    </Col>
                  </Row>
                </Col>

                <Col xs={12}>
                  {renderEmailList(list)}
                </Col>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header>
          {activeClient && 
          <h5 className="modal-title mbr-fonts-style display-5">{activeClient[keyColumn2.DBColumnName]} - {activeClient[keyColumn1.DBColumnName]}</h5>
          }
          <ButtonModalClose handleModalClose={() => setModalShow(false)} />
        </Modal.Header>
        <Modal.Body>
          <form className="mbr-form form-with-styler">
            <div className="text-center">
              {activeInviteCard && 
              <Col xs={{ span: 10, offset: 1 }} className="form-group">  
                <img src={activeInviteCard} className="img-fluid" />
              </Col>
              }
              <Col xs={12} className="form-group text-center">
                <button type="button" className="btn sendButtons-retry btn-block px-0 text-light card-padding" onClick={copyLink}>複製連結</button>
              </Col>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
}

export default PageSend;
