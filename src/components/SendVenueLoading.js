import React from 'react';
import VenueLoadingImgRed from '../images/modal/modal_venue_loading-red.png';
import VenueLoadingImgYellow from '../images/modal/modal_venue_loading-yellow.png';
import VenueLoadingImgBlue from '../images/modal/modal_venue_loading-blue.png';
import VenueLoadingImgPurple from '../images/modal/modal_venue_loading-purple.png';

const SendVenueLoading = (props) => {
  console.log(props);
  const theme = props.theme ? props.theme : '';
  let img = '';
  switch(theme) {
    case 'red':
      img = VenueLoadingImgRed;
      break;
    case 'yellow':
      img = VenueLoadingImgYellow;
      break;
    case 'purple':
      img = VenueLoadingImgPurple;
      break;
    case 'blue':
      img = VenueLoadingImgBlue;
      break;
  }

  return (
    <div>
      <img src={img} alt="婚禮準備中" title="婚禮準備中" />
    </div>
  );
}

export default SendVenueLoading;