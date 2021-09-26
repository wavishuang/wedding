import React, { Fragment, useState } from 'react';

import Carousel from 'react-bootstrap/Carousel';

import HeaderNav from '../components/HeaderNav';

import '../scss/base.scss';
import '../scss/index.scss';

const PageIndex = function() {
  const carouselItems = [
    {id: 1, title: 'Intro', subTitle: 'Intro'},
    {id: 2, title: 'Intro2', subTitle: 'Intro2'},
    {id: 3, title: 'Intro3', subTitle: 'Intro3', link: 'start.html', linkText: '開始體驗'}
  ];
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const handleNext = () => {
    if((index + 1) >= carouselItems.length) {
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

  return (
    <Fragment>
      <HeaderNav />
      
      <section className="engine">
        <a href="https://mobirise.info/o">portfolio site templates</a>
      </section>

      <section className="cid-rWGTq5AtD8">
        <div className="full-screen">
          <Carousel interval={null} controls={false} activeIndex={index} onSelect={handleSelect} className="mbr-slider slide">
            {carouselItems.map((item, index) => (
                <Carousel.Item className={`slider-fullscreen-image bg-img bg-img-0${item.id}`} key={item.id}>
                  <div className="container container-slide">
                    <div className="image_wrapper">
                      <div className="mbr-overlay"></div>
                      <Carousel.Caption className="justify-content-center">
                        <div className="col-10 align-center">
                          <h2 className="mbr-fonts-style display-1">{item.title}</h2>
                          <p className="lead mbr-text mbr-fonts-style display-5">{item.subTitle}</p>
                          {item.link && (
                          <div className="mbr-section-btn" buttons="0">
                            <a className="btn display-4 btn-3d rounded-sm" href={item.link}>{item.linkText}</a>
                          </div>)
                          }
                        </div>
                      </Carousel.Caption>
                    </div>
                  </div>
                </Carousel.Item>
              )
            )}
          </Carousel>

          <a className="carousel-control carousel-control-prev" onClick={(e) => handlePrev()}>
            {/*<FontAwesomeIcon icon={faArrowLeft} className="text-white" />*/}
            <span className="mbri-left mbr-iconfont text-white"></span>
            <span className="sr-only">Previous</span>
          </a>
            
          <a className="carousel-control carousel-control-next" onClick={(e) => handleNext()}>
            {/*<FontAwesomeIcon icon={faArrowRight} className="text-white" />*/}
            <span className="mbri-right mbr-iconfont text-white"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </section>
    </Fragment>
  );
}

export default PageIndex;
