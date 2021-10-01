import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import ButtonModalClose from '../../components/ButtonModalClose';
import Loading from '../../components/Loading';

import { 
  api_query_postman_progress,
  api_send_email_invite_card,
  api_send_all_email_edm,
  api_query_client_invite_card_image
} from '../../utils/api';

import '../../scss/send.scss';

const MySwal = withReactContent(Swal);

// actions
import { getClientList } from '../../actions/actionClientList';

const SendEmail = (props) => {
  const { SToken } = props;

  const dispatch = useDispatch();

  const introImage = useSelector(state => state.introImages.images);
  const dtList = useSelector(state => state.clientList.dtList);
  const dtColumns = useSelector(state => state.clientList.dtColumns);

  const titleImg = (imgNum) => {
    const bgImage = introImage && introImage.length > imgNum && `url(http://backend.wedding-pass.com/ERPUpload/4878/${introImage[imgNum].Image})`;
    return (bgImage) ? {backgroundImage: bgImage, backgroundSize: 'cover'} : '';
  }

  const [keyColumn1, setKeyColumnName1] = useState({ Name: '賓客關係', DBColumnName: null });
  const [keyColumn2, setKeyColumnName2] = useState({ Name: '賓客姓名', DBColumnName: null });

  const [columns, setColumns] = useState([]);
  const [listCount, setListCount] = useState(0); // list count

  useEffect(() => {
    if(dtList.length > 0 && dtColumns.length > 0) {
      let listCount = 0;
      dtList.map(item => {
        if(!!item.EDMSendDateTime) {
          listCount++;
        }
      });

      setListCount(listCount);

      let newColumns = [...dtColumns];

      newColumns.map(item => {
        if(item.Name === keyColumn1.Name) setKeyColumnName1({...keyColumn1, DBColumnName: item.DBColumnName});
        if(item.Name === keyColumn2.Name) setKeyColumnName2({...keyColumn2, DBColumnName: item.DBColumnName});
      });

      setColumns([...columns, ...newColumns]);
    }
  }, [dtList, dtColumns]);

  // 初始化
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

    UpdateProgress();
    updateInterval = setInterval(UpdateProgress, 3000);

    MySwal.close();
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

      const triggerSend = async () => {
        const sendEmailInviteCard = await api_send_email_invite_card(formData);

        if(sendEmailInviteCard.data && sendEmailInviteCard.data.Msg === 'OK') {
          formData = new FormData();
          formData.append('SToken', SToken);

          // 取得 Client List, Client columns
          dispatch(getClientList(formData, (res, err) => {
            if(err) {
              MySwal.fire('發送失敗', '請洽客服人員', 'error');
            } else {
              MySwal.fire("發送成功", "", "success");
            }
          }));
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
      MySwal.close();
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

  // render
  const renderEmailList = (dtlist) => {
    let lists = [];

    if(dtlist && dtlist.length > 0) {
      lists = dtlist.map((item, index) => {
        let state = isBatchProcess 
          ? <small>正在排隊等候寄送</small>
          : null;

        let sendStatus = item.EDMSendDateTime 
          ? <small>{item.EDMSendDateTime.substr(0,19).replace("T", " ")} 已寄送</small>
          : state;

        let sendBtn = item.EDMSendDateTime
          ? <button className="btn sendButtons-retry btn-block text-light btn-padding" onClick={() => sendEmail(item)}>重新寄送</button>
          : <button className="btn sendButtons btn-block text-light btn-padding" onClick={() => sendEmail(item)}>寄送 Email電子邀請函</button>
        let sendButtons = isBatchProcess 
          ? null 
          : (<>
              {sendBtn}&nbsp;
              <button className="btn sendButtons btn-block text-light btn-padding ml-1" onClick={() => viewEmail(item)}>線上檢視</button>
            </>);
        
        return (
          <tr key={index}>
            <td className="text-center">{item[keyColumn2.DBColumnName]}</td>
            <td className="text-center">{item[keyColumn1.DBColumnName]}</td>
            <td className="text-center">{sendStatus}</td>
            <td className="text-center">
              {sendButtons}
            </td>
          </tr>
        );
      });
    }

    return lists;
  }

  return (
    <section className="features1 cid-rX4jzrRcmX bg-color-pink">
      <section className="form cid-rLQ7009Pot p-0 bg-color-transparent">
        <div className="fixed-title-img" style={titleImg(10)}></div>
        <Container className="bg-transparent">
          <Row className="bg-transparent">
            <Col xs={12}>
              <div className="dragArea form-row">
                <Col xs={12}>
                  <hr />
                </Col>
                
                {dtList.length > 0 &&
                <Col xs={12} className="mx-auto">
                  <table className="table rwdtable bg-color-transparent table-horizontal table-send">
                    <thead>
                      <tr>
                        <th className="head-item mbr-fonts-style display-7 text-center bg-color-transparent">賓客姓名</th>
                        <th className="head-item mbr-fonts-style display-7 text-center bg-color-transparent">賓客關係</th>
                        <th className="head-item mbr-fonts-style display-7 text-center bg-color-transparent">發送時間 / 寄送狀態</th>
                        <th className="head-item mbr-fonts-style display-7 text-center bg-color-transparent">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderEmailList(dtList)}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3">
                          <span>已發送：</span>
                          <span className="mr-5">{listCount}</span>
                          <span>全部賓客清單：</span>
                          <span>{dtList.length}</span>
                        </td>
                        <td>
                          <a className="btn btn-3d btn-block px-0 text-light" onClick={() => sendEmailAll()}>批次全部發送</a>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </Col>
                }
              </div>
            </Col>
          </Row>
        </Container>

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
      </section>
    </section>
  );
}

export default SendEmail;
