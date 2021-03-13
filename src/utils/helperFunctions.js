import { API_ENDPOINT, API_PAGE } from './constants';

export const getSearchTermFromUrl = (url) => {
  // redeuce the url to only include whatever is AFTER the API_ENDPOINT
  const query = url.replace(API_ENDPOINT, '');
  // extract the search term by removing whatever comes after and including the '&'
  const searchTerm = query.substring(0, query.lastIndexOf('&'));

  return searchTerm;
};

export const getCompleteUrl = (searchTerm) =>
  `${API_ENDPOINT}${searchTerm}${API_PAGE}`;
