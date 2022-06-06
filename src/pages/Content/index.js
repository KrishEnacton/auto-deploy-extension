import { config } from '../../config';
import { addLinksGoogle } from './googleSERPScript';
import { renderCashbackActivatedPopup, renderCashbackActivatePopup } from './injectActivateCashback';

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  let app_reg = new RegExp(config.app_reg);
  let out_reg = new RegExp(config.app_out_url);
  if (app_reg.test(window.location.href) && out_reg.test(window.location.href)) {
    let th = document.getElementsByTagName('body')[0];
    let injectSc = document.createElement('script');
    let filePath = chrome.runtime.getURL('injectTripInfoScript.js');
    injectSc.setAttribute('type', 'text/javascript');
    injectSc.setAttribute('src', filePath);
    th.appendChild(injectSc);
    setTimeout(() => {
      let event = new CustomEvent('LBP_GET_TRIP_INFO');
      window.dispatchEvent(event);
    }, 1000);
  }
  window.addEventListener('message', (event) => {
    if (event.data.action === 'SAVE_TRIP_INFO') {
      const { payload } = event.data;
      let trip_info = {
        cashback_activated: payload.cashback_activated,
        click_data: payload.click_data,
      };
      chrome.runtime.sendMessage({
        from: 'Content/index.js',
        action: 'SAVE_TRIP_INFO',
        data: trip_info,
      });
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'show_cashback_activated_popup') {
    renderCashbackActivatedPopup(request.data);
  }
  if (request.action === 'show_cashback_activate_popup') {
    renderCashbackActivatePopup(request.data);
  }
  if (request.action === 'google_serp_script') {
    addLinksGoogle();
  }
});
