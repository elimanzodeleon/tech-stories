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

// initial state for reducer
const initialState = {
  data: [],
  isLoading: false,
  isError: false,
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
    // this side effect will only run on each re-render
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
  // give custom hook a key so that if this custom hook is used elsewhere
  // it wont overwrite this value in localstorage
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search');
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);
  const [state, dispatch] = useReducer(storiesReducer, initialState);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setUrl(`${API_ENDPOINT}${searchTerm}`); // new api request using searchTerm
    setSearchTerm(''); // reset searchTerm
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // here, useCallback is neing used with memo inside of the list component.
  // therefore, removeItem will never be recreated, empty dep. list -> []
  // and List component will only rerender when stories.data changes.
  const removeItem = (item) => {
    dispatch({ type: 'REMOVE_STORY', payload: item.objectID });
  };

  // handleFetchStories will only be recreated whenever url changes.
  // therefore data will only be fetched on init render and when url changes (on searchTerm change).
  const handleFetchStories = useCallback(async () => {
    dispatch({ type: 'FETCH_STORIES' });
    // using server side search
    // axios wraps response into data object so no need to use res.json()
    try {
      const result = await axios.get(url);

      // remove stories with no title (these stories were probably deleted)
      let list = result.data.hits.filter((item) => item.title != null);

      // convert author to lowercase (used for sorting)
      list = list.map((item) => {
        return { ...item, author: item.author.toLowerCase() };
      });

      dispatch({
        type: 'FETCH_STORIES_SUCCESS',
        payload: list,
      });
    } catch (err) {
      dispatch({ type: 'FETCH_STORIES_ERROR' });
    }
  }, [url]);

  // fetch data on intitial page render
  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  return (
    <div className='container'>
      <h1 className='headline-primary'>Tech Stories</h1>
      <SearchForm
        value={searchTerm}
        handleInputChange={handleInputChange}
        handleSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
        className='button-large button-search'
      />

      {/* render list */}
      {state.isError && <p>Something went wrong...</p>}
      {state.isLoading ? (
        <p>loading...</p>
      ) : state.data.length === 0 ? (
        <div>
          <p>Whoops... looks like you removed all of the stories.</p>
          <button
            className='button button_large button-reset'
            onClick={handleFetchStories}
          >
            reset
          </button>
        </div>
      ) : (
        <div>
          <List list={state.data} removeItem={removeItem} />
        </div>
      )}
    </div>
  );
}

export default App;
export { Input, Item, List, SearchForm };
