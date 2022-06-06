import React from 'react';
import { translate } from '../../../common/utils_global';

const StoreCard = ({ item }) => {
  return (
    <div>
      <img src={item.logo} alt={item.name} height={10} width={10} />
      {item.name}
      {item.cashback_string}
      <a href={item.href} target="_blank" rel="noopener noreferrer">
        {translate('shop_now')}
      </a>
    </div>
  );
};

export default StoreCard;
