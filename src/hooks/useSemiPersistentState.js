// CURRENTLY NOT USING LOCAL STATE
import { useState, useEffect, useRef } from 'react';

// custom hook that allows use to use localstorage for maintaining state
export const useSemiPersistentState = (key) => {
  const [value, setValue] = useState(localStorage.getItem(key) || '');
  // control bool to prevent side effect from running on first render
  const isMounted = useRef(false);

  // better to set local storage independently since it is a side effect.
  // every time our search term updates, we will update our local storage.
  // now, whenever and wherever searchTerm is changed, so will our localstorage
  useEffect(() => {
    // this side effect will only run on each re-render and NOT on initial render
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};
