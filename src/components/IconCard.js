import React from 'react';

const IconCard = (props) => {
  const title = props.title;
  let isArray = false;
  let titles = [];

  if(Array.isArray(title)) {
    isArray = true;
    titles = title.map((item, index) => <span key={index}>{item}</span>); 
  }
  
  return (
    <div className="icon-card col-6 col-md-3 align-center my-3">
      <div className="icon-block p-4 wp_frame_top">
        {props.children}
      </div>
      <h5 className="mbr-fonts-style display-7 wp_frame_bottom p-10 d-flex flex-column">
        {isArray ? titles : title }
      </h5>
    </div>
  );
}

export default IconCard;