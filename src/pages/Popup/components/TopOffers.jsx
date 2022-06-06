import React, { useEffect, useState } from 'react';
import { getTopOffersFromStorage } from '../../../common/dataProvider';
import OfferCard from './OfferCard';

const TopOffers = () => {
  const [topOffers, setTopOffers] = useState([]);
  useEffect(() => {
    getTopOffersFromStorage().then((data) => {
      setTopOffers(data);
    });
    return () => {};
  }, []);
  return (
    <div>
      {topOffers.map((item, index) => {
        return <OfferCard item={item} key={index} />;
      })}
    </div>
  );
};

export default TopOffers;
