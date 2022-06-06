import { api } from '../../common/apiService';
import { getUserDashboard, isMerchantPage } from '../../common/dataProvider';
import { setCouponCountBadge } from '../../common/utils_global';
import { config } from '../../config';
import { handleCheckOutPage, handleMerchantPage } from './bgSupport';

export const onUpdated = (tab_info, change_info, tab) => {
  if (change_info.status === 'complete') {
    var matching_app_url = new RegExp(config.app_reg);
    if (matching_app_url.test(tab.url)) {
      setTimeout(() => {
        chrome.cookies.getAll({ url: tab.url }, function (cookies) {
          let cry_user_token;
          let user_id;
          let lang;
          user_id = cookies.filter((a) => a.name === 'user_id')?.[0]?.value;
          cry_user_token = cookies.filter((a) => a.name === 'cry_user_token')?.[0]?.value;
          lang = cookies.filter((a) => a.name === 'lang')?.[0]?.value;
          chrome.storage.local.set({ lang: lang });
          if (user_id && cry_user_token) {
            chrome.storage.local.get('user_token', (result) => {
              if (!result.user_token) {
                api
                  .post('/auth/cookdLogin', {
                    cry_user_token,
                    user_id: Number(user_id),
                  })
                  .then((res) => {
                    chrome.storage.local.set({ user_token: res.data });
                    getUserDashboard(res.data);
                  });
              }
            });
          } else {
            chrome.storage.local.remove(['user_token', 'user_info']);
          }
        });
      }, 100);
    }

    googleSERP(tab);
  }
  isMerchantPage(tab.url).then((res) => {
    let google_regex = new RegExp('google.com');
    let check_out_regex = new RegExp(res.checkout_url);
    if (res.checkout_url && check_out_regex.test(tab.url) && res.id) {
      handleCheckOutPage(res, {
        ...tab,
        referrer: tab,
      });
    } else if (res.id && res.cashback_enabled && !google_regex.test(tab.url)) {
      handleMerchantPage(res, {
        ...tab,
        referrer: tab,
      });
    }
  });
};

const googleSERP = (tab) => {
  let google_regex = new RegExp('google.com');
  if (google_regex.test(tab.url)) {
    chrome.tabs.sendMessage(tab.id, {
      from: 'bg/index.js',
      action: 'google_serp_script',
    });
  }
};
