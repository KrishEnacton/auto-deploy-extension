import { config } from '../config';
import { api } from './apiService';
import { returnLangParam } from './utils_global';

export const refreshExtensionData = () => {
  addExtensionSettingsToStorage();
  addAllStoresToStorage();
  addTopOffersToStorage();
  addTopStoresToStorage();
  addBonusesToStorage();
};

export const getUserDashboard = (token) => {
  return new Promise((resolve) => {
    if (token) {
      api
        .get('/user/dashboard', {
          Authorization: `Bearer ${token}`,
        })
        .then((data) => {
          chrome.storage.local.set({ user_info: data });
          resolve(data);
        });
    } else {
      resolve(false);
    }
  });
};

export const addAllStoresToStorage = () => {
  try {
    api.get('/public/exStores').then((res) => {
      if (res.success && !res.error) {
        let stores = res.data;
        for (const key in stores) {
          if (stores.hasOwnProperty(key)) {
            stores[key].domain_name = key;
          }
        }
        chrome.storage.local.set({
          all_stores: res.data,
          all_stores_timestamp: new Date().valueOf(),
        });
      } else {
        throw 'all_stores_api_error' + res.msg;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const addTopOffersToStorage = () => {
  try {
    api.get('/public/topCoupons').then((res) => {
      if (res.success && !res.error) {
        chrome.storage.local.set({
          top_offers: res.data,
        });
      } else {
        throw 'top_stores_api_error' + res.msg;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const addTopStoresToStorage = () => {
  try {
    api.get('/public/topStores').then((res) => {
      if (res.success && !res.error) {
        chrome.storage.local.set({
          top_stores: res.data,
        });
      } else {
        throw 'top_stores_api_error' + res.msg;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const addExtensionSettingsToStorage = () => {
  try {
    api.get('/public/exSettings').then((res) => {
      if (res.success && !res.error) {
        chrome.storage.local.set({
          settings: res.data,
        });
      } else {
        throw 'settings_api_error' + res.msg;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const addBonusesToStorage = () => {
  try {
    api.get('/public/bonusTypes').then((res) => {
      if (res.success && !res.error) {
        chrome.storage.local.set({
          bonus_types: res.data,
        });
      } else {
        throw 'bonus_api_error' + res.msg;
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const getTopStoresFromStorage = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['top_stores', 'lang'], function (result) {
      let lang = returnLangParam(result.lang);
      if (result.top_stores) {
        let stores = result.top_stores;
        stores.forEach((e) => {
          e.href = `${config.app_url}${lang}out/store/${e.id}`;
        });
        resolve(stores);
      } else {
        refreshExtensionData();
        reject();
      }
    });
  });
};

export const getTopOffersFromStorage = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['top_offers', 'lang'], function (result) {
      if (result.top_offers) {
        let offers = result.top_offers;
        let lang = returnLangParam(result.lang);
        offers.forEach((e) => {
          e.href = `${config.app_url}${lang}out/coupon/${e.id}`;
          if (e.store.cashback_enabled) {
            e.cashback_string = e.store.cashback_string;
          } else {
            e.cashback_string = '';
          }
        });
        resolve(offers);
      } else {
        refreshExtensionData();
        reject();
      }
    });
  });
};

export const getUserInfoFromStorage = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['user_info', 'settings', 'lang', 'bonus_types'], function (result) {
      if (result.user_info) {
        let member_info = result.user_info.user;
        let earning = result.user_info.data.earning;
        let settings = result.settings;
        let lang = returnLangParam(result.lang);
        let referral_url = `${config.app_url}${lang}signup?referral=${member_info ? member_info.referral_code : ''}`;
        let currency_info = {
          currency_prefix: settings.currencies.default.display_as === 'prefix' ? settings.currencies.default.symbol : '',
          currency_suffix: settings.currencies.default.display_as === 'suffix' ? settings.currencies.default.symbol : '',
        };
        let user_initials = member_info.first_name.substring(0, 2).toUpperCase();
        earning.reward.pending = Number(earning.reward.pending).toFixed(2);
        earning.paid.reward = Number(earning.paid.reward).toFixed(2);
        earning.reward.total = Number(earning.reward.total).toFixed(2);
        earning.cashback.total = Number(earning.cashback.total).toFixed(2);
        earning.confirmed_cashback_amount = (Number(earning.cashback.confirmed) - Number(earning.paid.cashback)).toFixed(2);
        earning.confirmed_reward_amount = (Number(earning.reward.confirmed) - Number(earning.paid.reward)).toFixed(2);
        member_info.member_since = new Date(member_info.created_at).toLocaleDateString(member_info.lang, config.options);
        let total_amount = earning.total.cashback + earning.total.reward - earning.total.paid;
        earning.life_time_earning =
          currency_info.currency_prefix + Number(total_amount).toFixed(2) + ' ' + currency_info.currency_suffix;
        let urls = {
          site_url: config.app_url,
          referral_url,
          referral_percent: settings.referral_percent,
          cashback_payment: config.app_url + lang + config.user_prefix + '/' + config.user_cashback_payment,
          refer_n_earn_activity: config.app_url + lang + config.user_prefix + '/' + config.refer_earn,
          missing_payment: config.app_url + lang + config.user_prefix + '/' + config.user_missing_cashback,
          cashback_activity: config.app_url + lang + config.user_prefix + config.activities_prefix + config.cashback_prefix,
          log_out: config.app_url + lang + config.logout_url,
          log_in: config.app_url + lang + config.login_url,
          facebook_share_url: 'https://www.facebook.com/sharer.php?u=' + referral_url,
          twitter_share_url: 'https://twitter.com/intent/tweet?url=' + referral_url,
          whats_app_url: 'https://api.whatsapp.com/send?text=' + referral_url,
          how_it_works: config.app_url + lang + settings.page_urls['refer_earn'],
        };
        resolve({
          member_info,
          urls,
          currency_info,
          earning,
          bonus_types: result.bonus_types,
          user_initials,
        });
      } else {
        let lang = returnLangParam(result.lang);
        resolve({
          urls: {
            log_in: config.app_url + lang + config.login_url,
          },
        });
      }
    });
  });
};

export function isMerchantPage(web_url) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['all_stores', 'stores_domain_list', 'all_stores_timestamp'], function (result) {
      let all_stores = result.all_stores;
      let today = new Date().valueOf();
      let day_ago = today - 60 * 60 * 24 * 1000;
      if (result.all_stores && result.all_stores_timestamp && result.all_stores_timestamp < day_ago) {
        refreshExtensionData();
      }
      let all_domains = {};
      if (all_stores) {
        all_domains = Object.keys(all_stores);
      }
      let domain_list = result.stores_domain_list ? result.stores_domain_list : {};
      let store = {};
      let nUrl = new URL(web_url);
      let fullDomain = nUrl.hostname;
      checkFromStorageData(domain_list, fullDomain, all_stores, web_url);
      let domain_name = checkFromStorageData(domain_list, fullDomain, all_stores, web_url);
      if (domain_name) {
        resolve({
          ...all_stores[domain_name],
        });
      } else {
        for (let i = 0; i < all_domains.length; i++) {
          let dt = '([^a-zA-Z0-9~@#$^*()_+={}|\\,?:-])' + all_domains[i];
          if (all_domains[i].includes('*')) {
            dt = '([^a-zA-Z0-9])' + all_domains[i];
          }
          let domainRegex = new RegExp(dt);
          if (domainRegex.test(web_url) && all_domains[i] !== '') {
            let new_domain_list = domain_list[fullDomain] || [];
            new_domain_list.push(all_domains[i]);
            domain_list[fullDomain] = new_domain_list;
            store = {
              ...all_stores[all_domains[i]],
            };
            chrome.storage.local.set(
              {
                stores_domain_list: domain_list,
              },
              function () {}
            );
          }
        }
      }
      resolve(store);
    });
  });
}

export function checkFromStorageData(domain_list, full_domain, web_url) {
  let store = domain_list[full_domain]
    ? domain_list[full_domain].find((e) => {
        let dt = '([^a-zA-Z0-9~@#$^*()_+={}|\\,?:-])' + e;
        if (e.includes('*')) {
          dt = '([^a-zA-Z0-9])' + e;
        }
        let regex = new RegExp(dt);
        return regex.test(web_url);
      })
    : [];
  if (store && store.length > 0) {
    return store;
  } else {
    return false;
  }
}

export const getCashbackActivationInfoFromStorage = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['trip_info', 'cashback_tabs', 'lang'], function (result) {
      if (result) {
        resolve(result);
      }
    });
  });
};

export function addCashbackUpdatedDataToStorage(trip_info, cashback_tabs) {
  chrome.storage.local.set({
    trip_info,
    cashback_tabs,
  });
}
