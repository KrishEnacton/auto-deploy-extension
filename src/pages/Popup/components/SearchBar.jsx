import React, { useState } from 'react';

const SearchBar = ({ searchString, setSearchString, clearString }) => {
  return (
    <div>
      {searchString.length > 0 ? <button onClick={clearString}>Clear</button> : ''}{' '}
      <input type="text" name="search" value={searchString} onChange={setSearchString} />
    </div>
  );
};

export default SearchBar;
