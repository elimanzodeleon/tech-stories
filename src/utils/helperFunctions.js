import {
  API_HOME_ENDPOINT,
  API_SEARCH_ENDPOINT,
  API_PAGE_NUM,
} from './constants';

export const getSearchTermFromUrl = (url) => {
  // redeuce the url to only include whatever is AFTER the API_ENDPOINT
  const query = url.replace(API_SEARCH_ENDPOINT, '');
  // extract the search term by removing whatever comes after and including the '&'
  const searchTerm = query.substring(0, query.lastIndexOf('&'));

  return searchTerm;
};

export const getCompleteUrl = (searchTerm, isHome = false) =>
  isHome
    ? `${API_HOME_ENDPOINT}${API_PAGE_NUM}`
    : `${API_SEARCH_ENDPOINT}${searchTerm}${API_PAGE_NUM}`;
