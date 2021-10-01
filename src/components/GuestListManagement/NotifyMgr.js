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

import '../../scss/listmgr.scss';

const MySwal = withReactContent(Swal);

const NotifyMgr = (props) => {
  const { SToken } = props;

  const introImage = useSelector(state => state.introImages.images);
  const dtList = useSelector(state => state.clientList.dtList);
  const dtColumns = useSelector(state => state.clientList.dtColumns);

  const titleImg = (imgNum) => {
    const bgImage = introImage && introImage.length > imgNum && `url(http://backend.wedding-pass.com/ERPUpload/4878/${introImage[imgNum].Image})`;
    return (bgImage) ? {backgroundImage: bgImage, backgroundSize: 'cover'} : '';
  }

  const keyColumns = ['賓客姓名', '賓客關係', '通知對象', '簡訊發送電話', '操作'];
  const [keyColumn1, setKeyColumnName1] = useState({ Name: '賓客姓名', DBColumnName: null });
  const [keyColumn2, setKeyColumnName2] = useState({ Name: '賓客關係', DBColumnName: null });
  const [keyColumn3, setKeyColumnName3] = useState({ Name: '報到通知對象', DBColumnName: null }); // 沒有欄位
  const [columns, setColumns] = useState([]);

  // 初始化
  useEffect(() => {
    if(dtColumns.length > 0) {
      let newColumns = [...dtColumns];

      newColumns.map(item => {
        if(item.Name === keyColumn1.Name) setKeyColumnName1({...keyColumn1, DBColumnName: item.DBColumnName});
        if(item.Name === keyColumn2.Name) setKeyColumnName2({...keyColumn2, DBColumnName: item.DBColumnName});
        if(item.Name === keyColumn3.Name) setKeyColumnName3({...keyColumn3, DBColumnName: item.DBColumnName});
      });

      setColumns([...newColumns]);
    }
  }, [dtColumns]);

  const notifyTarget = [
    {id: 0, text: '--- 請選擇 ---'},
    {id: 1, text: '不用通知'},
    {id: 2, text: '新娘'},
    {id: 3, text: '新郎'},
    {id: 4, text: '其他'},
  ];
  
  const modalTitle = '報到簡訊通知';

  // 修改 & 儲存
  const [modalShow, setModalShow] = useState(false);
  
  const [formName, setFormName] = useState('');
  const [formMobilePhone, setFormMobilePhone] = useState('');
  const [formNotifyTargetDBColumnName, setFormNotifyTargetDBColumnName] = useState('');
  const [formNotifyTargetID, setFormNotifyTargetID] = useState(0);
  const [formNotifyTargetMobilePhone, setFormNotifyTargetMobilePhone] = useState('');

  const modifyCustomer = (obj) => {
    setFormName(obj[keyColumn1.DBColumnName]);
    setFormMobilePhone(obj.MobilePhone);
    setFormNotifyTargetDBColumnName(obj[keyColumn3.DBColumnName]);
    setFormNotifyTargetID(0);
    setFormNotifyTargetMobilePhone('');

    setModalShow(true);
  }

  // 修改欄位
  const handleChangeForm = (e, columnName, rowID) => {
    const val = e.target.value;
    alert(rowID +" "+ columnName +":"+ val);

    if (keyColumn3.DBColumnName == null) {
      return;
    }

    setFormNotification(val);
  }

  // if formNotifyTargetID === 4(其他) ==> 指定手機才會生效
  const handleChangeTargetMobilePhone = (e) => {
    const val = e.target.value;
    setFormNotifyTargetMobilePhone(val);
  }

  // 儲存
  const handleSubmit = () => {
    console.log('submit');
  }

  return (
    <section className="header12 cid-rW0yhSdFBy bg-color-pink">
      <section className="extTable section-table cid-rWWj2DwwY0 bg-color-transparent py-0">
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
                  <table className="table rwdtable bg-color-transparent table-horizontal table-sms">
                    <thead>
                      <tr>
                        {keyColumns.map((item, index) => 
                        <th className="head-item mbr-fonts-style display-7 bg-color-transparent" key={index}>{item}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {dtList.map((item, index) =>
                        <tr key={index}>
                          <td className="text-center">{item[keyColumn1.DBColumnName]}</td>
                          <td className="text-center">{item[keyColumn2.DBColumnName]}</td>
                          <td className="text-center">{item[keyColumn3.DBColumnName]}</td>
                          <td className="text-center">
                            <div className="w-200">{item['MobilePhone']}</div>
                          </td>
                          <td className="text-center">
                            <button className="btn EditButtons btn-block px-0 text-light" onClick={() => modifyCustomer(item)}>編輯</button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Col>}
              </div>
            </Col>
          </Row>
        </Container>

        <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
          <Modal.Header>
            <Modal.Title className="modal-title mbr-fonts-style display-5">{modalTitle}</Modal.Title>
            <ButtonModalClose handleModalClose={() => setModalShow(false)} />
          </Modal.Header>
          <Modal.Body>
            <form className="mbr-form">
              <div className="dragArea">
                <Row>
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">賓客姓名</label>
                    <input type="text" placeholder="賓客姓名" className="form-control display-7" required="required" value={formName} disabled={true} />
                  </Col>

                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">賓客手機號碼</label>
                    <input type="text" placeholder="請輸入賓客手機號碼" className="form-control display-7" required="required" value={formMobilePhone} disabled={true} />
                  </Col>

                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">報到時請通知</label>
                    <select className="form-control display-7" value="formNotifyTargetID" onChange={(e) => setFormNotifyTargetID(e.target.value)}>
                      {notifyTarget.map(item =>
                      <option value={item.id} key={item.id}>{item.text}</option>
                      )}
                    </select>
                  </Col>

                  {parseInt(formNotifyTargetID) === 4 &&
                  <Col xs={12} className="form-group">
                    <label className="form-control-label mbr-fonts-style display-7">指定手機</label>
                    <input type="text" placeholder="請輸入賓客手機號碼" className="form-control display-7" required="required" value={formNotifyTargetMobilePhone} onChange={(e) => handleChangeTargetMobilePhone(e, 'formNotifyTargetMobilePhone')} />
                  </Col>
                  }

                  <Col xs={12} className="form-group">
                    <Row>
                      <Col xs={6}>
                        <button type="button" className="btn EditButtons display-7 btn-block" onClick={() => handleSubmit()}>儲存</button>
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

export default NotifyMgr;
