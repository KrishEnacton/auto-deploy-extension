import React from 'react';
import { addToClipboard, translate } from '../../../common/utils_global';

const OfferCard = ({ item }) => {
  return (
    <div>
      <img height={10} width={10} src={item.store.logo} alt={item.title} />
      {item.title}
      {item.description}
      {item.cashback_string}
      {item.code ? <div onClick={() => addToClipboard(item.code)}>{item.code}</div> : ''}
      <a href={item.href} target="_blank" rel="noreferrer">
        {translate('shop_now')}
      </a>
    </div>
  );
};

export default OfferCard;
