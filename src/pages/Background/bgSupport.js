import { api } from '../../common/apiService';
import {
  addCashbackUpdatedDataToStorage,
  getCashbackActivationInfoFromStorage,
  getUserInfoFromStorage,
} from '../../common/dataProvider';
import { getConstructedCashback, returnLangParam } from '../../common/utils_global';
import { config } from '../../config';

export function handleMerchantPage(store, tab) {
  chrome.storage.local.get(['lang'], function (result) {
    let lang = returnLangParam(result.lang);
    store.out_url = `${config.app_url}${lang}out/store/${store.id}?url=${tab.url}`;
    handleInjectPopupType(store, tab);
  });
}

export function handleInjectPopupType(store_info, tab) {
  getCashbackActivationInfoFromStorage().then((cb_activation_data) => {
    getUserInfoFromStorage().then((res) => {
      chrome.cookies.getAll({ url: tab.url }, function (cookies) {
        var trip_info = cb_activation_data.trip_info || {};
        var cashback_tabs = cb_activation_data.cashback_tabs || {};
        var store_trip_info = trip_info[store_info.domain_name] || {};
        var store_cashback_tabs = cashback_tabs[store_info.domain_name] || [];
        var tab_check = store_cashback_tabs.indexOf(tab.id) > -1 || tab.referrer.length > 1;
        var hide_activate_button = false;
        var cookie_trip_id = null;
        var cookie = '';
        var hide_activated = false;
        store_info.tabId = tab.id;
        chrome.storage.local.get(['url', 'domain', 'value', 'name', 'isSafari', 'hide_activated_popup'], (result) => {
          if (
            result.hide_activated_popup?.domain_name === store_info.domain_name &&
            result.hide_activated_popup?.tabId === tab.id
          ) {
            hide_activated = true;
          }

          //   for (cookie in cookies) {
          //     if (cookies[cookie].name === config.hide_activate_button_popup_cookie_name && cookies[cookie].value) {
          //       hide_activate_button = true;
          //     } else if (cookies[cookie].name === config.activated_popup_id_cookie_name) {
          //       cookie_trip_id = cookies[cookie].value;
          //       hide_activated = true;
          //     }
          //   }
          if (res.member_info && tab_check && store_trip_info.store_id === store_info.id) {
            if (tab.id === store_trip_info.tab_id && cookie_trip_id !== store_trip_info.trip_id && !hide_activated) {
              chrome.tabs.sendMessage(tab.id, {
                from: 'bg_support_functions',
                action: 'show_cashback_activated_popup',
                data: { ...store_info, trip_id: store_trip_info.trip_id },
              });
              chrome.storage.local.set({
                url: tab.url,
                domain: store_trip_info.domain_name,
                value: store_trip_info.trip_id.toString(),
                name: config.activated_popup_id_cookie_name,
              });
            }
            let activated_tabIds = [...store_cashback_tabs, tab.id];
            cashback_tabs[store_info.domain_name] = [...new Set(activated_tabIds)];
            addCashbackUpdatedDataToStorage(trip_info, cashback_tabs);
          } else if (
            (store_trip_info.tab_id !== tab.id || !tab_check || cookie_trip_id !== store_trip_info.trip_id) &&
            !hide_activate_button &&
            !isLinkAffiliated() &&
            !hide_activated
          ) {
            chrome.tabs.sendMessage(tab.id, {
              from: 'bg_support_functions',
              action: 'show_cashback_activate_popup',
              data: store_info,
            });
          }
        });
      });
    });
  });
}

export function handleCheckOutPage(store, tab) {
  getUserInfoFromStorage().then((res) => {
    if (res.member_info) {
      let body = {
        cat: [],
        order: 'latest',
        page: 1,
        show: 'all',
        perPage: 10000,
        store: [store.id],
      };
      api.get('/public/storeInfo/' + store.id).then((store_info) => {
        if (store_info.success && !store_info.error) {
          let max_rate = Math.max(...store_info.data.cashback.map((e) => Number(e.cashback)));
          let max_amount = store_info.data.cashback.filter((e) => e.cashback === max_rate);
          let max_amount_st = max_amount[0];
          let rate_string = '';
          if (max_amount_st) {
            rate_string = getConstructedCashback(max_amount_st.rate_type, max_amount_st.cashback);
          }
          api.post('/public/coupons', body).then((res) => {
            chrome.tabs.sendMessage(tab.id, {
              from: 'bg_support_functions',
              action: 'show_apply_coupon_popup',
              data: {
                rate_string,
                ...store_info.data,
                coupons: res.data.coupons,
                total_coupons: res.data ? (res.data.coupons ? res.data.coupons.length : 0) : 0,
              },
            });
          });
        }
      });
    }
  });
}

export function isLinkAffiliated() {
  var is_affiliated;
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var tab = tabs[0];
    if (tab) {
      var curr_url = tabs[0].url;
      var query_string = curr_url.substring(curr_url.indexOf('?'), curr_url.length);
      chrome.storage.local.get('settings', (result) => {
        var array = result?.settings?.aff_link_params?.split(',');
        array?.some((element) => {
          is_affiliated = query_string.includes(element);
          return is_affiliated;
        });
      });
    }
  });
  return is_affiliated;
}
