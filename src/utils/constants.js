// const main api endpoint used for fetching stories
export const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

export const API_PAGE = '&page=';

// local data used to test before we used API
export const list = [
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
