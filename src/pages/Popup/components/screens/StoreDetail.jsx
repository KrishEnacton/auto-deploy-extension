import React, { useEffect, useState } from 'react';
import { api } from '../../../../common/apiService';
import { getCashbackActivationInfoFromStorage } from '../../../../common/dataProvider';
import { getConstructedCashback, returnLangParam, translate } from '../../../../common/utils_global';
import { config } from '../../../../config';

const StoreDetail = ({ storeDetails }) => {
  const [loader, setLoader] = useState(false);
  const [storeData, setStoreData] = useState();

  useEffect(() => {
    getStoreDetails(storeDetails.id, storeDetails.tab);
    return () => {};
  }, []);

  function getStoreDetails(store_id, tab) {
    setLoader(true);
    chrome.storage.local.get(['lang'], (result) => {
      let tab_id = tab.id;
      api.get('/public/storeInfo/' + store_id).then((store_info) => {
        let body = {
          perPage: 1000,
          cat: [],
          order: 'latest',
          page: 1,
          show: 'all',
          store: [store_id],
        };
        api.post('/public/coupons', body).then((coupon_res) => {
          let cashback_rates_more_than_4 = store_info.data.cashback.length > 4;
          let cashback_amount = store_info.data.cashback_string;
          let cashback_rates = store_info.data.cashback;
          cashback_rates.forEach((e) => {
            e.cashback_amount = getConstructedCashback(e.rate_type, e.cashback);
          });
          getCashbackActivationInfoFromStorage().then((res) => {
            let is_cashback_enabled = false;
            let _cashback_tabs = res.cashback_tabs
              ? res.cashback_tabs[store_info.data.domain_name]
                ? res.cashback_tabs[store_info.data.domain_name]
                : []
              : [];
            let lang = returnLangParam(result.lang);
            let store_out_url = `${config.app_url}${lang}out/store/${store_id}?url=${tab.url}`;
            let coupons = coupon_res.data.coupons;
            coupons.forEach((e) => {
              e.cashback_string = e.store.cashback_string;
              e.href = `${config.app_url}${lang}out/coupon/${e.id}`;
            });
            let is_coupons_available = coupons.length > 0;
            let trip_id = res.trip_info
              ? res.trip_info[store_info.data.domain_name]
                ? res.trip_info[store_info.data.domain_name].trip_id
                : ''
              : '';
            let trip_tab_id = res.trip_info
              ? res.trip_info[store_info.data.domain_name]
                ? res.trip_info[store_info.data.domain_name].tab_id
                : ''
              : '';
            if (trip_id && (_cashback_tabs.includes(tab_id) || trip_tab_id === tab_id) && store_info.data.cashback_enabled) {
              is_cashback_enabled = true;
            }
            setLoader(false);
            setStoreData({
              ...store_info.data,
              coupons,
              trip_id,
              is_cashback_enabled,
              cashback_amount,
              cashback_rates_more_than_4,
              cashback_rates,
              store_out_url,
              is_coupons_available,
            });
          });
        });
      });
    });
  }
  console.log('storeData:', storeData);
  return (
    <div>
      StoreDetail
      {loader ? (
        'loading...'
      ) : (
        <>
          <img src={storeData?.logo} alt="" height={25} width={25} />
          {storeData?.cashback_enabled ? (
            storeData?.is_cashback_enabled ? (
              <>
                {' '}
                <div>
                  <span className="chk-icon mr-1">&#x2713;</span>
                  <span>
                    {translate('shopping_trip')} #{storeData?.trip_id}
                  </span>
                </div>
                <div className="st-cashback">
                  <p className="mb-0">{storeData?.cashback_amount}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <a target="_blank" className="btn secondary-btn" href={storeData?.store_out_url}>
                    {translate('activate')} {translate('cashback')}
                  </a>
                </div>
              </>
            )
          ) : null}
          {storeData?.cashback_rates?.length
            ? storeData?.cashback_rates.map((item, index) => {
                return (
                  <div key={index} className="col-6 cb-rates-card clearfix border-left border-bottom px-2 py-1">
                    <span className="float-left cat-title">{item.title}</span>
                    <span className="primary-text float-right cat-cb">{item.cashback_amount}</span>
                  </div>
                );
              })
            : null}
          {storeData?.is_coupons_available ? <h2 className="st-offers-wrapper-title">{translate('store_offers')}</h2> : null}
          {storeData?.coupons?.map((item, index) => {
            return (
              <>
                <div className="row border-bottom pb-2 mb-2">
                  <div className="col-12">
                    <p className="mb-1 offer-title">{item.title}</p>
                    <div className="collapse" id={`cpn-desc-collapse-=${item.id}`}>
                      <div className="card mb-2 cpn-disc-card border-0 px-0">{item.description}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <span className="st-cb cb-color d-block mb-2">{item.cashback_string}</span>
                  </div>
                  <div className="col-6 text-right">
                    <a
                      className="show-disc d-block mb-2"
                      data-toggle="collapse"
                      role="button"
                      aria-expanded="false"
                      id={`#cpn-desc-collapse-${item.id}`}
                      aria-controls={`cpn-desc-collapse-${item.id}`}
                      onClick={(e) => {
                        let desc_tag = document.getElementById(`#cpn-desc-collapse-${item.id}`);
                        let desc_div = document.getElementById(`cpn-desc-collapse-${item.id}`);
                        if (desc_tag.attributes['aria-expanded'].value === 'false') {
                          desc_tag.attributes['aria-expanded'].value = true;
                          desc_tag.classList.remove('collapsed');
                          desc_div.classList.add('show');
                        } else {
                          desc_tag.attributes['aria-expanded'].value = false;
                          desc_tag.classList.add('collapsed');
                          desc_div.classList.remove('show');
                        }
                      }}
                    ></a>
                  </div>

                  <div className="col-6">
                    {item.code ? (
                      <div className="cpn-code-wrap">
                        <div
                          className="cpn-code"
                          id="store_detail_copy"
                          code={item.code}
                          onClick={() => add_to_clipboard(item.code)}
                        >
                          <span className="px-1 mr-1">{item.code}</span>
                          <span className="copy-ico">
                            <svg
                              width="1em"
                              height="1em"
                              viewBox="0 0 16 16"
                              className="bi bi-clipboard"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
                              />
                              <path
                                fill-rule="evenodd"
                                d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="col-6 text-right">
                    <a href={item.href} target="_blank" className="btn primary-btn" id="store-detail-shop-now" rel="noreferrer">
                      {translate('shop_now')}
                    </a>
                  </div>
                </div>
              </>
            );
          })}
        </>
      )}
    </div>
  );
};

export default StoreDetail;
