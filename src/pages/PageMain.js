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
import { _uuid } from '../utils/tools';

import '../scss/base.scss';
import '../scss/main.scss';

const MySwal = withReactContent(Swal);

// actions 
import { check_token } from '../actions/actionAuth';
import { getIntroImages } from '../actions/actionIntroImage';
import { getWPColumnSetup } from '../actions/actionWPColumnSetup';
import { getClientList } from '../actions/actionClientList';
import { getOrderInfo } from '../actions/actionOrderInfo';
import { 
  getDashboardInfoMultiCheckin,
  getDashboardInfoCheckin
} from '../actions/actionCheckinInfo';
import { getPaymentInfo } from '../actions/actionPaymentInfo';


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

  const dispatch = useDispatch();

  const orderInfo = useSelector(state => state.orderInfo);
  const paymentDone = useSelector(state => state.paymentInfo && state.paymentInfo.PaymentDone);

  // 確認是否登入 && 檢查token是否有效
  useEffect(() => {
    if(LoginInfo && SToken) { 
      MySwal.fire({
        title: "",
        html: <Loading />,
        customClass: {
          popup: 'bg-transparent',
        },
        showConfirmButton: false,
        showCancelButton: false,
      });

      // 檢查 token 是否有效
      const formData = new FormData();
      formData.append('SToken', SToken);

      dispatch(check_token(formData, (res, err) => {
        if(err) {
          location.href = 'start.html';
        }
      }));

      // 取得 intro images
      dispatch(getIntroImages(formData, null));

      // 取得 WPColumnSetup
      dispatch(getWPColumnSetup(formData, (res, err) => {
        if(err) {
          MySwal.fire('Oops...', '系統發生錯誤', 'error');
        }
      }));
    
      // 取得 Client List, Client columns
      dispatch(getClientList(formData, (res, err) => {
        if(err) {
          MySwal.fire('Oops...', '系統發生錯誤', 'error');
        }
      }));

      // 取得 Order Info
      dispatch(getOrderInfo(formData, (res, err) => {
        if(err) {
          MySwal.fire('Oops...', '系統發生錯誤', 'error');
        }
      }));

      // 取得 Dashboard Info Multi Checkin
      dispatch(getDashboardInfoMultiCheckin(formData, (res, err) => {
        if(err) {
          MySwal.fire('Oops...', '系統發生錯誤', 'error');
        }
      }));

      // 取得 Dashboard Info Checkin
      dispatch(getDashboardInfoCheckin(formData, (res, err) => {
        if(err) {
          MySwal.fire('Oops...', '系統發生錯誤', 'error');
        }
      }));

      // 取得 Payment Info
      dispatch(getPaymentInfo(formData, (res, err) => {
        if(err) {
          MySwal.fire('Oops...', '系統發生錯誤', 'error');
        }
      }));

      MySwal.close();
    } else {
      location.href = 'start.html';
    }
  }, []);

  // 圖片 intro images
  const introImage = useSelector(state => state.introImages.images);

  // ＊＊＊＊＊＊ initial Data ＊＊＊＊＊＊
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

  // WebRegistrationPaymentDone ???
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
              {paymentDone
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
              {paymentDone
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
              {paymentDone
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
              {paymentDone
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
              {paymentDone
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
              {paymentDone
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
              {paymentDone
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
              {paymentDone
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
              {paymentDone
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
              {paymentDone
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
              {paymentDone
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
              {paymentDone
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
              {menuId === 11 && <WeddingPreInfo />}
              {menuId === 12 && <WeddingRegistInfo />}
              {menuId === 13 && <SetUpEDM SToken={SToken} MobilePhone={MobilePhone} />}
              {menuId === 14 && <WeddingBaseSetting SToken={SToken} />}

              {menuId === 21 && <WebRegistrationSetup SToken={SToken} />}
              {menuId === 22 && <CrossPage 
                introNum={12}
                webRegistrationPaymentDone={webRegistrationPaymentDone}
                goToWebRegistrationFrontend={goToWebRegistrationFrontend}
              />}

              {menuId === 31 && <ListMgr SToken={SToken} />}
              
              {menuId === 32 && <CrossPage 
                introNum={11} 
                downloadWeddingExcel={downloadWeddingExcel}
              />}
              {menuId === 33 && <CrossPage 
                introNum={1}
                upload={upload}
                fileUpload={fileUpload}
              />}
              {menuId === 34 && <CrossPage 
                introNum={3}
                downloadWeddingExcel={downloadWeddingExcel}
              />}

              {menuId === 35 && <NotifyMgr SToken={SToken} />}

              {menuId === 41 && <SendEmail SToken={SToken} />}
              {menuId === 42 && <SendMMS SToken={SToken} />}
              {menuId === 43 && <SendSMS SToken={SToken} />}
              {menuId === 44 && <Sticker SToken={SToken} />}

              {menuId === 51 && <CrossPage introNum={51} />}
              {menuId === 52 && <CrossPage 
                SToken={SToken} 
                introNum={52} 
              />}

              {menuId === 61 && <DataChart SToken={SToken} />}
              {menuId === 62 && <CheckinChart SToken={SToken} />}

              {menuId === 71 && <Congratulation />}
            </Col>

            {/* 手機版內容 */}
            {/* 婚禮籌備即時資訊 */}
            <Col sm={12} className="d-lg-none px-0 py-3">
              <SectionTitle title={'婚禮籌備即時資訊'} />
              <WeddingPreInfo />
            </Col>

            {/* 婚禮報到即時資訊 */}
            <Col sm={12} className="d-lg-none px-0 py-3">
              <SectionTitle title={'婚禮報到即時資訊'} />
              <WeddingRegistInfo />
            </Col>

            {/* 手機版 標題 & Icons */}
            {IconCollection.map(item => 
              <SectionContent 
                gid={item.gid} 
                id={item.id} 
                title={item.title} 
                text={item.text} 
                icons={item.icons} key={item.id}
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
