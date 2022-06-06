import React from 'react';
import { render } from 'react-dom';
import { returnLangParam } from '../../common/utils_global';
import { config } from '../../config';
import GoogleSERP from './components/GoogleSERP';

export const addLinksGoogle = () => {
  chrome.storage.local.get(function (result) {
    let serp_data = result.settings.google_serp;
    let store = null;
    let link_selection = document.querySelectorAll(serp_data.link_selector);
    if (link_selection.length > 0) {
      let styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = chrome.runtime.getURL('googleSERP.css');
      document.head.append(styleLink);
      link_selection.forEach((item, index) => {
        let href = item.querySelector('a').href;
        let urlParts = href.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/);
        let domain = urlParts[0];
        store = store ? store : result.all_stores[domain];
        let lang = returnLangParam(result.lang);
        if (store && store.cashback_enabled) {
          let regx = new RegExp(`(https?)://(([a-z]*.)${store.domain_name}|${store.domain_name})`);
          if (regx.test(href) && !config.restricted_activate_cashback_inject.includes(store.domain_name)) {
            let cashback_string = store.cashback_string;
            let out_url = `${config.app_url}${lang}out/store/${store.id}`;
            let element = document.createElement('div');
            let existing_id = document.getElementById('serp' + index.toString());

            if (!existing_id) {
              element.id = 'serp' + index.toString();
              render(<GoogleSERP cashback_string={cashback_string} out_url={out_url} />, element);
              item.parentNode.insertAdjacentElement('beforeBegin', element);
            }
          }
        }
      });
    }
  });
};
