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

// actions
import { getClientList } from '../../actions/actionClientList';

import {
  api_event_update_client,
  api_event_insert_client,
} from '../../utils/api';

import '../../scss/listmgr.scss';

const MySwal = withReactContent(Swal);

const ListMgr = (props) => {
  const { SToken } = props;

  const introImage = useSelector(state => state.introImages.images);
  const WPColumnSetup = useSelector(state => state.wpColumnSetup);
  const dtList = useSelector(state => state.clientList.dtList);
  const dtColumns = useSelector(state => state.clientList.dtColumns);

  const titleImg = (imgNum) => {
    const bgImage = introImage && introImage.length > imgNum && `url(http://backend.wedding-pass.com/ERPUpload/4878/${introImage[imgNum].Image})`;
    return (bgImage) ? {backgroundImage: bgImage, backgroundSize: 'cover'} : '';
  }

  const keyColumns = ['賓客姓名', '賓客關係', '是否會參加婚禮', '出席人數', '操作'];
  const [keyColumn1, setKeyColumnName1] = useState({ Name: '賓客姓名', DBColumnName: null });
  const [keyColumn2, setKeyColumnName2] = useState({ Name: '賓客關係', DBColumnName: null });
  const [keyColumn3, setKeyColumnName3] = useState({ Name: '是否會參加婚禮', DBColumnName: null});
  const [keyColumn4, setKeyColumnName4] = useState({ Name: '出席人數', DBColumnName: null});

  const [columns, setColumns] = useState([]);

  // 初始化
  useEffect(() => {
    if(dtColumns.length > 0 && WPColumnSetup.length > 0) {
      let newColumns = [...dtColumns];

      newColumns.map(item => {
        if(item.Name === keyColumn1.Name) setKeyColumnName1({...keyColumn1, DBColumnName: item.DBColumnName});
        if(item.Name === keyColumn2.Name) setKeyColumnName2({...keyColumn2, DBColumnName: item.DBColumnName});
        if(item.Name === keyColumn3.Name) setKeyColumnName3({...keyColumn3, DBColumnName: item.DBColumnName});
        if(item.Name === keyColumn4.Name) setKeyColumnName4({...keyColumn4, DBColumnName: item.DBColumnName});
      
        let wpObj = WPColumnSetup.find(subItem => subItem.Name === item.Name);
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

      setColumns([...newColumns]);
    }
  }, [dtColumns, WPColumnSetup]);

  // 修改 & 新增
  const [modalShow, setModalShow] = useState(false);
  
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
    setModalShow(true);

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

    setModalShow(true);

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

  const dispatch = useDispatch();

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
          setFormEmail('');
          setFormMobilePhone('');
          formData = new FormData();
          formData.append('SToken', SToken);

          setModalShow(false);
          // 取得 Client List, Client columns
          dispatch(getClientList(formData, (res, err) => {
            if(err) {
              MySwal.fire('Oops...', '系統發生錯誤', 'error');
            } else {
              MySwal.fire({
                title: '儲存成功',
                icon: "success"
              });
            }
          }));
        } else {
          MySwal.fire('儲存失敗', '', "error");
        }
      }

      saveData();
    }, 500);
  }

  // render Modal Content
  const renderModalContent = () => {
    let cols = [];
    let tipCols = [];
    let noTipCols = [];

    if(columns && columns.length > 0) {
      columns.map(item => {
        let itemValue = '';
        if(item._wp.WP_ShowOnListMgr === 1) {
          itemValue = (customerData[item.DBColumnName]) ? customerData[item.DBColumnName] : '';
        }

        if (item._wp.WP_ShowOnListMgr === 1) {
          if(item._wp.TipOnListmgr !== null) {
            let tips = [];
            const retips = item._wp.TipOnListmgr.split("<br>");
            retips.map(tip => {
              tips.push(tip);
            });

            tipCols.push(
              <Col xs={4} className="form-group" key={`col1_${item.ID}`}>
                <label className="form-control-label mbr-fonts-style display-7">{item.Name}</label>
                {item._rt_opts ?
                  <select className="form-control display-7" required={item._wp.WP_IsRequired === 1} value={itemValue} onChange={(e) => handleChangeForm(e, item.DBColumnName)}>
                    <option value='' key={'op1_disabled'} disabled>--- 請選擇 ---</option>
                    {item._rt_opts && item._rt_opts.length > 0 && item._rt_opts.map(opt => 
                    <option value={opt.value} key={`opt1_${item.ID}_${opt.value}`}>{opt.text}</option>
                    )}
                  </select> : 
                  <input type="text" name={item.Name} placeholder={item.Name} className="form-control display-7" required={item._wp.WP_IsRequired === 1} value={itemValue} onChange={(e) => handleChangeForm(e, item.DBColumnName)} />
                }
                {tips.map((tip, index) => {
                  return (<p className="mb-0" key={`p1_${index}`}><small className="text-main-color">{tip}</small></p>);
                })}
              </Col>
            );
          } else {
            noTipCols.push(
              <Col xs={4} className="form-group" key={`col2_${item.ID}`}>
                <label className="form-control-label mbr-fonts-style display-7">{item.Name}</label>
                {item._rt_opts ?
                  <select className="form-control display-7" required={item._wp.WP_IsRequired === 1} value={itemValue} onChange={(e) => handleChangeForm(e, item.DBColumnName)}>
                    <option value='' key={'op2_disabled'} disabled>--- 請選擇 ---</option>
                    {item._rt_opts && item._rt_opts.length > 0 && item._rt_opts.map(opt => 
                    <option value={opt.value} key={`opt2_${item.ID}_${opt.value}`}>{opt.text}</option>
                    )}
                  </select> : 
                  <input type="text" name={item.Name} placeholder={item.Name} className="form-control display-7" required={item._wp.WP_IsRequired === 1} value={itemValue} onChange={(e) => handleChangeForm(e, item.DBColumnName)} />
                }
              </Col>
            )
          }
        }
      });

      cols = tipCols.concat(noTipCols);
    }
    
    return cols;
  }

  return (
    <section className="header12 cid-rW0yhSdFBy bg-color-pink">
      <section className="extTable section-table cid-rWWj2DwwY0 bg-color-transparent py-0">
        <div className="fixed-title-img" style={titleImg(2)}></div>
        <Container className="bg-transparent">
          <Row className="bg-transparent">
            <Col xs={12}>
              <div className="dragArea form-row">
                <Col xs={12}>
                  <hr />
                </Col>
                {dtList.length > 0 
                ? <Col xs={12} className="mx-auto">
                  <table className="table rwdtable bg-color-transparent table-horizontal">
                    <thead>
                      <tr>
                        {keyColumns.map((item, index) => 
                        <th className="head-item mbr-fonts-style display-7 bg-color-transparent" key={'th_' + index}>{item}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {dtList.map((item, index) =>
                        <tr key={'td_'+ index}>
                          <td className="text-center">{item[keyColumn1.DBColumnName]}</td>
                          <td className="text-center">{item[keyColumn2.DBColumnName]}</td>
                          <td className="text-center">{item[keyColumn3.DBColumnName]}</td>
                          <td className="text-center">{item[keyColumn4.DBColumnName]}</td>
                          <td className="text-center">
                            <button className="btn EditButtons btn-block px-0 text-light" onClick={() => modifyCustomer(item)}>編輯</button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Col>
                :
                <Col xs={10} className="mx-auto text-align mt-150 d-flex justify-content-center">
                  <a onClick={() => OpenEdit()} className="text-center">
                    <span class="mbrib-edit"></span>
                    <div class="nowrap">讓我們來開始<br />建立婚禮賓客名單</div>
                  </a>
                </Col>
                }
              </div>

              <div className="icon-fixed-plus">
                <a onClick={() => addCustomer()} title="新增賓客資料">
                  <h2 className="d-flex align-items-center justify-content-center mbr-fonts-style mbr-black style-th">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#03030355">
                        <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                      </svg>
                    </span>
                  </h2>
                </a>
              </div>
            </Col>
          </Row>
        </Container>

        <Modal className="maxw-1080" show={modalShow} onHide={() => setModalShow(false)} centered>
          <Modal.Header>
            <Modal.Title className="modal-title mbr-fonts-style display-5">{modalTitle}</Modal.Title>
            <ButtonModalClose handleModalClose={() => setModalShow(false)} />
          </Modal.Header>
          <Modal.Body>
            <form className="mbr-form">
              <div className="dragArea">
                <Row>
                  <Col xs={4} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">賓客 E-Mail</label>
                    <input type="text" placeholder="請輸入賓客E-Mail" className="form-control display-7" required="required" value={formEmail} onChange={(e) => handleChangeForm(e, 'Mail')} />
                    <small className="text-main-color">賓客接收電子邀請函使用的E-mail</small>
                  </Col>

                  <Col xs={4} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">賓客 手機號碼</label>
                    <input type="text" placeholder="請輸入賓客手機號碼" className="form-control display-7" required="required" value={formMobilePhone} onChange={(e) => handleChangeForm(e, 'MobilePhone')} />
                    <small className="text-main-color">賓客接MMS收電子邀請函使用的手機</small><br />
                    <small className="text-main-color">* * 貼心提醒</small><br />
                    <small className="text-main-color">一些沒有或不常用自己Email的賓客，手機SMS電子邀請函會是很好的寄送方式。</small>
                  </Col>

                  {renderModalContent()}

                  <Col xs={12} className="form-group">
                    <Row>
                      <Col xs={6}>
                        <button type="button" className="btn EditButtons display-7 btn-block" onClick={() => handleSubmit()}>{submitBtnText}</button>
                      </Col>
                      <Col xs={6}>
                        <button type="button" className="btn EditButtons display-7 btn-block" onClick={() => setModalShow(false)}>取消</button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </section>
    </section>
  );
}

export default ListMgr;
