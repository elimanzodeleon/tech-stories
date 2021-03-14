import { getCompleteUrl } from '../utils/helperFunctions';

// initial state for url reducer
export const urlsInitialState = {
  urls: [getCompleteUrl('')],
  currUrlIdx: 0,
  isMostRecentUrl: true,
  currPage: 0,
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
        currPage: 0, // reset currPage whenever searchTerm (i.e. url) changes
      };
    // adding url in middle of history but it will become the new end
    case 'ADD_URL_NOT_AT_END':
      return {
        ...state,
        urls: [...action.payload.urls, action.payload.url],
        currUrlIdx: state.currUrlIdx + 1,
        isMostRecentUrl: true, // since we created a new search
        currPage: 0, // reset currPage whenever searchTerm (i.e. url) changes
      };
    case 'MOVE_TO_PREV_SEARCH':
      return {
        ...state,
        currUrlIdx: state.currUrlIdx - 1,
        isMostRecentUrl: false,
        currPage: 0, // reset currPage whenever searchTerm (i.e. url) changes
      };
    case 'MOVE_TO_NEXT_SEARCH':
      return {
        ...state,
        currUrlIdx: state.currUrlIdx + 1,
        isMostRecentUrl: action.payload,
        currPage: 0, // reset currPage whenever searchTerm (i.e. url) changes
      };
    case 'GET_NEXT_PAGE':
      return {
        ...state,
        currPage: state.currPage + 1,
      };
    case 'GET_PREV_PAGE':
      return {
        ...state,
        currPage: state.currPage - 1,
      };
    default:
      console.log('not handling type in urlsReducer');
      throw new Error('not handling type in urlsReducer');
  }
};
