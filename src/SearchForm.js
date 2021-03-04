import React from 'react';
import Input from './Input';
import { ReactComponent as Search } from './search.svg';

const SearchForm = ({
  value,
  handleInputChange,
  handleSearchSubmit,
  searchTerm,
  className,
}) => {
  return (
    <form onSubmit={handleSearchSubmit} className='search-form'>
      <Input
        value={value}
        handleInputChange={handleInputChange}
        searchTerm={searchTerm}
      >
        search
      </Input>
      <button
        onClick={handleSearchSubmit}
        disabled={!searchTerm}
        className={`button ${className}`}
      >
        <Search height='18px' width='18px' />
      </button>
    </form>
  );
};

export default SearchForm;
