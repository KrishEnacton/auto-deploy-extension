import React from 'react';
import { translate } from '../../../common/utils_global';
import { config } from '../../../config';

const BottomTab = ({ setActiveTab, activeTab }) => {
  return (
    <div>
      {config.tabs.map((item, index) => {
        if (item.isEnable)
          return (
            <div
              key={index}
              onClick={() => setActiveTab(item.id)}
              style={activeTab === item.id ? { backgroundColor: 'red' } : {}}
            >
              {translate(item.title)}
            </div>
          );
      })}
    </div>
  );
};

export default BottomTab;
