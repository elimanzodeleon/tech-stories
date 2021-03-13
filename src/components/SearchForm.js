import React from 'react';
import Input from './Input';
import { ReactComponent as Search } from '../images/search.svg';
import { ReactComponent as Left } from '../images/left.svg';
import { ReactComponent as Right } from '../images/right.svg';

const SearchForm = ({
  handleInputChange,
  handleSearchSubmit,
  handlePrevClick,
  handleNextClick,
  urlsState,
  searchTerm,
  className,
}) => {
  // DUMMY FOR NOW
  const mostRecent = urlsState.isMostRecentUrl; // bool if our current url is our most recent searchTerm
  const currUrlIndex = urlsState.currUrlIdx; // keep track of where we currently are in the search history
  // END DUMMY

  return (
    <div className=''>
      <form onSubmit={handleSearchSubmit} className='search-form'>
        <Input
          value={searchTerm}
          handleInputChange={handleInputChange}
          searchTerm={searchTerm}
        >
          e.g. twitter
        </Input>
        <button
          onClick={handleSearchSubmit}
          disabled={!searchTerm}
          className={`util-button ${className}`}
        >
          <Search height='18px' width='18px' />
        </button>
      </form>
      <div className='button-history-container'>
        <button
          className={
            currUrlIndex !== 0 ? 'util-button' : 'util-button button-hide'
          }
          onClick={handlePrevClick}
        >
          <Left height='18px' width='18px' />
        </button>

        <button
          className={!mostRecent ? 'util-button' : 'util-button button-hide'}
          onClick={handleNextClick}
        >
          <Right height='18px' width='18px' />
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
