import React from 'react';

const ActivatePopup = ({ data }) => {
  const closeActivatePopup = () => {
    chrome.storage.local.set({
      hide_activated_popup: {
        domain_name: data.domain_name,
        tabId: data.tabId,
      },
    });
    document.querySelector('#cb_activate_popup').remove();
  };
  return (
    <div style={{ position: 'fixed', top: 25, right: 25, backgroundColor: 'yellow', zIndex: 99999999 }}>
      ActivatePopup
      <div onClick={closeActivatePopup}>Close</div>
    </div>
  );
};

export default ActivatePopup;
