import { list } from './constants';
import { API_ENDPOINT } from './constants';

export const getSearchTermFromUrl = (url) => {
  // redeuce the url to only include whatever is AFTER the API_ENDPOINT
  const searchTerm = url.replace(API_ENDPOINT, '');
  // extract the search term by removing whatever comes after and including the '&'
  // const searchTerm = query.substring(0, query.lastIndexOf('&'));

  return searchTerm;
};

export const getCompleteUrl = (searchTerm) => `${API_ENDPOINT}${searchTerm}`;

// async simulation of fetching data
export const getAsyncStories = () => {
  return new Promise(
    (resolve, reject) =>
      setTimeout(() => resolve({ data: { stories: list } }), 2000)
    // setTimeout(reject, 500)
  );
};
