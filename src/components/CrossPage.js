import React from 'react';
import { useSelector } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const CrossPage = (props) => {
  const {
    SToken,
    introNum,
    webRegistrationPaymentDone, 
    goToWebRegistrationFrontend,
    downloadWeddingExcel,
    upload,
    fileUpload
  } = props;

  const introImage = useSelector(state => state.introImages.images);
  const paymentDone = useSelector(state => state.paymentInfo && state.paymentInfo.PaymentDone);

  const renderContent = () => {
    let modalBody = null;
    switch(introNum) {
      case 12: // 婚宴報名模組 - 婚禮報名網站預覽
        modalBody = (
          <>
            <Col xs={8} className="mx-md-auto form-group text-center">
              <div className="d-flex flex-column">
                <div className="form-group">
                  <label className="display-7" style={{fontSize: '1rem'}}>Wedding Pass 提供您專屬的婚禮報名網站、賓客只要填寫報名資訊，您就可以快速收集預計出席名單。</label>
                </div>
                <div className="my-0 form-group">
                {webRegistrationPaymentDone 
                  ? <button type="button" className="btn btn-3d rounded-sm btn-block" onClick={() => goToWebRegistrationFrontend()}>前往前台報名網站</button>
                  : <button type="button" className="btn btn-3d rounded-sm btn-block">啟用 WEDDING PASS </button>
                }
                </div>
              </div>
            </Col>
          </>
        );
        break;      
      case 11: // 賓客名單管理 - 下載Excel範本 OK
        modalBody = (
          <>
            <Col xs={8} className="mx-md-auto form-group text-center">
              <div className="d-flex flex-column">
                <div className="form-group">
                  <label className="display-7" style={{fontSize: '1rem'}}>WEDDING PASS 提供您Excel範本，<br />讓您們輕鬆自行管理賓客清單。</label>
                </div>
                <div className="my-0 form-group">
                {paymentDone 
                  ? <button type="button" className="btn btn-3d rounded-sm btn-block" onClick={() => downloadWeddingExcel('emptyExcel')}>下載專屬Excel範本</button>
                  : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
                }
                </div>
              </div>
            </Col>
          </>
        );
        break;
      case 1:  // 賓客名單管理 - 批次匯入賓客名單 OK
        modalBody = (
          <>
            <Col xs={8} className="mx-md-auto form-group text-center">
              <div className="d-flex flex-column">
                <div className="form-group">
                  <label className="display-7" style={{fontSize: '1rem'}}>您可以在此匯入您們設定好的Excel賓客清單</label>
                </div>
                <div className="my-0 form-group">
                {paymentDone 
                  ? (<>
                    <button type="button" className="btn btn-3d rounded-sm btn-block" onClick={() => upload('UploadExcel')}>上傳Excel設定檔</button>
                    <input type="file" className="form-control" hidden readOnly={true} id="UploadExcel" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={() => fileUpload(false, 'UploadExcel')} />
                  </>)
                  : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
                }
                </div>
              </div>
            </Col>
          </>
        );
        break;
      case 3:  // 賓客名單管理 - 匯出賓客報到狀況 OK
        modalBody = (
          <>
            <Col xs={8} className="mx-md-auto form-group text-center">
              <div className="d-flex flex-column">
                <div className="form-group">
                <label className="display-7" style={{fontSize: '1rem'}}>您可以隨時在此匯出目前的婚宴賓客清單<br />與婚禮當天賓客的出席紀錄<br />檔案會以Excel格式下載<br />或是賓客在報名系統的登記。</label>
                </div>
                <div className="my-0 form-group">
                {paymentDone 
                  ? <button type="button" className="btn btn-3d rounded-sm btn-block" onClick={() => downloadWeddingExcel('customerList')}>匯出婚宴賓客清單</button>
                  : <button type="button" className="btn btn-3d rounded-sm btn-block">升級並啟用所有功能</button>
                }
                </div>
              </div>
            </Col>
          </>
        );
        break;
      case 51: // 婚禮招待準備 - 下載招待人員掃描APP OK
        modalBody = (
          <>
            <Col xs={8} className="mx-md-auto form-group text-center pt-3">
              <img src="assets/images/wp_downloadapp.png" className="img-fluid img-percent-70" alt="Responsive image" />
            </Col>
            <Col xs={8} className="mx-md-auto form-group text-center">
              <label className="display-7" style={{fontSize: '1rem'}}>只要下載APP<br />婚禮招待即可幫您的賓客們<br />下載進行婚禮報到服務。</label>
            </Col>
            <Col xs={8} className="mx-md-auto form-group text-center">
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
          </>
        );
        break;
      case 52: // 婚禮招待準備 - 招待人員APP 綁定 OK
        modalBody = (
          <>
            <Col xs={8} className="mx-md-auto form-group text-center pt-3">
              <div className="d-flex flex-column">
                <div className="form-group">
                  <img src={`http://backend.wedding-pass.com/WebService_SF_WEDDING_PASS.asmx/QueryAppQRCodeImg?SToken=${encodeURIComponent(SToken)}`} className="img-fluid" />
                  <img src="images/12-01.png" className="img-fluid" />
                </div>
                <div className="my-0 form-group">
                  <label className="display-7" style={{fontSize: '1.0rem'}}>下載APP後，請掃描此QRcode，<br />即可替賓客進行報到服務<span style={{color:'red', fontWeight: 'bold'}}>此QRCode請妥善保存</span></label>
                </div>
              </div>
            </Col>
          </>
        );
        break;
      default:
    }
    // setPopIntroImg(introImg);

    return modalBody;
  }

  const renderTitleImg = () => {
    return introNum < 50 
    ? <div className="col-8 mx-md-auto form-group">
      <img src={`http://backend.wedding-pass.com/ERPUpload/4878/${introImage[introNum].Image}`} className="img-fluid img-percent-70" />
    </div> : '';
  }
  
  return (
    <section className="header12 cid-rW0yhSdFBy bg-color-pink" id="header12-4r">
      <Container>
        <Row className="justify-content-center">
          <form className="mbr-form form-with-styler">
            <div className="dragArea row"></div>
            <div className="text-center">
              {renderTitleImg()}
              {renderContent()}
            </div>
          </form>
        </Row>
      </Container>
    </section>
  );
}

export default CrossPage;
