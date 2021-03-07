// initial state for stories reducer
export const storiesInitialState = {
  data: [],
  page: 0,
  isLoading: false,
  isError: false,
};

// reducer that handles stories state
export const storiesReducer = (state, action) => {
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
        data: action.payload.list,
        page: action.payload.page,
      };
    case 'FETCH_STORIES_ERROR':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter((item) => item.objectID !== action.payload),
      };
    case 'GET_MORE_STORIES':
      return {
        ...state,
        page: action.payload,
      };
    default:
      console.log('NOT HANDLING GIVEN TYPE IN REDUCER');
      throw new Error('NOT HANDLING GIVEN TYPE IN REDUCER');
  }
};
