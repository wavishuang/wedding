import React, { useState, useEffect, Fragment } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import HeaderDiv from '../components/HeaderDiv';
import Loading from '../components/Loading';
//import ButtonPageClose from '../components/ButtonPageClose';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { 
  api_check_token,
  api_query_client_list,
  api_query_intro_image,
} from '../utils/api';

import '../scss/base.scss';
import '../scss/congratulation.scss';

const MySwal = withReactContent(Swal);

const PageCongratulation = function() {
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

  // 圖片
  const [introImages, setIntroImages] = useState([]);

  // 初始化
  const initData = async () => {
    const formData = new FormData();
    formData.append('SToken', SToken);
    
    try {
      //const baseData = await api_query_base_data(formData);
      const clientList = await api_query_client_list(formData);
      const introImage = await api_query_intro_image(formData);

      if(clientList.data && clientList.data.Msg === 'OK'
        //&& baseData.data && baseData.data.Msg === 'OK'
        && introImage.data && introImage.data.Msg === 'OK')
      {
        // intro image
        const images = JSON.parse(introImage.data.JSONContent);
        setIntroImages({...images});

        // client list
        const {dtColumns, dtList} = clientList.data;
        setColumns([...dtColumns]);
        setList([...dtList]);

        // 初始化 頁面資料
        initCongratulation(dtList, dtColumns);

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
  const [keyColumn1, setKeyColumnName1] = useState({ Name: '賓客姓名', DBColumnName: null });
  const [keyColumn2, setKeyColumnName2] = useState({ Name: '賓客關係', DBColumnName: null });
  const [keyColumn3, setKeyColumnName3] = useState({ Name: '前台報名_婚禮賀詞', DBColumnName: null });
  const [congrationList, setCongrationList] = useState([]);

  const initCongratulation = (dtList, dtColumns) => {
    let congrationList = [];

    dtColumns.map(item => {
      if(item.Name === keyColumn1.Name) setKeyColumnName1({...keyColumn1, DBColumnName: item.DBColumnName});
      if(item.Name === keyColumn2.Name) setKeyColumnName2({...keyColumn2, DBColumnName: item.DBColumnName});
      if(item.Name === keyColumn3.Name){
        setKeyColumnName3({...keyColumn3, DBColumnName: item.DBColumnName});
        dtList.map(subItem => {
          if(!!subItem[item.DBColumnName]){
            congrationList.push(subItem);
          }
        });

        setCongrationList([...congrationList]);
      }
    });
  }

  return (
    <Fragment>
      <HeaderDiv goBack={true} />
      {/*<ButtonPageClose />*/}
      
      <section className="form cid-rLQ7009Pot pt-5 pb-0">
        <Container>
          <Row>
            <Col xs={{span: 10, offset: 1 }} md={{span: 5, offset: 4}} className="form-group mx-auto">
              {introImages && introImages[16] && introImages[16].Image && 
              <img src={`http://backend.wedding-pass.com/ERPUpload/4878/${introImages[16].Image}`} className="img-fluid" />}
            </Col>

            {(congrationList && congrationList.length < 0) ? congrationList.map((item, index) => (
            <div className="col-11 col-md-8 mx-auto mbr-form border-radius-15 bg-card mb-50" key={index}>
              <div className="dragArea form-row mt-30">
                <Col xs={12}>
                  <h4 className="mbr-fonts-style display-5 text-gray-333">{item[keyColumn1.DBColumnName]}</h4>
                </Col>
                <Col xs={12}>
                  <hr />
                </Col>
                <Col xs={4}>
                  <svg width="48" height="48" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" fill="#fdd4d4">
                    <path d="M832 320v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136zm896 0v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136z"></path>
                  </svg>
                </Col>
                <Col xs={8} className="congratulation-content">
                  <p>
                    {item[keyColumn3.DBColumnName]}
                  </p>
                </Col>
                <Col xs={12} className="text-right">
                  <small className="pr-20">
                    {item._SRT_EDIT_TIMESTAMP.substr(0,10)}
                  </small>
                </Col>
              </div>
              <div className="mt-30"></div>
            </div>))
            :
            <Col xs={12} className="text-center mt-100">
              <div className="nowrap">
                <svg width="48" height="48" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg" fill="#fdd4d4">
                  <path d="M832 320v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136zm896 0v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136z"></path>
                </svg>
                尚未收到賓客的祝賀喔
              </div>
            </Col>
            }
          </Row>
        </Container>
      </section>
    </Fragment>
  );
}

export default PageCongratulation;
