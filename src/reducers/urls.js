import { getCompleteUrl } from '../utils/helperFunctions';

// initial state for url reducer
export const urlsInitialState = {
  urls: [getCompleteUrl('')],
  currUrlIdx: 0,
  isMostRecentUrl: true,
};

// reducer that handles url history state
export const urlsReducer = (state, action) => {
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
