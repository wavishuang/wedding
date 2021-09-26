import React, { useState, useEffect, Fragment } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
//import Modal from 'react-bootstrap/Modal';
// import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

//import ButtonModalClose from '../components/ButtonModalClose';
import HeaderDiv from '../components/HeaderDiv';
import Loading from '../components/Loading';
// import ButtonPageClose from '../components/ButtonPageClose';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { 
  api_check_token,
  api_query_client_list,
  api_query_client_column_setup,
  api_query_intro_image,
  api_event_update_client,
  api_event_insert_client
} from '../utils/api';

import '../scss/base.scss';
import '../scss/listmgr.scss';

const MySwal = withReactContent(Swal);

const PageListMgr = function() {
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

  // Client Column Setup
  const [clientColumnSetup, setClientColumnSetup] = useState()

  // 圖片
  const [introImages, setIntroImages] = useState([]);

  // 初始化
  const initData = async () => {
    const formData = new FormData();
    formData.append('SToken', SToken);
    
    try {
      const clientList = await api_query_client_list(formData);
      const clientColumnSetup = await api_query_client_column_setup(formData);
      const introImage = await api_query_intro_image(formData);

      if(clientList.data && clientList.data.Msg === 'OK'
        && clientColumnSetup.data && clientColumnSetup.data.Msg === 'OK'
        && introImage.data && introImage.data.Msg === 'OK')
      {
        // intro image
        const images = JSON.parse(introImage.data.JSONContent);
        setIntroImages({...images});

        // client list
        const {dtColumns, dtList} = clientList.data;
        //setColumns([...dtColumns]);
        setList([...dtList]);

        // client column setup
        const resClientColumnSetup = JSON.parse(clientColumnSetup.data.JSONContent);
        setClientColumnSetup([...resClientColumnSetup]);

        // 初始化 頁面資料
        initListMgr(dtColumns, resClientColumnSetup);

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
  const [keyColumn1, setKeyColumnName1] = useState({ Name: '賓客關係', DBColumnName: null });
  const [keyColumn2, setKeyColumnName2] = useState({ Name: '賓客姓名', DBColumnName: null });

  const initListMgr = (dtColumns, clientColumnSetup) => {
    let newColumns = [...dtColumns];

    newColumns.map(item => {
      if(item.Name === keyColumn1.Name) setKeyColumnName1({...keyColumn1, DBColumnName: item.DBColumnName});
      if(item.Name === keyColumn2.Name) setKeyColumnName2({...keyColumn2, DBColumnName: item.DBColumnName});
    
      let wpObj = clientColumnSetup.find(subItem => subItem.Name === item.Name);
      item._wp = wpObj;

      let opts = wpObj.Option;
      if (opts == null || opts.length <= 0) {
        item._rt_opts = null;
      } else {
        opts = opts.split(",");
        item._rt_opts = opts.map(optItem => {
          return { text: optItem, value: optItem };
        });
      }
    });

    setColumns([...columns, ...newColumns]);
  }

  // 修改 & 新增
  const [mainShow, setMainShow] = useState(true);
  const handleMainShow = () => {
    setMainShow(true);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  };
  
  const [modalTitle, setModalTitle] = useState('編輯賓客資料'); // 新增賓客資料

  const [info, setInfo] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const [formMobilePhone, setFormMobilePhone] = useState('');
  const [customerData, setCuomerData] = useState({});
  const [submitBtnText, setSubmitBtnText] = useState('');

  const addCustomer = () => {
    setSubmitBtnText('儲存');
    setCuomerData({});
    setFormEmail('');
    setFormMobilePhone('');
    setModalTitle('新增賓客資料');
    setMainShow(false);

    if(info) setInfo(false);
    else setInfo(true);

    setTimeout(() => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }, 300);
  }
  
  const modifyCustomer = (obj) => {
    setSubmitBtnText('送出修改');
    setModalTitle('修改賓客資料');
    setFormEmail(obj.Mail);
    setFormMobilePhone(obj.MobilePhone);
    setInfo(true);
    setCuomerData(obj);

    setMainShow(false);

    setTimeout(() => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }, 300);
  }

  // 修改欄位
  const handleChangeForm = (e, columnName) => {
    const val = e.target.value;

    if(columnName === 'Mail') {
      setFormEmail(val);
    } else if(columnName === 'MobilePhone') {
      setFormMobilePhone(val);
    } else {
      let newForm = Object.assign({}, customerData);
      newForm[columnName] = val;
      setCuomerData({...customerData, ...newForm});
    }
  }

  // 儲存設定
  const handleSubmit = () => {
    const Array = [];

    for(let i = 0; i < columns.length; i++) {
      let o = {};
      o.DBColumnName = columns[i].DBColumnName;
      o.Value = customerData[columns[i].DBColumnName];

      if(customerData[columns[i].DBColumnName] != null) Array.push(o);
    }

    MySwal.fire({
      title: "更新中請稍候",
      html: <Loading />,
      customClass: {
        popup: 'bg-white'
      },
      showConfirmButton: false,
      showCancelButton: false,
    });

    setTimeout(() => {
      let formData = new FormData();
      formData.append('SToken', SToken);
      formData.append('EMail', formEmail);
      formData.append('MobilePhone', formMobilePhone);
      formData.append('Content', JSON.stringify(Array));

      const saveData = async () => {
        let res; 
        if(customerData.ID && customerData.ID !== null) {
          formData.append('ClientID', customerData.ID);
          res = await api_event_update_client(formData);
        } else {
          res = await api_event_insert_client(formData);
        }

        if(res.data && res.data.Msg === 'OK') {
          setInfo(false);
          setCuomerData({});
          setFormEmail(null);
          setFormMobilePhone(null);
          formData = new FormData();
          formData.append('SToken', SToken);
          const clientList = await api_query_client_list(formData);

          if(clientList.data && clientList.data.Msg === 'OK') {
            const {dtList} = clientList.data;
            setList([...dtList]);
            MySwal.fire({
              title: '儲存成功',
              icon: "success"
            }).then(() => {
              handleMainShow();
            });
          }
        } else {
          MySwal.fire('儲存失敗', '', "success");
        }
      }

      saveData();
    }, 500);
  }

  return (
    <Fragment>
      <HeaderDiv goBack={true} />
      {/*<ButtonPageClose />*/}
      
      <section className="extTable section-table cid-rWWj2DwwY0 pt-3">
        <Container>
          <Row className={`${mainShow ? '' : 'hide'}`}>
            <Col xs={{ span: 10, offset: 1 }} md={{ span: 5, offset: 4}} className="form-group">
              {introImages && introImages[2] && introImages[2].Image && 
              <img src={`http://backend.wedding-pass.com/ERPUpload/4878/${introImages[2].Image}`} className="img-fluid" />}
            </Col>

            <Accordion className="col-12">
            {list && list.length > 0 && keyColumn1.DBColumnName && keyColumn2.DBColumnName && list.map((item, index) =>
              <Card key={item.ID}>
                <Accordion.Toggle as={Card.Header} eventKey={item.ID} className="p-0">
                  <h2 className="mbr-fonts-style mbr-black p-2 display-7 listManage style-th"
                    style={{lineHeight: 1.7}}>
                    <span className="mr-4">{index + 1}.</span>
                    <span className="card-header-title">
                      {item[keyColumn1.DBColumnName]} - {item[keyColumn2.DBColumnName]}
                    </span>
                  </h2>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={item.ID}>
                  <Card.Body className="p-0 col-12">
                    <div className="table-wrapper">
                      <Container className="scroll mb-5 mt-3">
                        <table className="table m-auto rwdtable" cellSpacing="0">
                          <thead>{columns && columns.map(column => 
                            column._wp.WP_ShowOnListMgr === 1 &&
                            <tr className="table-heads" key={column.ID}>
                              <th className="head-item mbr-fonts-style display-7">{column.Name}</th>
                            </tr>
                          )}
                          </thead>
                          <tbody>
                            <tr>{columns && columns.map(column => 
                              column._wp.WP_ShowOnListMgr === 1 &&
                              <td data-label={column.Name} className="body-item mbr-fonts-style display-7" key={column.ID}>
                                {item[column.DBColumnName] !== null 
                                ? <span>{item[column.DBColumnName]}</span>
                                : <span>---</span>
                                }
                              </td>)}
                              <td className="body-item mbr-fonts-style display-7">
                                <button className="btn EditButtons btn-block px-0 text-light" onClick={() => modifyCustomer(item)}>修改</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Container>
                    </div>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            )}
            </Accordion>
          
            {list && list.length > 0 ? 
            <Col xs={12}>
              <a className="text-center" onClick={addCustomer}>
                <h2 className="mbr-fonts-style mbr-black pb-3 display-7 style-th dash-border">
                  <span className="mr-4 icon-plus">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#03030355">
                      <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                    </svg>
                  </span>
                </h2>
              </a>
            </Col> :
            <Col xs={12} className="text-center mt-150">
              <a onClick={addCustomer}>
                <span className="mbrib-edit"></span>
                <div className="nowrap">讓我們來開始<br />建立婚禮賓客名單</div>
              </a>
            </Col>
            }
          </Row>

          <Row className={`unselectable ${mainShow ? 'hide' : ''}`}>
            <Col xs={12}>
              <h4 className="mbr-fonts-style display-5 text-center text-main-color">{modalTitle}</h4>
            </Col>
            <Col xs={12}>
              <hr />
            </Col>

            <Col xs={12} md={12} sm={12} lg={6} className="form-group">
              <label className="form-control-label mbr-fonts-style display-7">賓客 E-Mail</label>
              <input type="text" placeholder="請輸入賓客E-Mail" className="form-control display-7" required="required" value={formEmail} onChange={(e) => handleChangeForm(e, 'Mail')} />
              <small className="text-main-color">賓客接收電子邀請函使用的E-mail</small>
            </Col>

            <Col xs={12} md={12} sm={12} lg={6} className="form-group">
              <label className="form-control-label mbr-fonts-style display-7">賓客 手機號碼</label>
              <input type="text" placeholder="請輸入賓客手機號碼" className="form-control display-7" required="required" value={formMobilePhone} onChange={(e) => handleChangeForm(e, 'MobilePhone')} />
              <small className="text-main-color">賓客接MMS收電子邀請函使用的手機</small><br />
              <small className="text-main-color">* * 貼心提醒</small><br />
              <small className="text-main-color">一些沒有或不常用自己Email的賓客，手機SMS電子邀請函會是很好的寄送方式。</small>
            </Col>

            {columns && columns.length > 0 && columns.map(item => {
              let tips = [];
              if(item._wp.TipOnListmgr !== null) {
                const retips = item._wp.TipOnListmgr.split("<br>");
                retips.map(tip => {
                  tips.push(tip);
                });
              }

              let itemValue = '';
              if(item._wp.WP_ShowOnListMgr === 1) {
                itemValue = (customerData[item.DBColumnName]) ? customerData[item.DBColumnName] : '';
              }

              return (item._wp.WP_ShowOnListMgr === 1 &&
                <Col xs={12} className="form-group" key={item.ID}>
                  <label className="form-control-label mbr-fonts-style display-7">{item.Name}</label>
                  {item._rt_opts ?
                    <select className="form-control display-7" required={item._wp.WP_IsRequired === 1} value={itemValue} onChange={(e) => handleChangeForm(e, item.DBColumnName)}>
                      <option value='' disabled>--- 請選擇 ---</option>
                      {item._rt_opts && item._rt_opts.length > 0 && item._rt_opts.map(opt => 
                      <option value={opt.value} key={opt.value}>{opt.text}</option>
                      )}
                    </select> : 
                    <input type="text" name={item.Name} placeholder={item.Name} className="form-control display-7" required={item._wp.WP_IsRequired === 1} value={itemValue} onChange={(e) => handleChangeForm(e, item.DBColumnName)} />
                  }
                  {item._wp.TipOnListmgr !== null && tips.map((tip, index) => {
                    return (<p className="mb-0" key={index}><small className="text-main-color">{tip}</small></p>);
                  })}
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      <section className={`mbr-section content5 mbr-parallax-background ${mainShow ? 'hide' : ''}`}>
        <nav className="navbar fixed-bottom justify-content-center d-flex row mx-auto position-fixed container main p-0">
          <button type="button" className="btn btn-3d btn-block px-0 text-light" onClick={() => handleSubmit()}>{submitBtnText}</button>
          <button type="button" className="btn btn-3d btn-block px-0 text-light" onClick={() => handleMainShow()}>取消</button>
        </nav>
      </section>
    </Fragment>
  );
}

export default PageListMgr;
