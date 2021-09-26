import React, { Fragment, useCallback, useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

import HeaderMain from '../components/HeaderMain';
import AddDesktop from '../components/AddDesktop';
import MenuCard from '../components/MenuCard';
import SectionTitle from '../components/SectionTitle';
import SectionContent from '../components/SectionContent';
import ButtonModalClose from '../components/ButtonModalClose';
import Loading from '../components/Loading';

import CrossPage from '../components/CrossPage'; // 2-2, 3-2, 3-3, 3-4, 5-1, 5-2

// 1. 婚禮資訊 Wedding Info
import WeddingPreInfo from '../components/WeddingInfo/WeddingPreInfo'; // 1-1 婚禮籌備即時資訊
import WeddingRegistInfo from '../components/WeddingInfo/WeddingRegistInfo';  // 1-2 婚禮報到即時資訊
import SetUpEDM from '../components/WeddingInfo/SetUpEDM'; // 1-3 設定電子邀請函
import WeddingBaseSetting from '../components/WeddingInfo/WeddingBaseSetting'; // 1-4 婚禮基本資料編輯

// 2. 婚宴報名模組
import WebRegistrationSetup from '../components/ＷeddingRegistModule/WebRegistrationSetup'; // 2-1 報名網站設定

// 3. 賓客名單管理
import ListMgr from '../components/GuestListManagement/ListMgr'; // 3-1 完整名單管理
import NotifyMgr from '../components/GuestListManagement/NotifyMgr';  // 3-5 報到簡訊通知

// 4. 電子邀請函發送
import SendEmail from '../components/SendEInvitation/SendEmail'; // 4-1 Email 電子邀請函發送
import SendMMS from '../components/SendEInvitation/SendMMS';  // 4-2 MMS 圖文簡訊電子邀請函發送
import SendSMS from '../components/SendEInvitation/SendSMS';  // 4-3 SMS 文字簡訊電子邀請函發送
import Sticker from '../components/SendEInvitation/Sticker';  // 4-4 傳統喜帖QRC貼紙索取

// 6. 數據統計即時分析
import DataChart from '../components/RealTimeAnalysis/DataChart'; // 6-1 賓客資料分析圖
import CheckinChart from '../components/RealTimeAnalysis/CheckinChart'; // 6-2 賓客報到分析圖

// 7. 賓客賀詞
import Congratulation from '../components/GuestMessage/Congratulation'; // 7-1 賓客賀詞

import { MenuGroup, Language, IconCollection } from '../utils/config';
import { isNumber, _uuid } from '../utils/tools';
import {
  api_check_token,
  api_query_intro_image,
  api_query_client_list,
  api_query_order_info,
  api_query_dashboard_info_multi_checkin,
  api_query_dashboard_info_checkin,
  api_query_payment_info,
  api_query_base_data, // 1-4 query base data
  api_save_base_data, // 1-4 save base data
  api_query_client_column_setup, // WPColumnSetup
} from '../utils/api';

import '../scss/base.scss';
import '../scss/main.scss';

const MySwal = withReactContent(Swal);

const mqStandAlone = '(display-mode: standalone)';
let IsPWA = false;
if (navigator.standalone || window.matchMedia(mqStandAlone).matches) {
  displayMode = 'standalone';
  IsPWA = true;
}

const PageMain = function() {
  // 確認是否登入 && 檢查token是否有效
  const LoginInfo = (sessionStorage && sessionStorage.data) ? JSON.parse(sessionStorage.data) : null;
  const SToken = LoginInfo ? LoginInfo.Token : null;
  const MobilePhone = LoginInfo.MobilePhoneCountryCode + LoginInfo.MobilePhone;

  if(!LoginInfo || !SToken) location.href = 'start.html';
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
  const [colunms, setColumns] = useState([]); // dtColumns
  const [list, setList] = useState([]); // dtList

  // Order Info
  const [orderInfo, setOrderInfo] = useState(null); // Order Info
  
  // Dashboard Info Multi Check in
  const [dashboardInfoMultiCheckIn, setDashboardInfoMultiCheckIn] = useState({
    Count: 0
  });

  // Dashboard Info Check in
  const [dashboardInfoCheckIn, setDashboardInfoCheckIn] = useState({
    CheckIn: 0, // 報到人數
    Total: 0, // 總報到人數
    CheckInRate: 0, // 報到率
  });

  // Payment Info
  const [paymentInfo, setPaymentInfo] = useState({
    PaymentDone: true
  });

  // 圖片 Intro Image
  const [introImage, setIntroImage] = useState([]);

  // ＊＊＊＊＊＊ 處理過的資料 ＊＊＊＊＊＊
  // 婚禮籌備即時資訊
  const [weddingInfo, setWeddingInfo] = useState({
    CountOfGuest: 0,  // 賓客數
    CountOfTotal: 0,  // 總出席人數
    CountOfCake: 0,   // 喜餅數量
    PeopleDesktop: 0, // 每桌幾人
    CountOfTotalCheckIn: 0  // 目前總出席人數
  });

  // 婚禮報到即時資訊
  const [registInfo, setRegistInfo] = useState({
    CheckIn: 0, // 報到人數
    Total: 0, // 賓客數
    CheckInRate: 0, // 報到率
    CountOfTotal: 0, // 總出席人數
    CountOfTotalCheckIn: 0, // 目前總出席人數
    EstimateCheckInRate: 0, // 預估出席率
    DashboardInfoMultiCheckInCount: 0,  // 已領取喜餅數量
    CountOfCake: 0, // 預計喜餅數量
    ReceiveCakeRate: 0 // 領取率
  });

  // 婚禮基本資料編輯 base data
  const [baseData, setBaseData] = useState({});

  // WPColumnSetup
  const [wpColumnSetup, setWpColumnSetup] = useState([]);

  // 初始化
  const initFixedData = async () => {
    const formData = new FormData();
    formData.append('SToken', SToken);
    
    try {
      const introImage = await api_query_intro_image(formData); // 圖片
      const queryWPColumnSetup = await api_query_client_column_setup(formData); // api_query_client_column_setup

      if(introImage.data && introImage.data.Msg === 'OK'
        && queryWPColumnSetup.data && queryWPColumnSetup.data.Msg === 'OK'
      ) {
        // intro image
        const images = JSON.parse(introImage.data.JSONContent);
        setIntroImage([...images]);

        // WPColumnSetup
        const resWpColumnSetup = JSON.parse(queryWPColumnSetup.data.JSONContent);
        setWpColumnSetup([...resWpColumnSetup]);
      } else {
        MySwal.fire('Oops...', '系統發生錯誤', 'error');
      }
    } catch(err) {
      MySwal.fire('Oops...', '系統發生錯誤', 'error');
    };
  }

  const initData = async () => {
    const formData = new FormData();
    formData.append('SToken', SToken);
    
    try {
      //const introImage = await api_query_intro_image(formData); // 圖片
      const clientList = await api_query_client_list(formData); // ClientList
      const orderInfo = await api_query_order_info(formData); // OrderInfo
      const queryDashboardInfoMultiCheckin = await api_query_dashboard_info_multi_checkin(formData);
      const queryDashboardInfoCheckin = await api_query_dashboard_info_checkin(formData);
      const queryPaymentInfo = await api_query_payment_info(formData);
      const baseData = await api_query_base_data(formData); // BaseData

      if(clientList.data && clientList.data.Msg === 'OK'
        && orderInfo.data && orderInfo.data.Msg === 'OK'
        && queryDashboardInfoMultiCheckin.data && queryDashboardInfoMultiCheckin.data.length > 0
        && queryDashboardInfoCheckin.data && queryDashboardInfoCheckin.data.rows && queryDashboardInfoCheckin.data.rows.length > 0
        && queryPaymentInfo.data && queryPaymentInfo.data.Msg === 'OK'
        && baseData.data && baseData.data.Msg === 'OK'
      ) {
        // client list
        const {dtColumns, dtList} = clientList.data;
        setColumns([...dtColumns]);
        setList([...dtList]);
        
        // order info
        const resOrderInfo = JSON.parse(orderInfo.data.JSONContent)[0];
        setOrderInfo({...resOrderInfo});
        
        // dashboard info multi checkin
        const resDashboardInfoMultiCheckin = queryDashboardInfoMultiCheckin.data[0];
        setDashboardInfoMultiCheckIn({...dashboardInfoMultiCheckIn, ...resDashboardInfoMultiCheckin});
        
        // dashboard info checkin
        const resDashboardInfoCheckin = queryDashboardInfoCheckin.data.rows[0];
        setDashboardInfoCheckIn({...dashboardInfoCheckIn, ...resDashboardInfoCheckin});

        // payment info
        const resPaymentInfo = JSON.parse(queryPaymentInfo.data.JSONContent)[0];
        setPaymentInfo({...paymentInfo, ...resPaymentInfo});
        
        // 處理 '婚禮籌備即時資訊' & '婚禮報到即時資訊'
        initWeddingInfo(resOrderInfo, dtList, dtColumns, resDashboardInfoMultiCheckin, resDashboardInfoCheckin, );

        // 婚禮基本基料編輯
        const resBaseData = JSON.parse(baseData.data.JSONContent)[0];
        setBaseData({...resBaseData});

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
    initFixedData();
    initData();
    setMenuGid(1);
    setMenuId(11);
  }, []);

  const initWeddingInfo = (resOrderInfo, dtList, dtColumns, resDashboardInfoMultiCheckin, resDashboardInfoCheckin) => {
    const PeopleDesktop = resOrderInfo.CountOfDesktop; // 每桌幾人
    const CountOfGuest = dtList.length; // 賓客數

    const totalObj = dtColumns.find(item => item.Name === '出席人數');
    const DBColumnTotalName = totalObj.DBColumnName;
    const cakeObj = dtColumns.find(item => item.Name === '喜餅數量');
    const DBColumnCakeName = cakeObj.DBColumnName;

    let CountOfTotal = 0; // 總出席人數
    let CountOfCake = 0;  // 喜餅數量
    let CountOfTotalCheckIn = 0; // 出席數

    for(let i = 0; i < dtList.length; i++) {
      let vv1 = dtList[i][DBColumnTotalName];
      if(!isNumber(vv1)) vv1 = 1;
      CountOfTotal += parseInt(vv1);

      let vv2 = dtList[i][DBColumnCakeName];
      if(isNumber(vv2)) CountOfCake += parseInt(vv2);

      if(dtList[i]['CheckInTimeStamp']) CountOfTotalCheckIn += vv1;
    }
        
    // 婚禮籌備即時資訊
    setWeddingInfo({...weddingInfo, 
      CountOfGuest,
      CountOfTotal,
      CountOfCake,
      PeopleDesktop,
      CountOfTotalCheckIn
    });

    const CheckIn = Number(resDashboardInfoCheckin.CheckIn);
    const Total = Number(resDashboardInfoCheckin.Total);
    const CheckInRate = (Total === 0 || CheckIn === 0) ? 0 : ((CheckIn / Total)*100).toFixed(2);

    let CountOfCheckIn = Number(resDashboardInfoMultiCheckin.Count);

    // 婚禮報到即時資訊
    const EstimateCheckInRate = (CountOfTotal === 0 || CountOfTotalCheckIn === 0) ? 0 : ((CountOfTotalCheckIn/CountOfTotal)*100).toFixed(2);
    const ReceiveCakeRate = (CountOfCake === 0 || CountOfCheckIn === 0) ? 0 : ((CountOfCheckIn/CountOfCake)*100).toFixed(2);

    setRegistInfo({...registInfo, 
      CheckIn, // 報到人數
      Total, // 賓客數
      CheckInRate, // 報到率
      CountOfTotal, // 總出席人數
      CountOfTotalCheckIn, // 目前總出席人數
      EstimateCheckInRate, // 預估出席率
      DashboardInfoMultiCheckInCount: CountOfCheckIn,  // 已領取喜餅數量
      CountOfCake, // 預計喜餅數量
      ReceiveCakeRate // 領取率
    });
  }

  const [menuGid, setMenuGid] = useState(1);  // menu Group ID
  const [menuId, setMenuId] = useState(11); // menu ID

  // render 右側選單 Title
  const renderDesktopTitle = useCallback(() => {
    if(menuId % 10 === 0) return ;
    const GroupObj = MenuGroup.find(item => item.gid === menuGid);
    const menuObj = GroupObj.subItems.find(subItem => subItem.id === menuId);
    if(menuObj && menuObj.text) return menuObj.text;
  },[menuId]);

  // 語系
  const [lang, setLang] = useState(1);
  const [modalLangShow, setLangModalShow] = useState(false);

  const handleLangModalShow = () => setLangModalShow(true);

  // 選擇語系
  const handleSelLang = (langId) => {
    setLang(langId);
    setLangModalShow(false);
  }

  // 登出
  const handleLogout = () => {
    MySwal.fire({
      title: '您確定要登出?',
      icon: 'info',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `確定`,
      denyButtonText: `取消`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          title: '已將您登出～',
          icon: 'success',
          timer: 1500
        }).then(() => {
          sessionStorage.clear();
          location.href = 'start.html';
        });
      }
    });
  }

  // WebRegistrationPaymentDone
  const [webRegistrationPaymentDone, setWebRegistrationPaymentDone] = useState(true);

  // popShow
  const [popShow, setPopShow] = useState(false);
  const [popIntroImg, setPopIntroImg] = useState(0);
  const [popModalContent, setPopModalContent] = useState({
    modalTitle: '',
    modalBody: null
  });

  const popModalShow = (introImg) => {
    setPopIntroImg(introImg);

    let modalTitle = '';
    let modalBody = null;
    switch(introImg) {
      case 15: // 婚宴報名模組 - 婚禮報名網站設定 OK
        modalTitle = '婚禮報名網站設定'
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>Wedding Pass 提供您專屬的婚禮報名網站、賓客只要填寫報名資訊，您就可以快速收集預計出席名單。</label>
            </Col>
            <div className="col-auto form-group">
              {webRegistrationPaymentDone 
              ? <a className="btn btn-3d rounded-sm btn-block" href="webregistrationsetup.html">前往設定</a>
              : <button type="button" className="btn btn-3d rounded-sm btn-block">啟用 WEDDING PASS </button>
              }
            </div>
          </>
        );
        break;
      case 12: // 婚宴報名模組 - 婚禮報名網站預覽 OK
        modalTitle = '婚禮報名網站預覽'
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>Wedding Pass 提供您專屬的婚禮報名網站、賓客只要填寫報名資訊，您就可以快速收集預計出席名單。</label>
            </Col>
            <div className="col-auto form-group">
              {webRegistrationPaymentDone 
              ? <button type="button" className="btn btn-3d rounded-sm btn-block" onClick={() => goToWebRegistrationFrontend()}>前往前台報名網站</button>
              : <button type="button" className="btn btn-3d rounded-sm btn-block">啟用 WEDDING PASS </button>
              }
            </div>
          </>
        );
        break;
      
      case 2:  // 賓客名單管理 - 完整名單管理 OK
        modalTitle = '完整名單管理';
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>您可以在此管理您們婚禮的賓客清單<br />無論來源是匯入的賓客資訊<br />或是賓客在報名系統的登記。</label>
            </Col>
            <div className="col-auto form-group">
              {paymentInfo.PaymentDone 
              ? <a href="listmgr.html" className="btn btn-3d rounded-sm btn-block">前往名單管理</a>
              : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
              }
            </div>
          </>
        );
        break;
      case 11: // 賓客名單管理 - 下載Excel範本 OK
        modalTitle = '下載Excel範本';
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>WEDDING PASS 提供您Excel範本，<br />讓您們輕鬆自行管理賓客清單。</label>
            </Col>
            <div className="col-auto form-group">
              {paymentInfo.PaymentDone 
              ? <button type="button" className="btn btn-3d rounded-sm btn-block" onClick={() => downloadWeddingExcel('emptyExcel')}>下載專屬Excel範本</button>
              : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
              }
            </div>
          </>
        );
        break;
      case 1:  // 賓客名單管理 - 批次匯入賓客名單 OK
        modalTitle = '批次匯入賓客名單';
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>您可以在此匯入您們設定好的Excel賓客清單</label>
            </Col>
            <div className="col-auto form-group">
              {paymentInfo.PaymentDone 
              ? (<>
                <button type="button" className="btn btn-3d rounded-sm btn-block" onClick={() => upload('UploadExcel')}>上傳Excel設定檔</button>
                <input type="file" className="form-control" hidden readOnly={true} id="UploadExcel" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={() => fileUpload(false, 'UploadExcel')} />
                </>)
              : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
              }
            </div>
          </>
        );
        break;
      case 3:  // 賓客名單管理 - 匯出賓客報到狀況 OK
        modalTitle = '匯出賓客報到狀況';
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>您可以隨時在此匯出目前的婚宴賓客清單<br />與婚禮當天賓客的出席紀錄<br />檔案會以Excel格式下載<br />或是賓客在報名系統的登記。</label>
            </Col>
            <div className="col-auto form-group">
              {paymentInfo.PaymentDone 
              ? <button type="button" className="btn btn-3d rounded-sm btn-block" onClick={() => downloadWeddingExcel('customerList')}>匯出婚宴賓客清單</button>
              : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
              }
            </div>
          </>
        );
        break;
      case 10: // 賓客名單管理 - 賓客報到簡訊通知 OK
        modalTitle = '賓客報到簡訊通知';
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>新娘在休息室就可以利用手機簡訊得知重要閨蜜、朋友已經前來現場給予祝福。<br />當然、新郎也可以第一時間得知重要的好友、長官的參與。</label>
            </Col>
            <div className="col-auto form-group">
              {paymentInfo.PaymentDone 
              ? <a href="notifymgr.html" className="btn btn-3d rounded-sm btn-block">前往設定</a>
              : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
              }
            </div>
          </>
        );
        break;
      
      case 4:  // 電子邀請函發送 - Email 電子邀請函發送 OK
        modalTitle = 'Email 電子邀請函發送';
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>您可以在此手動逐一發送、批次自動發送賓客專屬邀請函。</label>
            </Col>
            <div className="col-auto form-group">
              {paymentInfo.PaymentDone 
              ? <a href="send.html" className="btn btn-3d rounded-sm btn-block">前往發送婚禮專屬邀請函</a>
              : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
              }
            </div>
          </>
        );
        break;
      case 5:  // 電子邀請函發送 - MMS 電子邀請函發送 OK
        modalTitle = 'MMS 電子邀請函發送';
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>您可以在此手動逐一發送、批次自動發送賓客專屬邀請函。</label>
            </Col>
            <div className="col-auto form-group">
              {paymentInfo.PaymentDone 
              ? <a href="SendMMS.html" className="btn btn-3d rounded-sm btn-block">前往發送婚禮專屬邀請函</a>
              : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
              }
            </div>
          </>
        );
        break;
      case 6:  // 電子邀請函發送 - SMS 電子邀請函發送 OK
        modalTitle = 'SMS 電子邀請函發送';
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>您可以在此手動逐一發送、批次自動發送賓客專屬邀請函。</label>
            </Col>
            <div className="col-auto form-group">
              {paymentInfo.PaymentDone 
              ? <a href="SendSMS.html" className="btn btn-3d rounded-sm btn-block">前往發送婚禮專屬邀請函</a>
              : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
              }
            </div>
          </>
        );
        break;
      case 7:  // 電子邀請函發送 - 傳統喜帖QRCode貼紙索取 OK
        modalTitle = (introImage && introImage[introImg] 
          ? <img src={`http://backend.wedding-pass.com/ERPUpload/4878/${introImage[introImg].Image}`} className="img-fluid" />
          : ''
        );
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <h5 className="modal-title mbr-fonts-style display-5" style={{fontWeight: 600, color: 'rgb(254 82 91)'}}>傳統喜帖QRCode貼紙索取</h5>
              <label className="display-7" style={{fontSize: '1rem', marginTop: '10px'}}>WEDDING-PASS 婚禮報到<br />可以提供您賓客專屬QRCode貼紙<br />您可以貼在傳統喜帖上<br />遵循傳統的長輩賓客<br />也可以享受科技化的數位報到服務。</label>
            </Col>
            <div className="col-auto form-group">
              {paymentInfo.PaymentDone 
              ? <a href="sticker.html" className="btn btn-3d rounded-sm btn-block">我要索取</a>
              : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
              }
            </div>
          </>
        );
        break;
      
      case 51: // 婚禮招待準備 - 下載招待人員掃描APP OK
        modalTitle = '下載招待人員掃描APP';
        modalBody = (
          <Row>
            <Col xs={12} className="form-group text-center">
              <img src="assets/images/wp_downloadapp.png" className="img-fluid" alt="Responsive image" />
            </Col>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>只要下載APP<br />婚禮招待即可幫您的賓客們<br />下載進行婚禮報到服務。</label>
            </Col>
            <Col xs={12} className="form-group text-center">
              <div className="d-flex">
                <div className="flex-1 pr-1">
                  <a href="https://apps.apple.com/tw/app/%E7%8E%84%E8%B3%A6e-pass/id1458471186">
                    <img src="assets/images/App_Store.png" className="img-fluid" alt="Responsive image" />
                  </a>
                </div>
                <div className="flex-1 pl-1">
                  <a href="https://play.google.com/store/apps/details?id=com.epass">
                    <img src="assets/images/google-play.png" className="img-fluid img-100" alt="Responsive image" />
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        );
        break;
      case 52: // 婚禮招待準備 - 招待人員APP 綁定 OK
        modalTitle = '招待人員APP 綁定';
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <img src={`http://backend.wedding-pass.com/WebService_SF_WEDDING_PASS.asmx/QueryAppQRCodeImg?SToken=${encodeURIComponent(LoginInfo.Token)}`} className="img-fluid" style={{width: '75%'}} />
              <img src="images/12.png" className="img-fluid" style={{marginTop: '-150px'}} />
            </Col>
            <Col xs={12} className="form-group text-center">
              <label class="display-7" style={{fontSize: '1.0rem'}}>下載APP後<br />請掃描此QRcode<br />即可替賓客進行報到服務</label>
              <label class="display-7" style={{fontSize: '1.0rem', color: 'red', fontWeight: 'bold'}}>此QRCode請妥善保存</label>
            </Col>
          </>
        );
        break;
      
      case 8:  // 數據統計即時分析 - 賓客資料分析圖 OK
        modalTitle = '賓客資料分析圖';
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>您可以在婚禮籌備時/婚禮結束後隨時得知賓客相關資料統計。</label>
            </Col>
            <div className="col-auto form-group">
              {paymentInfo.PaymentDone 
              ? <a href="datachart.html" className="btn btn-3d rounded-sm btn-block">賓客資料圖表分析</a>
              : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
              }
            </div>
          </>
        );
        break;
      case 9:  // 數據統計即時分析 - 賓客報到區間分析圖 OK
        modalTitle = '賓客報到區間分析圖';
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>您可以在婚禮結束後可以在此了解婚宴當天婚禮報到狀況。</label>
            </Col>
            <div className="col-auto form-group">
              {paymentInfo.PaymentDone 
              ? <a href="checkinchart.html" className="btn btn-3d rounded-sm btn-block">賓客報到分析</a>
              : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
              }
            </div>
          </>
        );
        break;
      
      case 16: // 賓客賀詞 - 賓客賀詞 OK
        modalTitle = '賓客賀詞';
        modalBody = (
          <>
            <Col xs={12} className="form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>賓客在婚禮報名系統報名時<br />特地留下給您們夫妻倆的祝福語</label>
            </Col>
            <div className="col-auto form-group">
              {paymentInfo.PaymentDone 
              ? <a href="Congratulation.html" className="btn btn-3d rounded-sm btn-block">前往查看</a>
              : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
              }
            </div>
          </>
        );
        break;

      default:
    }

    setPopModalContent({...popModalContent, modalTitle, modalBody});
    setPopShow(true);
  }

  // order info 相關
  const goToWebRegistrationFrontend = () => {
    if(orderInfo && orderInfo.Ident) {
      window.open(`http://www.wedding-pass.com/WebRegistration/Web20101601/index.html?Ident=${orderInfo.Ident}`);
    }
  }

  // 下載 Excel 範本 & 匯出賓客名單
  const downloadWeddingExcel = (fname) => {
    let url = '';
    let titleText = '';
    let responseHtml = '';
    if(fname === 'emptyExcel') {
      url = "http://backend.wedding-pass.com/WebService_SF_WEDDING_PASS.asmx/DownloadClientExcelSample?SToken=" + encodeURIComponent(SToken);
      titleText = '下載成功';
      responseHtml = `<p style='color: rgb(254 82 91);font-weight:400'>您已成功下載賓客清單範本!! <br>您可以手動整理好您的賓客清單後，再一次匯入回 WEDDING PASS 婚禮報到。</p>`;
    } else if(fname === 'customerList') {
      url = "http://backend.wedding-pass.com/WebService_SF_WEDDING_PASS.asmx/ExportClientExcel?SToken=" + encodeURIComponent(SToken);
      titleText = '賓客清單匯出成功';
      responseHtml = `<p style='color: rgb(254 82 91);font-weight:400'>您已成功下載賓客清單範本!!</p>`;
    }

    let element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', "");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    // window.open(url);

    MySwal.fire({
      title: titleText,
      icon: "info",
      html: responseHtml,
    });

    setPopShow(false);
  }

  // upload trigger
  const upload = (columnName) => {
    document.getElementById(columnName).click();
  }

  // file upload 檔案上傳
  const fileUpload = (isHead, columnName) => {
    const msgTitle = "上傳中請稍候";
    const msgOK = "上傳成功";
    const msgError = "上傳失敗";

    //取得該filebox中的檔案資料：
    let files = document.getElementById(columnName).files;

    if (files.length < 0) MySwal.fire(msgError, "", "error");
    //用JQ也可以寫成：
    // var files = $('#'+id)[0].files;

    let TargetFileName = _uuid() + "." + files[0].name.split('.').pop();

    //再來將剛剛取得的檔案資料放進FormData裡
    let fileData = new FormData();
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

    setTimeout(() => {
      fileData.append('SToken', SToken);
      fileData.append(files[0].name, files[0]);
      fileData.append('FileName', TargetFileName);

      //之後送ashx做處理
      $.ajax({
        url: "http://backend.wedding-pass.com/WebService_SF_WEDDING_PASS.asmx/UploadClientExcelList",
        type: "post",
        data: fileData,
        contentType: false,
        processData: false,
        async: true,
        success: function (data) {
          if (data.Msg.indexOf("OK") >= 0) {
            MySwal.fire(msgOK, "", "success");
          }
          else if (data.Msg.indexOf("SFE190709001") >= 0) {
            MySwal.fire({
              title: "提示",
              html: `<p style='color: rgb(254 82 91);font-weight:400'>您上傳的賓客清單是空的!! <br />您可以手動整理好您的賓客清單後，再一次匯入回 WEDDING PASS 婚禮報到。</p>`,
              icon: "info",
            });
          }
          else {
            MySwal.fire(msgError, "", "error");
          }
        }
      });
    }, 500);
  }

  // Event 1-4 儲存婚禮基本資料
  const save_wedding_info_base_data = (formData) => {
    const save_data = async () => {
      const res = await api_save_base_data(formData);
      
      if(res.data && res.data.Msg === 'OK') {
        initData();
        MySwal.fire({
          title: '更新完成',
          icon: 'success'
        });
      } else {
        MySwal.fire({
          title: '更新失敗',
          icon: 'error'
        });
      }
    }

    save_data();
  }

  // query client list
  const query_client_list = (formData) => {
    const save_data = async () => {
      const res = await api_query_client_list(formData);
      
      if(res.data && res.data.Msg === 'OK') {
        const {dtList} = res.data;
        setList([...dtList]);
      }

      return res;
    }

    return save_data();
  }

  return (
    <Fragment>
      <HeaderMain handleLangModalShow={handleLangModalShow} handleLogout={handleLogout} />
      <AddDesktop />

      <section className="mbr-section content8 cid-rXkjvHXzZn">
        <Container className="outter-container" fluid>
          <div className="media-container-row title">
            {/* 左側選單 */}
            <Col md={3} className="d-none d-lg-block">
              <div className="logo-cover">
                <img src="./images/logo-transparent.png" />
              </div>

              <div className="menu-outter">
                <div className="accordion">
                  {MenuGroup.map(item => 
                    <MenuCard menu={item} menuGid={menuGid} menuId={menuId} key={item.gid} setMenuGid={setMenuGid} setMenuId={setMenuId}  />
                  )}
                </div>
              </div>
            </Col>

            {/* 右側選單 */}
            <Col md={9} className="d-none d-lg-block">
              <SectionTitle title={renderDesktopTitle()} />
              {menuId === 11 && <WeddingPreInfo weddingInfo={weddingInfo} />}
              {menuId === 12 && <WeddingRegistInfo registInfo={registInfo} />}
              {menuId === 13 && <SetUpEDM orderInfo={orderInfo} MobilePhone={MobilePhone} SToken={SToken} />}
              {menuId === 14 && <WeddingBaseSetting SToken={SToken} introImage={introImage} baseData={baseData} saveWeddingInfoBaseData={save_wedding_info_base_data} />}

              {menuId === 21 && <WebRegistrationSetup SToken={SToken} introImage={introImage} />}
              {menuId === 22 && <CrossPage 
                introImage={introImage} 
                introNum={12}
                webRegistrationPaymentDone={webRegistrationPaymentDone}
                goToWebRegistrationFrontend={goToWebRegistrationFrontend}
              />}

              {menuId === 31 && <ListMgr SToken={SToken} introImage={introImage} dtList={list} dtColumns={colunms} WPColumnSetup={wpColumnSetup} queryClientList={query_client_list} />}
              {menuId === 32 && <CrossPage 
                introImage={introImage} 
                introNum={11}
                PaymentDone={paymentInfo.PaymentDone}
                downloadWeddingExcel={downloadWeddingExcel}
              />}
              {menuId === 33 && <CrossPage 
                introImage={introImage} 
                introNum={1}
                PaymentDone={paymentInfo.PaymentDone}
                upload={upload}
                fileUpload={fileUpload}
              />}
              {menuId === 34 && <CrossPage 
                introImage={introImage} 
                introNum={3}
                PaymentDone={paymentInfo.PaymentDone}
                downloadWeddingExcel={downloadWeddingExcel}
              />}
              {/** ========== not yet ================= */}
              {menuId === 35 && <NotifyMgr SToken={SToken} introImage={introImage} dtList={list} dtColumns={colunms} WPColumnSetup={wpColumnSetup} queryClientList={query_client_list} />}

              {menuId === 41 && <SendEmail SToken={SToken} introImage={introImage} dtList={list} dtColumns={colunms} WPColumnSetup={wpColumnSetup} queryClientList={query_client_list} />}
              {menuId === 42 && <SendMMS SToken={SToken} introImage={introImage} dtList={list} dtColumns={colunms} WPColumnSetup={wpColumnSetup} queryClientList={query_client_list} />}
              {menuId === 43 && <SendSMS SToken={SToken} introImage={introImage} dtList={list} dtColumns={colunms} WPColumnSetup={wpColumnSetup} queryClientList={query_client_list} />}
              {menuId === 44 && <Sticker SToken={SToken} introImage={introImage} />}

              {menuId === 51 && <CrossPage 
                introNum={51}
              />}
              {menuId === 52 && <CrossPage 
                SToken={SToken}
                introNum={52}
              />}

              {menuId === 61 && <DataChart SToken={SToken} introImage={introImage} dtList={list} dtColumns={colunms} WPColumnSetup={wpColumnSetup} />}
              {menuId === 62 && <CheckinChart SToken={SToken} introImage={introImage} dtList={list} dtColumns={colunms} WPColumnSetup={wpColumnSetup} />}

              {menuId === 71 && <Congratulation SToken={SToken} introImage={introImage} dtList={list} dtColumns={colunms} />}
            </Col>

            {/* 手機版內容 */}
            {/* 婚禮籌備即時資訊 */}
            <Col sm={12} className="d-lg-none px-0 py-3">
              <SectionTitle title={'婚禮籌備即時資訊'} />
              <WeddingPreInfo weddingInfo={weddingInfo} />
            </Col>

            {/* 婚禮報到即時資訊 */}
            <Col sm={12} className="d-lg-none px-0 py-3">
              <SectionTitle title={'婚禮報到即時資訊'} />
              <WeddingRegistInfo registInfo={registInfo} />
            </Col>

            {/* 手機版 標題 & Icons */}
            {IconCollection.map(item => 
              <SectionContent 
                gid={item.gid} 
                id={item.id} 
                title={item.title} 
                text={item.text} 
                icons={item.icons} key={item.id}
                introImage={introImage}
                popModalShow={popModalShow}
              />
            )}
          </div>
        </Container>
      </section>

      {/* 語系 */}
      <Modal show={modalLangShow} onHide={() => setLangModalShow(false)} centered>
        <Modal.Header>
          <Modal.Title>選擇語系</Modal.Title>
          <ButtonModalClose handleModalClose={() => setLangModalShow(false)} />
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="justify-content-center">
              {Language.map(item => 
                <Col md={3} xs={4} className={(item.id === lang) ? 'lan-btn lan-btn-shape active' : 'lan-btn lan-btn-shape'} key={item.id} onClick={() => handleSelLang(item.id)} >
                  {item.text}
                </Col>
              )}
            </Row>
          </Container>
        </Modal.Body>
      </Modal>

      {/* pop Modal */}
      <Modal show={popShow} onHide={() => setPopShow(false)} centered>
        <Modal.Header>
          <Modal.Title className="display-5">{popModalContent.modalTitle}</Modal.Title>
          <ButtonModalClose handleModalClose={() => setPopShow(false)} />
        </Modal.Header>
        <Modal.Body>
          <form className="mbr-form form-with-styler">
            <div className="text-center">
              {introImage && introImage.length > 0 && popIntroImg !== 7 && popIntroImg !== 51 && popIntroImg !== 52 &&
              <Col xs={12} className="form-group">  
                <img src={`http://backend.wedding-pass.com/ERPUpload/4878/${introImage[popIntroImg].Image}`} className="img-fluid" />
              </Col>
              }
              {popModalContent.modalBody}
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
}

export default PageMain;
