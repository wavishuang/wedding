import React from 'react';
import Navbar from 'react-bootstrap/Navbar';

const AddDesktop = function() {
  var deferredPrompt;

  window.addEventListener('beforeinstallprompt', function(e) {
    console.log('beforeinstallprompt Event fired');
    e.preventDefault();

    // Stash the event so it can be triggered later.
    deferredPrompt = e;

    return false;
  });

  const AddToHomeScreen = () => {
    if (deferredPrompt !== undefined) {
      // The user has had a positive interaction with our app and Chrome
      // has tried to prompt previously, so let's show the prompt.
      deferredPrompt.prompt();

      // 看看使用者針對這個 prompt 做了什麼回應
      deferredPrompt.userChoice.then(function (choiceResult) {

        console.log(choiceResult.outcome);

        if (choiceResult.outcome == 'dismissed') {
          console.log('User cancelled home screen install');
        }
        else {
          console.log('User added to home screen');
        }

        // We no longer need the prompt.  Clear it up.
        deferredPrompt = null;
      });
    }
  }

  return (
    <Navbar fixed="bottom" className="add-desktop fixed-bottom d-flex d-lg-none justify-content-center position-fixed container px-0 col-11 col-md-6">
      <div className="mbr-section-btn align-center col-12">
        <button className="btn btn-3d btn-block btn-add-desktop px-0 rounded-sm display-4" onClick={() => AddToHomeScreen()}>加入到手機主畫面</button>
      </div>        
    </Navbar>
  );
}

export default AddDesktop;
