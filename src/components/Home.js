import React, { useEffect, useReducer, useCallback } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import List from './List';
import SearchForm from './SearchForm';
import { storiesInitialState, storiesReducer } from '../reducers/stories';
import { urlsInitialState, urlsReducer } from '../reducers/urls';
import { useSemiPersistentState } from '../hooks/useSemiPersistentState';
import { getSearchTermFromUrl, getCompleteUrl } from '../utils/helperFunctions';

const Home = () => {
  // give custom hook a key (e.g. search) so that if this custom hook is used elsewhere
  // it wont overwrite this value in localstorage
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search');
  const [storiesState, storiesDispatch] = useReducer(
    storiesReducer,
    storiesInitialState
  );
  const [urlsState, urlsDispatch] = useReducer(urlsReducer, urlsInitialState);

  // handle user submiting the search form
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const addAtEnd = urlsState.isMostRecentUrl;
    const currUrlReq = getCompleteUrl(searchTerm);

    // only create a new search if the new searchTerm is diff than curr searchTerm
    const prevSearchTerm = getSearchTermFromUrl(
      urlsState.urls[urlsState.currUrlIdx]
    );
    if (searchTerm !== prevSearchTerm) {
      // user created a new search at end of history
      if (addAtEnd) {
        urlsDispatch({
          type: 'ADD_URL_AT_END',
          payload: currUrlReq,
        });
      } else {
        // user created new search after visiting a prev search through history navigator (< >)
        // get prev urls from the point where user created a new search
        const newPrevUrls = urlsState.urls.slice(0, urlsState.currUrlIdx + 1);
        urlsDispatch({
          type: 'ADD_URL_NOT_AT_END',
          payload: { urls: newPrevUrls, url: currUrlReq },
        });
      }
    }
  };

  // update searchTerm state as user enters input
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // handle removal of a story
  const removeItem = (item) => {
    storiesDispatch({ type: 'REMOVE_STORY', payload: item.objectID });
  };

  // get prev url from history
  const handlePrevClick = () => {
    // parse searchterm from url that comes before current to get prev search
    const prevSearchTerm = getSearchTermFromUrl(
      urlsState.urls[urlsState.currUrlIdx - 1]
    );
    setSearchTerm(prevSearchTerm);
    urlsDispatch({ type: 'MOVE_TO_PREV' });
  };

  // get next url from history
  const handleNextClick = () => {
    // parse searchterm from url
    const nextSearchTerm = getSearchTermFromUrl(
      urlsState.urls[urlsState.currUrlIdx + 1]
    );
    setSearchTerm(nextSearchTerm);
    // check if after clicking next we will be at most recent url so we could hide next (>) button
    const willBeMostRecent =
      urlsState.currUrlIdx + 1 === urlsState.urls.length - 1;
    urlsDispatch({ type: 'MOVE_TO_NEXT', payload: willBeMostRecent });
  };

  // handleFetchStories will only be recreated whenever urlState changes.
  // therefore data will only be fetched on init render and when url changes (ie when searchForm submitted and input changed).
  const handleFetchStories = useCallback(async () => {
    storiesDispatch({ type: 'FETCH_STORIES' });
    // using server side search
    // axios wraps response into data object so no need to use res.json()
    try {
      // get all urls in history
      const urls = urlsState.urls;
      // get idx location of the current url endpoint
      const currUrlIdx = urlsState.currUrlIdx;
      const url = urls[currUrlIdx];
      // fetch data
      const result = await axios.get(url);

      // remove stories with no title (these stories were probably deleted)
      let list = result.data.hits.filter(
        (item) => (item.title !== null) & (item.title !== '')
      );
      // convert author to lowercase (used for sorting)
      list = list.map((item) => {
        return { ...item, author: item.author.toLowerCase() };
      });

      storiesDispatch({
        type: 'FETCH_STORIES_SUCCESS',
        payload: { list: list },
      });
    } catch (err) {
      storiesDispatch({ type: 'FETCH_STORIES_ERROR' });
    }
  }, [urlsState]);

  // fetch data on intitial page render
  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  // if there is a search token in localstorage, add it to url so we could call endpoint.
  // will only run on initial render.
  useEffect(() => {
    if (searchTerm) {
      const localStorageUrl = getCompleteUrl(searchTerm);
      urlsDispatch({ type: 'ADD_URL_AT_END', payload: localStorageUrl });
    }
  }, []);

  return (
    <div className='container'>
      <SearchForm
        urlsState={urlsState}
        handleInputChange={handleInputChange}
        handleSearchSubmit={handleSearchSubmit}
        handlePrevClick={handlePrevClick}
        handleNextClick={handleNextClick}
        searchTerm={searchTerm}
        className='button-large button-search'
      />

      {/* render list */}
      {storiesState.isError && <p>Something went wrong...</p>}
      {storiesState.isLoading ? (
        <p>loading...</p>
      ) : storiesState.data.length === 0 ? (
        <div>
          <p>Whoops...nothing to see here.</p>
          <button
            className='button button_large button-reset'
            onClick={handleFetchStories}
          >
            return
          </button>
        </div>
      ) : (
        <div>
          <List list={storiesState.data} removeItem={removeItem} />
        </div>
      )}
    </div>
  );
};

export default Home;
