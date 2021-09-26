import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons";

const HeaderMain = (props) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    if(showMenu) setShowMenu(false);
    else setShowMenu(true);
  }

  return (
    <section className="mbr-first-section">
      <div className="fixed-top ads-news text-center d-flex justify-content-space-between align-items-center">
        <div className="nav-menu-item"></div>
        <a className="full-link">WEDDING PASS</a>
        <div className="nav-menu-item">
          <span className="mobi-nav-right d-md-none" onClick={() => toggleMenu()}>
            <FontAwesomeIcon icon={faBars} className="text-white" />
          </span>
          <ul className={showMenu ? 'nav-option-btns show' : 'nav-option-btns'}>
            <li><button type="button" className="btn btn-link" onClick={() => props.handleLangModalShow()}>語系</button></li>
            <li><button type="button" className="btn btn-link" onClick={() => props.handleLogout()}>登出</button></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default HeaderMain;