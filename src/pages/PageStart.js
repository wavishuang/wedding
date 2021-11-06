import React, { Fragment, useEffect, useState, useRef } from 'react';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);

import PopImg from '../components/PopImg';

import '../scss/base.scss';
import '../scss/start.scss';
import '../scss/sswal.scss';

import BrandImg from '../images/logo_b-2x.png';

import ApiCaller from '../utils/ApiCaller';

const PageStart = function() {
  // 測試（初始值設定）
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  const inputRef5 = useRef(null);
  const inputRef6 = useRef(null);
  const inputSubmit = useRef(null);

  /**
   * 版面樣式
   */
  // 版面樣式(背景顏色)
  const bgColor = [
    { id: 1, name: 'yellow', classes: 'btn-circle-yellow'},
    { id: 2, name: 'purple', classes: 'btn-circle-purple'},
    { id: 3, name: 'blue', classes: 'btn-circle-blue'},
    { id: 4, name: 'red', classes: 'btn-circle-red'}
  ];

  // 取得 背景顏色(樣式)
  const [activeBg, setActiveBg] = useState(() => {
    if(localStorage && localStorage.themeId) {
      return parseInt(localStorage.themeId);
    }
    return 1;
  });

  const linearBg = () => {
    const activeColor = bgColor.find(item => item.id === activeBg);
    return activeColor.name;
  }

  // 改變背景顏色(樣式) & 存入 localStorage.themeId
  const changeBg = (themeId) => {
    localStorage.setItem('themeId', themeId);
    setActiveBg(themeId);
  }

  // 步驟(step)
  let stepList = [true, false, false, false, false, false, false];
  const [activeStep, setActiveStep] = useState(stepList);

  /**
   * Step1: 輸入 & 檢查電話號碼
   */
  const mobilePhoneCountryCode = '+886';
  const [sendSMS, setSendSMS] = useState(false);

  const [mobilePhone, setMobilePhone] = useState('');
  const [checkPhone, setCheckPhone] = useState(true);
  const handleMobilePhone = (e) => {
    let phone = e.target.value;
    const reg = /09\d{2}(\d{6}|-\d{3}-\d{3})/
    //Strip all non-numeric characters from string in JavaScript
    phone = phone.replace(/\D/g,'');
    setMobilePhone(phone);
  }

  useEffect(() => {
    const reg = /09\d{2}(\d{6}|-\d{3}-\d{3})/
    const checkPhone = reg.test(mobilePhone);
    setCheckPhone(!checkPhone);
  }, [mobilePhone]);

  // step1: 輸入完手機號碼後登入
  const Login = () => {
    console.log('login');
    const theme = linearBg();
    console.log("theme:", theme);

    // "簡訊發送中",
    MySwal.fire({
      html: <PopImg theme={theme} type={'sendsms'} />,
      customClass: {
        popup: 'bg-img sendsms',
      },
      showConfirmButton: false,
      showCancelButton: false,
    });

    setTimeout(() => {
      const formData = new FormData();

      formData.append('MobilePhoneCountryCode', mobilePhoneCountryCode);
      formData.append('MobilePhone', mobilePhone);

      ApiCaller.connector().login(formData, (res, err) => {
        //console.log(res);
        if (res.Msg == "OK") {
          setSendSMS(true);
          setActiveStep([false, true, false, false, false, false, false]);
          MySwal.close();
        } else {
          MySwal.fire('Oops...', res.Msg, 'error');
        }
      });
    }, 500);
  }
  
  const [singleSms, setSingleSms] = useState(
    ['', '', '', '', '', '']
  );

  const handleSignleSMS = (e, index) => {
    //console.log(e.target.value);
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    let newValue = [...singleSms];
    newValue[index] = value;
    setSingleSms(newValue);
  }

  const handleNextSMS = (e, index) => {
    //const val = e.target.value;
    //console.log(val);
    const x = e.which || e.keyCode;
    //console.log(x);
    if(x < 48 || x > 57) return ;
    
    switch(index) {
      case 1:
        inputRef2.current.focus();
        break;
      case 2:
        inputRef3.current.focus();
        break;
      case 3:
        inputRef4.current.focus();
        break;
      case 4:
        inputRef5.current.focus();
        break;
      case 5:
        inputRef6.current.focus();
        break;
      case 6:
        inputSubmit.current.focus();
        break;
    }
  }

  const [checkSMS, setCheckSMS] = useState('');
  
  /*
  const handleSMS = (e, index) => {
    let sms = e.target.value;
    sms = sms.replace(/\D/g,'');
    setCheckSMS(sms);
  }
  */

  // 簡訊驗證
  const validationkSMS = () => {
    console.log('簡訊驗證');

    let checkSMS = '';
    let errorFlag = false;
    singleSms.map(w => {
      if(w === '') errorFlag = true;
      checkSMS += w;
    });

    if(errorFlag) {
      MySwal.fire('簡訊碼錯誤', '', 'error');
      return ;
    }

    setCheckSMS(checkSMS);

    const theme = linearBg();

    // 處理中
    MySwal.fire({
      html: <PopImg theme={theme} type="loading" />,
      customClass: {
        popup: 'bg-img loading',
      },
      showConfirmButton: false,
      showCancelButton: false,
    });
    
    setTimeout(function(){
      const formData = new FormData();

      formData.append('MobilePhoneCountryCode', mobilePhoneCountryCode);
      formData.append('MobilePhone', mobilePhone);
      formData.append('CheckSMS', checkSMS);

      ApiCaller.connector().check_login(formData, (res, err) => {
        console.log(res, res.LeadingStatus);
        if (res.Msg == "OK") {
          sessionStorage.data = JSON.stringify(res);

          location.href="name.html";
          /*
          if (parseInt(res.LeadingStatus) === 2) {
            location.href="name.html";
          } else {
            location.href="main.html";
          }
          */

          window.navigator.vibrate(200); 
          window.navigator.vibrate(200);
        } else {
          MySwal.fire('Oops...', res.Msg, 'error');
        }
      });
    }, 500);
  }

  return (
    <section className="wrapper-s vh-100 bg-pic-start d-flex flex-column align-items-center justify-content-end">
      {/** 漸層底色 */}
      <div className={`bg-linear ${'bg-'+ linearBg()}`}></div>
        
      <div className="wrapper-inner">
        <div className="main-brand">
          <div className="img-cover">
            <img src={BrandImg} title="WEDDING PASS" alt="WEDDING PASS" />
          </div>
        </div>
          
        <div className="main-content">
          <div className="main-inner d-flex flex-column justify-content-between">
            <div className="step-title">
              {sendSMS ? (
                <h1 className="mbr-fonts-style mbr-section-title mbr-white mbr-bold align-center display-2">Step 2: 請輸入您的簡訊驗證碼</h1>
                ) : ( 
                <h1 className="mbr-fonts-style mbr-section-title mbr-white mbr-bold align-center display-2">Step 1: 請輸入您的手機號碼</h1>
              )}
            </div>

            <div className="input-form">
              <form className="mbr-form form-with-styler">
                {sendSMS ? (
                  <Fragment>
                    <div className="form-group d-flex form-group-sms-num">
                      <input ref={inputRef1} type="tel" maxLength="1" className="form-control display-7 sms-num" value={singleSms[0]} onChange={(e) => handleSignleSMS(e, 0)} onKeyUp={(e) => handleNextSMS(e, 1)} />
                      <input ref={inputRef2} type="tel" maxLength="1" className="form-control display-7 sms-num" value={singleSms[1]} onChange={(e) => handleSignleSMS(e, 1)} onKeyUp={(e) => handleNextSMS(e, 2)} />
                      <input ref={inputRef3} type="tel" maxLength="1" className="form-control display-7 sms-num" value={singleSms[2]} onChange={(e) => handleSignleSMS(e, 2)} onKeyUp={(e) => handleNextSMS(e, 3)} />
                      <input ref={inputRef4} type="tel" maxLength="1" className="form-control display-7 sms-num" value={singleSms[3]} onChange={(e) => handleSignleSMS(e, 3)} onKeyUp={(e) => handleNextSMS(e, 4)} />
                      <input ref={inputRef5} type="tel" maxLength="1" className="form-control display-7 sms-num" value={singleSms[4]} onChange={(e) => handleSignleSMS(e, 4)} onKeyUp={(e) => handleNextSMS(e, 5)} />
                      <input ref={inputRef6} type="tel" maxLength="1" className="form-control display-7 sms-num" value={singleSms[5]} onChange={(e) => handleSignleSMS(e, 5)} onKeyUp={(e) => handleNextSMS(e, 6)} />
                    </div>
                    <div className="input-group-btn mbr-section-btn text-center mt-2-rem">
                      <button ref={inputSubmit} type="button" className={`btn display-4 ${'display-'+linearBg()}`} onClick={() => validationkSMS()}>請輸入簡訊驗證碼</button>
                    </div>
                  </Fragment>
                  ) : (
                  <Fragment>
                    <div className="form-group d-flex justify-content-between">
                      <input type="text" name="886" placeholder="+886" className="form-control display-7 local-num" value={mobilePhoneCountryCode} readOnly={true} disabled={true} />
                      <input type="tel" placeholder="09xxxxxxxx" maxLength={10} className="form-control display-7 mobile-num" value={mobilePhone} onChange={(e) => handleMobilePhone(e)} />
                    </div>

                    <div className="form-group">
                      <button type="button" className={`btn display-4 ${'display-'+linearBg()}`} onClick={() => Login()} disabled={checkPhone}>取得一次性登入密碼</button>
                    </div>
                  </Fragment>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="w-100 bottom-nav">
        <div className="d-flex justify-content-between">
          <ul className="nav nav-bg">
            {bgColor.map(item => 
              <li key={item.name}>
                <button type="button" className={`btn btn-circle ${item.classes} ${item.id === activeBg ? 'active': ''}`} onClick={() => changeBg(item.id)}></button>
              </li>
            )}
          </ul>

          <ul className="nav nav-list">
            {activeStep.map((item, index) => 
              <li key={index}>
                <div className={`btn-list ${item ? 'btn-circle-'+ linearBg(): ''}`}></div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default PageStart;
