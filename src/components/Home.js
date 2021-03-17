import React, {
  useState,
  useLayoutEffect,
  useReducer,
  useCallback,
} from 'react';
import axios from 'axios';
import List from './List';
import SearchForm from './SearchForm';
import { urlsInitialState, urlsReducer } from '../reducers/urls';
import { getSearchTermFromUrl, getCompleteUrl } from '../utils/helperFunctions';
import { useStoriesContext } from '../contexts/StoriesContext';
import { useAuthContext } from '../contexts/AuthContext';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [urlsState, urlsDispatch] = useReducer(urlsReducer, urlsInitialState);

  // stories context for keeping track of stories fetched from api
  const { storiesState, storiesDispatch } = useStoriesContext();
  // for like functionallity
  const { user, currentUser } = useAuthContext();

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

  // get prev url from history
  const handlePrevSearchClick = () => {
    // parse searchterm from url that comes before current to get prev search
    // if we are getting the first url, then we just need to set the searchTerm to an empty str
    let prevSearchTerm = '';
    if (urlsState.currUrlIdx - 1 !== 0) {
      // the new url in history is not the start so grab the search term that was entered by the user
      prevSearchTerm = getSearchTermFromUrl(
        urlsState.urls[urlsState.currUrlIdx - 1]
      );
    }

    setSearchTerm(prevSearchTerm);
    urlsDispatch({ type: 'MOVE_TO_PREV_SEARCH' });
  };

  // get next url from history
  const handleNextSearchClick = () => {
    // parse searchterm from url
    const nextSearchTerm = getSearchTermFromUrl(
      urlsState.urls[urlsState.currUrlIdx + 1]
    );
    setSearchTerm(nextSearchTerm);
    // check if after clicking next we will be at most recent url so we could hide next (>) button
    const willBeMostRecent =
      urlsState.currUrlIdx + 1 === urlsState.urls.length - 1;
    urlsDispatch({ type: 'MOVE_TO_NEXT_SEARCH', payload: willBeMostRecent });
  };

  // get next page of stories from current search term when user clicks >
  const handleNextPageClick = () => {
    urlsDispatch({ type: 'GET_NEXT_PAGE' });
  };

  // get prev page of stories ONLY if current page is NOT 0
  const handlePrevPageClick = () => {
    urlsDispatch({ type: 'GET_PREV_PAGE' });
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
      // append currPage to url, starts at 0 on initial render
      const url = `${urls[currUrlIdx]}${urlsState.currPage}`;
      // fetch data
      const result = await axios.get(url);

      // remove stories with no title (these stories were probably deleted)
      let list = result.data.hits.filter(
        (item) => item.title !== null && item.title !== ''
      );
      // convert author to lowercase (used for sorting)
      list = list.map((item) => {
        return { ...item, author: item.author.toLowerCase() };
      });

      // TODO - check if the current user has any of the stories saved/liked
      // const userLikeStories = GET LIKED STORIES ARRAY OF CURRENT USER FROM FIREBASE
      if (currentUser) {
        await user(currentUser.uid).on('value', (snapshot) => {
          // first check if there is a user entry in db before attempting to grab liked stories
          // this will not run for users who have not liked any stories
          if (snapshot.exists()) {
            // get keys of user liked stories
            const res = Object.keys(snapshot.val().likedStories);
            // loop through api list adding whether or not story is liked
            list = list.map((story) => {
              let liked = false;
              if (res.includes(story.objectID)) {
                liked = true;
              }
              return { ...story, liked: liked };
            });
          }
        });
      }

      storiesDispatch({
        type: 'FETCH_STORIES_SUCCESS',
        payload: { list: list },
      });
    } catch (err) {
      console.log(err);
      storiesDispatch({ type: 'FETCH_STORIES_ERROR' });
    }
    // setLoading(false);
  }, [urlsState]);

  // fetch data on intitial page render
  useLayoutEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  return (
    <div className='container'>
      <SearchForm
        urlsState={urlsState}
        handleInputChange={handleInputChange}
        handleSearchSubmit={handleSearchSubmit}
        handlePrevClick={handlePrevSearchClick}
        handleNextClick={handleNextSearchClick}
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
        </div>
      ) : (
        <div>
          <List
            list={storiesState.data}
            currPage={urlsState.currPage}
            handlePrevPageClick={handlePrevPageClick}
            handleNextPageClick={handleNextPageClick}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
