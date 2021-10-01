import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Loading from '../../components/Loading';

import { _uuid } from '../../utils/tools';
import { 
  api_query_invite_card_setup,
  api_update_active_invite_card_setup
} from '../../utils/api';

import '../../scss/edm.scss';

const MySwal = withReactContent(Swal);

const EDM = (props) => {
  const { SToken } = props;

  const orderInfo = useSelector(state => state.orderInfo);

  const [isUpload, setIsUpload] = useState(0);
  const [ident, setIdent] = useState('');

  useEffect(() => {
    if(orderInfo) {
      const isUpload = (orderInfo.UserUpload_Photo !== null) ? 1 : 0;
      setIsUpload(isUpload);
      setIdent(orderInfo.Ident);
    }
  }, [orderInfo]);

  const [inviteCard, setInviteCard] = useState([]);

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

    const initEDM = async () => {
      const formData = new FormData();
      formData.append('SToken', SToken);

      try {
        const inviteCardSetup = await api_query_invite_card_setup(formData);

        if(inviteCardSetup.data && inviteCardSetup.data.Msg === 'OK') {
          const resInviteCardSetup = inviteCardSetup.data.InviteCard;
          setInviteCard([...resInviteCardSetup]);
          MySwal.close();
        } else {
          MySwal.fire('Oops...', '系統發生錯誤', 'error');
        }
      } catch(err) {
        console.log(err);
        MySwal.fire('Oops...', '系統發生錯誤', 'error');
      };
    }
    
    initEDM();
  }, []);
  
  // 處理過的資料
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const handleNext = () => {
    if((index + 1) >= inviteCard.length) {
      return ;
    }
    
    setIndex(index + 1);
  }

  const handlePrev = () => {
    if(index <= 0) {
      return ;
    }
    setIndex(index - 1);
  }

  // 下一步
  const handleGoNext = () => {
    const ActiveID = inviteCard[index].ID;

    MySwal.fire({
      title: "處理中，請稍候",
      html: <Loading />,
      customClass: {
        popup: 'bg-white'
      },
      showConfirmButton: false,
      showCancelButton: false,
      confirmButtonColor: "#713f94",
    });
    
    setTimeout(function(){
      const sendActiveInviteCardSetup = async () => {
        const formData = new FormData();
        formData.append('SToken', SToken);
        formData.append('InviteCardSetupID', ActiveID);
        const res = await api_update_active_invite_card_setup(formData);

        if(res.data && res.data.Msg === 'OK') {
          props.goNextPage('SendDemo');
          MySwal.close();
        } else {
          console.log('err');
          MySwal.fire("Error", data.Msg, "error");
        }
      }

      sendActiveInviteCardSetup();
    }, 500);
  }

  // file uploaod
  const UploadVideo = (columnName) => {
    document.getElementById(columnName).click();
  }

  // file upload
  const fileUpload = (columnName) => {
    const msgTitle = "上傳中請稍候";
    const msgOK = "上傳成功";
    const msgError = "上傳失敗";

    //取得該filebox中的檔案資料：
    const files = document.getElementById(columnName).files;

    if (files.length < 0) MySwal.fire(msgError, "", "error");
    //用JQ也可以寫成：
    // var files = $('#'+id)[0].files;

    const TargetFileName = _uuid() + "." + files[0].name.split('.').pop();
    //再來將剛剛取得的檔案資料放進FormData裡
    const fileData = new FormData();
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

    setTimeout(function () {
      fileData.append('SToken', SToken);
      fileData.append(files[0].name, files[0]);

      //之後送ashx做處理
      $.ajax({
        url: "http://backend.wedding-pass.com/WebService_SF_WEDDING_PASS_UploadPhotoToCreateInviteCard.ashx",
        type: "post",
        data: fileData,
        contentType: false,
        processData: false,
        async: true,
        success: function (data) {
          if (data.Msg == "OK") {
            MySwal.fire(msgOK, "", "success");
            setIsUpload(isUpload + 1);
          } else {
            MySwal.fire(msgError, "", "error");
          }
        }
      });
    }, 500);
  }

  return (
    <section className="wrapper-s bg-pic-edm">
      <div className="mbr-overlay opacity-40"></div>
      <Container className="pb-2">
        <div className="media-container-row">
          <Col xs={12} md={8} className="title text-center">
            <h3 className="mbr-section-subtitle align-center mbr-white mbr-light pb-0 mbr-fonts-style display-2">
              {orderInfo.LeadingStatus === 9 
              ? <strong>選擇您的電子喜帖</strong>
              : <strong>Step 5. 產生您的電子喜帖</strong>
              }
            </h3>

            <Carousel indicators={false} interval={null} controls={false} activeIndex={index} onSelect={handleSelect} className="carousel slide">
              {inviteCard.map(item => (
                <Carousel.Item className="carousel-item" key={item.ID}>
                  <div className="item" style={{height: '43vh'}}>
                    <div className="polaroid">
                      {isUpload === 0 ?
                      <img className="sliderImage" style={{height: '100%'}} src={item.Img} /> :
                      <img className="sliderImage" style={{height: '100%'}} src={`http://backend.wedding-pass.com/WeddingPass/inviteCard_Order/${ident}/${item.ID}/_preview.jpg`} />
                      }
                    </div>
                  </div>
                </Carousel.Item>
              ))}

              <a className="carousel-control carousel-control-prev" onClick={(e) => handlePrev()}>
                <span className="carousel-control-prev-icon"></span>
                <span className="sr-only">Previous</span>
              </a>
                  
              <a className="carousel-control carousel-control-next" onClick={(e) => handleNext()}>
                <span className="carousel-control-next-icon"></span>
                <span className="sr-only">Next</span>
              </a>
            </Carousel>
          </Col>
        </div>
        <div className="w-100 d-flex justify-content-center mt-05">
          <Col xs={12}>
            <button className="btn btn-3d btn-block px-0" onClick={() => UploadVideo('upload_img')}>上傳婚紗照</button>
            <input hidden disabled={false} name="file" type="file" id="upload_img" accept="image/png, image/jpeg" onChange={() => fileUpload('upload_img')} />
          </Col>
        </div>

        {orderInfo.LeadingStatus === 9 && isUpload !== 0 &&
        <div className="w-100 d-flex justify-content-center mt-05">
          <Col xs={12}>
            <button type="button" className="btn btn-3d btn-block" tabIndex="-1" onClick={() => handleGoNext()}>下一步</button>
          </Col>
        </div>}
      </Container>
    </section>
  );
}

export default EDM;

