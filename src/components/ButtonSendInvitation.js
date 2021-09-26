import React from 'react';

const ButtonSendInvitation = (props) => {
  const {isBatchProcess, isSticker} = props;

  return (
    <section className="mbr-section content5 mbr-parallax-background">
      <div className="mbr-overlay overlay-40"></div>
      <nav className="navbar fixed-bottom justify-content-center d-flex row mx-auto position-fixed container main p-0">
        {isBatchProcess === false && <a className="btn btn-3d btn-block px-0 text-light" onClick={props.sendAll}>批次全部發送</a>} {/** v-on:click="SendAll" */}{/** v-if="IsBatchProcess == false" */}
        {isSticker && <a className="btn btn-3d btn-block px-0 text-light" onClick={props.saveSticker}>送出索取</a>}
        <a href="main.html" className="btn btn-3d btn-block px-0 text-light">回上一頁</a>
      </nav>
    </section>
  );
}

export default ButtonSendInvitation;