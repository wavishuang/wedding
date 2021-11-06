import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);

// actions 
import { check_token } from '../actions/actionAuth';

import Loading from '../components/Loading';

import PopBgIcon from '../components/PopBgIcon';
import PopImg from '../components/PopImg';

import '../scss/base.scss';
import '../scss/name.scss';
import '../scss/sswal.scss';

import BrandImg from '../images/logo_b-2x.png';

import IconBrideGroomYellow from '../images/icon/icon_bridegroom-yellow.png';
import IconBrideGroomPurple from '../images/icon/icon_bridegroom-purple.png';
import IconBrideGroomBlue from '../images/icon/icon_bridegroom-blue.png';
import IconBrideGroomRed from '../images/icon/icon_bridegroom-red.png';

import IconBrideYellow from '../images/icon/icon_bride-yellow.png';
import IconBridePurple from '../images/icon/icon_bride-purple.png';
import IconBrideBlue from '../images/icon/icon_bride-blue.png';
import IconBrideRed from '../images/icon/icon_bride-red.png';

import { 
  api_update_name
} from '../utils/api';

const PageName = function() {
  // 確認是否登入 && 檢查token是否有效
  const LoginInfo = (sessionStorage && sessionStorage.data) ? JSON.parse(sessionStorage.data) : null;
  const SToken = LoginInfo ? LoginInfo.Token : null;

  const dispatch = useDispatch();

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
          location.href = 'index.html';
        }
      }));

      MySwal.close();
    } else {
      location.href = 'index.html';
    }
  }, []);

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
  let stepList = [false, false, true, false, false, false, false];
  const [activeStep, setActiveStep] = useState(stepList);

  /**
   * Step 3 : 該怎麼稱呼您們呢?
   */
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');

  // 新娘姓名
  const handleBrideName = (e) => {
    let val = e.target.value;
    setBrideName(val);
  }

  // 新娘姓名
  const handleGroomName = (e) => {
    let val = e.target.value;
    setGroomName(val);
  }

  // step3: 輸入完 "新娘姓名" & "新郎姓名"
  const NextStep = () => {
    const theme = linearBg();

    if (brideName == '' && groomName == '') {
      MySwal.fire({
        html: <PopBgIcon theme={theme} type="new-comer" icon="info" />,
        customClass: {
          popup: `bg-img new-comer bg-${linearBg()}`,
        },
        showCancelButton: true,
        cancelButtonText: "先不要，我想要用我們的名字!",
        confirmButtonText: "好的！暫時叫我們志明與春嬌!",
        closeOnConfirm: true
      }).then((result) => {
        if (result.isConfirmed) {
          setBrideName('春嬌');
          setGroomName('志明');
        }
      });
    } else {
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
        formData.append('SToken', SToken);
        formData.append('GroomName', groomName);
        formData.append('BrideName', brideName);

        api_update_name(formData)
          .then(res => {
            const result = res.data;
            if (result.Msg === "WP00000001") {
              location.href="index.html";
            }

            if(result.Msg === 'OK') {
              location.href="date.html";
            }
          })
          .catch(err => {
            MySwal.fire('無法檢視', err, 'error');
          });
      }, 500);
    }
  }

  const BrideImg = () => {
    switch(activeBg) {
      case 1:
        return <img src={IconBrideYellow} title="新娘" alt="新娘" />
      case 2:
        return <img src={IconBridePurple} title="新娘" alt="新娘" />
      case 3:
        return <img src={IconBrideBlue} title="新娘" alt="新娘" />
      case 4:
        return <img src={IconBrideRed} title="新娘" alt="新娘" />
      default:
        return <img src={IconBrideRed} title="新娘" alt="新娘" />
    }
  }

  const GroomImg = () => {
    switch(activeBg) {
      case 1:
        return <img src={IconBrideGroomYellow} title="新郎" alt="新郎" />
      case 2:
        return <img src={IconBrideGroomPurple} title="新郎" alt="新郎" />
      case 3:
        return <img src={IconBrideGroomBlue} title="新郎" alt="新郎" />
      case 4:
        return <img src={IconBrideGroomRed} title="新郎" alt="新郎" />
      default:
        return <img src={IconBrideGroomRed} title="新郎" alt="新郎" />
    }
  }

  return (
    <Fragment>
      <section className="wrapper-s vh-100 bg-pic-start d-flex flex-column justify-content-end">
        {/** 漸層底色 */}
        <div className={`bg-linear ${'bg-'+ linearBg()}`}></div>

        <div className="main-brand">
          <div className="img-cover">
            <img src={BrandImg} title="WEDDING PASS" alt="WEDDING PASS" />
          </div>
        </div>
        
        <div className="wrapper-inner">  
          <div className={`main-left  ${'style-'+ linearBg()}`}>
            <div className="nav-cover">
              <ul className="nav nav-bg">
                {bgColor.map(item => 
                  <li key={item.name}>
                    <button type="button" className={`btn btn-circle ${item.classes} ${item.id === activeBg ? 'active': ''}`} onClick={() => changeBg(item.id)}></button>
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="main-content">
            <div className="main-inner d-flex flex-column justify-content-between">
              <div className="step-title">
                <h1 className="mbr-fonts-style mbr-section-title mbr-white mbr-bold align-center display-2">Step 3: 該怎麼稱呼您們呢?</h1>
              </div>

              <div className="input-form">
                <form className="mbr-form form-with-styler">
                    <div className="form-group d-flex justify-content-between">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            {BrideImg()}
                          </span>
                        </div>
                        <input type="text" className="form-control" placeholder="新娘姓名" required="required" value={brideName} onChange={(e) => handleBrideName(e)} />
                      </div>
                    </div>

                    <div className="form-group d-flex justify-content-between">
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            {GroomImg()}
                          </span>
                        </div>
                        <input type="text" className="form-control" placeholder="新郎姓名" required="required" value={groomName} onChange={(e) => handleGroomName(e)} />
                      </div>
                    </div>

                    <div className="form-group">
                      <button type="button" className={`btn display-4 ${'display-'+linearBg()}`} onClick={() => NextStep()}>下一步</button>
                    </div>
                </form>

                <div className="nav-cover">
                  <ul className="nav nav-list">
                    {activeStep.map((item, index) => 
                      <li key={index}>
                        <div className={`btn-list ${item ? 'btn-circle-'+ linearBg(): ''}`}></div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default PageName;
