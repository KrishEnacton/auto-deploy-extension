import { refreshExtensionData } from '../../common/dataProvider';
import { clearStorage } from '../../common/utils_global';
import { config } from '../../config';

export const onInstalled = () => {
  chrome.storage.local.set({ theme: config.themeMode });
  chrome.tabs.create({ url: config.welcome_url });
  refreshExtensionData();
  clearStorage();
};
