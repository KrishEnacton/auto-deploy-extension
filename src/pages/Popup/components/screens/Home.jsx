import React, { useEffect, useMemo, useState } from 'react';
import { translate } from '../../../../common/utils_global';
import { config } from '../../../../config';
import TopOffers from '../TopOffers';
import TopStores from '../TopStores';

const Home = () => {
  const [activeTab, setActiveTab] = useState(101);

  const RenderHomeActiveTab = useMemo(() => {
    switch (activeTab) {
      case 101:
        return <TopStores />;
      case 102:
        return <TopOffers />;
      default:
        return <TopStores />;
    }
  }, [activeTab]);

  return (
    <div className="bg-white dark:bg-black transition-all">
      Home Screen
      {config.home_screen_tabs.map((item, index) => {
        return (
          <div key={index} onClick={() => setActiveTab(item.id)}>
            {translate(item.title)}
          </div>
        );
      })}
      {RenderHomeActiveTab}
    </div>
  );
};

export default Home;
