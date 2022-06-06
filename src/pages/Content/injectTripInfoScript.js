window.addEventListener('LBP_GET_TRIP_INFO', () => {
  window.postMessage(
    {
      action: 'SAVE_TRIP_INFO',
      payload: {
        cashback_activated: window.cashback_activated,
        click_data: window.clickData,
      },
    },
    '*'
  );
});
