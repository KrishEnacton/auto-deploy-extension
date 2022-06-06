import { refreshExtensionData } from '../../common/dataProvider';
import { clearStorage } from '../../common/utils_global';

export const onStartup = () => {
  refreshExtensionData();
  clearStorage();
};
