// initial state for stories reducer
export const storiesInitialState = {
  data: [],
  isLoading: true,
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
    case 'TOGGLE_STORY_LIKE':
      const newData = state.data.map((story) => {
        if (story.objectID === action.payload) {
          return {
            ...story,
            liked: !story.liked,
          };
        }
        return story;
      });
      return {
        ...state,
        data: newData,
      };
    default:
      throw new Error('NOT HANDLING GIVEN TYPE IN REDUCER');
  }
};
