import { useEffect, useState, useReducer, useCallback, useRef } from 'react';
import axios from 'axios';
import './App.css';
import List from './List';
import SearchForm from './SearchForm';
import Item from './Item';
import Input from './Input';

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Test',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 1,
    points: 5,
    objectID: 1,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 1,
    objectID: 1,
  },
];

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

// async simulation of fetching data
const getAsyncStories = () => {
  return new Promise(
    (resolve, reject) =>
      setTimeout(() => resolve({ data: { stories: list } }), 2000)
    // setTimeout(reject, 500)
  );
};

// initial state for stories reducer
const storiesInitialState = {
  data: [],
  isLoading: false,
  isError: false,
};

// reducer that handles stories state
const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_STORIES':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'FETCH_STORIES_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_STORIES_ERROR':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'FETCH_SEARCHED_STORIES':
      return {
        ...state,
        data: state.data.filter((item) =>
          item.title.toLowerCase().includes(action.payload.toLowerCase())
        ),
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter((item) => item.objectID !== action.payload),
      };
    default:
      console.log('NOT HANDLING GIVEN TYPE IN REDUCER');
      throw new Error();
  }
};

// initial state for url reducer
const urlsInitialState = {
  urls: [API_ENDPOINT],
  currUrlIdx: 0,
  isMostRecentUrl: true,
};

// reducer that handles url history state
const urlsReducer = (state, action) => {
  switch (action.type) {
    // add new url at end of history
    case 'ADD_URL_AT_END':
      return {
        ...state,
        urls: [...state.urls, action.payload],
        currUrlIdx: state.urls.length, // no need to subtract one since state.urls currently does not included the most recent url that was added
      };
    // adding url in middle of history but it will become the new end
    case 'ADD_URL_NOT_AT_END':
      return {
        ...state,
        urls: [...action.payload.urls, action.payload.url],
        currUrlIdx: state.currUrlIdx + 1,
        isMostRecentUrl: true, // since we created a new search
      };
    case 'MOVE_TO_PREV':
      return {
        ...state,
        currUrlIdx: state.currUrlIdx - 1,
        isMostRecentUrl: false,
      };
    case 'MOVE_TO_NEXT':
      return {
        ...state,
        currUrlIdx: state.currUrlIdx + 1,
        isMostRecentUrl: action.payload,
      };
    default:
      console.log('not handling type in urlsReducer');
      throw new Error('not handling type in urlsReducer');
  }
};

// custom hook that allows use to use localstorage for maintaining state
const useSemiPersistentState = (key) => {
  const [value, setValue] = useState(localStorage.getItem(key) || '');
  // control bool to prevent side effect from running on first render
  const isMounted = useRef(false);

  // better to set local storage independently since it is a side effect.
  // every time our search term updates, we will update our local storage.
  // now, whenever and wherever searchTerm is changed, so will our localstorage
  useEffect(() => {
    // this side effect will only run on each re-render and NOT on initial render
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};

// MAIN COMPONENT
function App() {
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
    const currUrlReq = `${API_ENDPOINT}${searchTerm}`;

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
      console.log(newPrevUrls);
      urlsDispatch({
        type: 'ADD_URL_NOT_AT_END',
        payload: { urls: newPrevUrls, url: currUrlReq },
      });
    }
    setSearchTerm(''); // reset searchTerm
  };

  // update searchTerm state as user enters input
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // here, useCallback is neing used with memo inside of the list component.
  // therefore, removeItem will never be recreated, empty dep. list -> []
  // and List component will only rerender when stories.data changes.
  const removeItem = (item) => {
    storiesDispatch({ type: 'REMOVE_STORY', payload: item.objectID });
  };

  // get prev url from history
  const handlePrevClick = () => {
    urlsDispatch({ type: 'MOVE_TO_PREV' });
  };

  // get next url from history
  const handleNextClick = () => {
    const willBeMostRecent =
      urlsState.currUrlIdx + 1 === urlsState.urls.length - 1;
    urlsDispatch({ type: 'MOVE_TO_NEXT', payload: willBeMostRecent });
  };

  // handleFetchStories will only be recreated whenever url changes.
  // therefore data will only be fetched on init render and when url changes (ie when searchForm submitted and input changed).
  const handleFetchStories = useCallback(async () => {
    storiesDispatch({ type: 'FETCH_STORIES' });
    // using server side search
    // axios wraps response into data object so no need to use res.json()
    try {
      const urls = urlsState.urls;
      const currUrlIdx = urlsState.currUrlIdx;
      const result = await axios.get([urls[currUrlIdx]]);
      // remove stories with no title (these stories were probably deleted)
      let list = result.data.hits.filter((item) => item.title != null);

      // convert author to lowercase (used for sorting)
      list = list.map((item) => {
        return { ...item, author: item.author.toLowerCase() };
      });

      storiesDispatch({
        type: 'FETCH_STORIES_SUCCESS',
        payload: list,
      });
    } catch (err) {
      storiesDispatch({ type: 'FETCH_STORIES_ERROR' });
    }
  }, [urlsState]);

  // fetch data on intitial page render
  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  return (
    <div className='container'>
      <h1 className='headline-primary'>Tech Stories</h1>
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
}

export default App;
export { Input, Item, List, SearchForm };
