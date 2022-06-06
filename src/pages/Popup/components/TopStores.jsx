import React, { useEffect, useState } from 'react';
import { getTopStoresFromStorage } from '../../../common/dataProvider';
import { searchThisStore } from '../../../common/utils_global';
import NoDataFound from './NoDataFound';
import SearchBar from './SearchBar';
import StoreCard from './StoreCard';

const TopStores = () => {
  const [topStores, setTopStores] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    getTopStoresFromStorage().then((data) => {
      setTopStores(data);
    });
    return () => {};
  }, []);

  const searchOnChange = (e) => {
    setSearchString(e.target.value);
    searchThisStore(e.target.value).then((data) => {
      setSearchResult(data);
    });
  };

  const clearString = () => {
    setSearchString('');
  };

  const ReturnStore = () => {
    if (searchString.length > 0) {
      if (searchResult.length > 0) {
        return (
          <div>
            Search Result: {searchString}
            {searchResult.map((item, index) => {
              return <StoreCard item={item} key={index} />;
            })}
          </div>
        );
      } else {
        return <NoDataFound />;
      }
    } else {
      return topStores.map((item, index) => {
        return <StoreCard item={item} key={index} />;
      });
    }
  };

  return (
    <div>
      <SearchBar searchString={searchString} setSearchString={searchOnChange} clearString={clearString} />
      <ReturnStore />
    </div>
  );
};

export default TopStores;
