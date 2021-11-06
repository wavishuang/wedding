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
import '../scss/location.scss';
import '../scss/sswal.scss';

import BrandImg from '../images/logo_b-2x.png';

import { 
  api_update_location
} from '../utils/api';

const PageLocation = function() {
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
  let stepList = [false, false, false, false, true, false, false];
  const [activeStep, setActiveStep] = useState(stepList);

  /**
   * Step 5 : 預計婚禮地點
   */
  const [weddingLocation, setWeddingLocation] = useState('');
  
  // 婚禮地點
  const handleWeddingLocation = (e) => {
    let val = e.target.value;
    setWeddingLocation(val);
  }

  const NextStep = () => {
    const theme = linearBg();

    if (weddingLocation == '') {
      MySwal.fire({
        html: <PopBgIcon theme={theme} type="location" icon="info" />,
        customClass: {
          popup: `bg-img new-comer bg-${linearBg()}`,
        },
        showCancelButton: true,
        cancelButtonText: "先不要，我要自行輸入!",
        confirmButtonText: "好的！!",
        closeOnConfirm: true
      }).then((result) => {
        if (result.isConfirmed) {
          setWeddingLocation('OOO 婚宴會館');
        }
      });
    } else {
      // 婚宴準備中
      MySwal.fire({
        html: <PopImg theme={theme} type="venue-loading" />,
        customClass: {
          popup: 'bg-img venue-loading',
        },
        showConfirmButton: false,
        showCancelButton: false,
      });

      const formData = new FormData();
      formData.append('SToken', SToken);
      formData.append('Location', weddingLocation);

      api_update_location(formData)
        .then(res => {
          const result = res.data;
          if(result.Msg === 'OK') {
            location.href="edm.html";
          }
        })
        .catch(err => {
          MySwal.fire('無法檢視', err, 'error');
        });
    }
  }

  return (
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
                <h1 className="mbr-fonts-style mbr-section-title mbr-white mbr-bold align-center display-2">Step 5 : 預計婚禮地點</h1>
              </div>

              <div className="input-form">
                <form className="mbr-form form-with-styler">
                  <div className="form-group d-flex justify-content-between">
                    <input type="text" className="form-control display-7" placeholder="請輸入婚宴場地 ex: OO大飯店 , 自家" value={weddingLocation} onChange={(e) => {handleWeddingLocation(e)}} />
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
  );
}

export default PageLocation;
