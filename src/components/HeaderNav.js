import React from 'react';
import Navbar from 'react-bootstrap/Navbar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from "@fortawesome/free-solid-svg-icons";

const HeaderNav = () => {
  return (
    <section>
      <Navbar fixed="top" className="ads-news">
        <a className="full-link" href="">
          <FontAwesomeIcon icon={faBell} className="mr-2" />最新優惠，這是測試文字，這是測試文字
        </a>
      </Navbar>
    </section>
  );
}

export default HeaderNav;