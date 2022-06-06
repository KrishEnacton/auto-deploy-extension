import React, { useEffect, useMemo, useState } from 'react';
import { getUserInfoFromStorage, isMerchantPage } from '../../../../common/dataProvider';
import { getThemeFromStorage, setThemeToStorage, set_user_lang } from '../../../../common/utils_global';
import { config } from '../../../../config';
import Styles, { rawSetTheme } from '../../../../style/Styles';
import { ThemeContext, UserContext } from '../../context/UserContext';
import BottomTab from '../BottomTab';
import Header from '../header/Header';
import { SnackBar } from '../SnackBar';
import Home from './Home';
import Profile from './Profile';
import ReferNEarn from './ReferNEarn';
import StoreDetail from './StoreDetail';

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(false);
  const [activeTab, setActiveTab] = useState(config.tabs.filter((a) => a.defaultTab === true)[0].id);
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [theme, setTheme] = useState();
  const [storeDetailsData, setStoreDetailsData] = useState();

  useEffect(() => {
    set_user_lang();
    checkCurrentWebpage();
    getThemeFromStorage().then((data) => {
      setTheme(data);
      rawSetTheme(data);
    });
    setLoading(true);
    getUserInfoFromStorage()
      .then((data) => {
        if (data.member_info) {
          setIsUserLogin(true);
        }
        setUserData(data);
        setLoading(false);
      })
      .catch(() => {
        setUserData('');
        setLoading(false);
      });
  }, []);

  const setThemeToStateNStorage = (theme) => {
    setTheme(theme);
    setThemeToStorage(theme);
    rawSetTheme(theme);
  };

  const checkCurrentWebpage = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
      isMerchantPage(tab[0].url).then((res) => {
        if (res.id) {
          setStoreDetailsData({ id: res.id, tab: tab[0] });
          setActiveTab(4);
        }
      });
    });
  };

  const RenderActiveTab = useMemo(() => {
    switch (activeTab) {
      case 1:
        return <Home />;
      case 2:
        return <ReferNEarn />;
      case 3:
        return <Profile />;
      case 4:
        return <StoreDetail storeDetails={storeDetailsData} />;
      default:
        return <Home />;
    }
  }, [activeTab]);

  return (
    <ThemeContext.Provider value={[theme, setThemeToStateNStorage]}>
      <UserContext.Provider value={[userData, setUserData, loading, isUserLogin]}>
        <Styles />
        <div>
          <Header />

          {RenderActiveTab}
          {activeTab !== 4 ? <BottomTab setActiveTab={setActiveTab} activeTab={activeTab} /> : ''}
          <SnackBar />
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

export default Main;
