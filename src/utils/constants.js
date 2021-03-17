// const main api endpoint used for fetching stories
export const API_HOME_ENDPOINT =
  'https://hn.algolia.com/api/v1/search?tags=front_page';
export const API_SEARCH_ENDPOINT =
  'https://hn.algolia.com/api/v1/search?query=';
export const API_PAGE_NUM = '&page=';

export const ROUTES = {
  HOME: '/',
  SIGN_UP: '/signup',
  LOG_IN: '/login',
  ACCOUNT: '/account',
  MY_STORIES: '/my-stories',
  FORGOT_PASSWORD: '/forgot-password',
};
