import { addCashbackUpdatedDataToStorage, getCashbackActivationInfoFromStorage } from '../../common/dataProvider';

export const onMessage = (request, sender, send_response) => {
  if (request.action === 'SAVE_TRIP_INFO' && request.data?.click_data) {
    addOutPageTripInfoToStorage(request.data, sender.tab.id);
  }
};

const addOutPageTripInfoToStorage = (data, tab_id) => {
  if (data.cashback_activated) {
    getCashbackActivationInfoFromStorage().then((res) => {
      let trip_info = res.trip_info ? res.trip_info : {};
      let cashback_tabs = res.cashback_tabs ? res.cashback_tabs : {};
      let activated_store = data.click_data;
      trip_info[activated_store.domain_name] = {
        ...activated_store,
        time_stamp: +new Date(),
        tab_id,
      };
      cashback_tabs[activated_store.domain_name] = [tab_id];
      if (activated_store.cb_status) {
        addCashbackUpdatedDataToStorage(trip_info, cashback_tabs);
      }
    });
  }
};
