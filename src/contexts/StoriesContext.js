import React, { useContext, useReducer } from 'react';
import { storiesReducer, storiesInitialState } from '../reducers/stories';

const StoriesContext = React.createContext();

const StoriesProvider = ({ children }) => {
  const [storiesState, storiesDispatch] = useReducer(
    storiesReducer,
    storiesInitialState
  );

  const toggleLikeStory = (id) => {
    storiesDispatch({ type: 'TOGGLE_STORY_LIKE', payload: id });
  };

  return (
    <StoriesContext.Provider
      value={{
        storiesState,
        storiesDispatch,
        toggleLikeStory,
      }}
    >
      {children}
    </StoriesContext.Provider>
  );
};

export const useStoriesContext = () => useContext(StoriesContext);

export default StoriesProvider;
