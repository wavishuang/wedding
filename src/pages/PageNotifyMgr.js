import React, { useState, useEffect, Fragment } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

import HeaderDiv from '../components/HeaderDiv';
import Loading from '../components/Loading';
//import ButtonPageClose from '../components/ButtonPageClose';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { 
  api_check_token,
  api_query_client_list,
  api_query_client_column_setup,
  api_query_intro_image,
} from '../utils/api';

import '../scss/base.scss';
import '../scss/listmgr.scss';

const MySwal = withReactContent(Swal);

const PageNotifyMgr = function() {
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
        initNotifyMgr(dtColumns, resClientColumnSetup);

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
  const [keyColumn3, setKeyColumnName3] = useState({ Name: '報到通知對象', DBColumnName: null });

  const initNotifyMgr = (dtColumns, clientColumnSetup) => {
    let newColumns = [...dtColumns];

    newColumns.map(item => {
      if(item.Name === keyColumn1.Name) setKeyColumnName1({...keyColumn1, DBColumnName: item.DBColumnName});
      if(item.Name === keyColumn2.Name) setKeyColumnName2({...keyColumn2, DBColumnName: item.DBColumnName});
      if(item.Name === keyColumn3.Name) setKeyColumnName3({...keyColumn3, DBColumnName: item.DBColumnName});
    
      /*let wpObj = clientColumnSetup.find(subItem => subItem.Name === item.Name);
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
      */
    });

    setColumns([...columns, ...newColumns]);
  }

  // 修改 & 儲存
  const [formNotification, setFormNotification] = useState('');

  // 修改欄位
  const handleChangeForm = (e, columnName, rowID) => {
    const val = e.target.value;
    alert(rowID +" "+ columnName +":"+ val);

    if (keyColumn3.DBColumnName == null) {
      return;
    }

    setFormNotification(val);    
  }

  /*
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
  */

  return (
    <Fragment>
      <HeaderDiv goBack={true} />
      {/*<ButtonPageClose />*/}
      
      <section className="extTable section-table cid-rWWj2DwwY0 pt-3">
        <Container>
          <Row>
            <Col xs={{ span: 10, offset: 1 }} md={{ span: 5, offset: 4}} className="form-group">
              {introImages && introImages[10] && introImages[10].Image && 
              <img src={`http://backend.wedding-pass.com/ERPUpload/4878/${introImages[10].Image}`} className="img-fluid" />}
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
                        <Col lg={6} md={12} sm={12} className="form-group px-0">
                          <select required="required" className="form-control display-7 p-0" value={''} onChange={(e) => handleChangeForm(e, 'smsNotification', item.ID)}>
                            <option value="" disabled>--- 請選擇 ---</option>
                            <option value="不用通知">不用通知</option>
                            <option value="新娘">報到時請通知 - 新娘</option>
                            <option value="新郎">報到時請通知 - 新郎</option>
                            <option value="其他">報到時請通知 - 指定手機</option>
                          </select>
                        </Col>
                      </Container>
                    </div>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            )}
            </Accordion>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
}

export default PageNotifyMgr;
