import React, { useReducer, useState } from 'react';
import { sortBy } from 'lodash'; // library that includes sorting function
import Item from './Item';
import { ReactComponent as Up } from './up.svg';
import { ReactComponent as Down } from './down.svg';

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, 'title'),
  TITLE_ASC: (list) => sortBy(list, 'title').reverse(),

  AUTHOR: (list) => sortBy(list, 'author'),
  AUTHOR_ASC: (list) => sortBy(list, 'author').reverse(),

  LIKES: (list) => sortBy(list, 'points').reverse(),
  LIKES_ASC: (list) => sortBy(list, 'points'),

  COMMENTS: (list) => sortBy(list, 'num_comments').reverse(),
  COMMENTS_ASC: (list) => sortBy(list, 'num_comments'),
};

const initialState = {
  sort: 'NONE',
  DESC: {
    NONE: false,
    TITLE: false,
    AUTHOR: false,
    LIKES: false,
    COMMENTS: false,
  },
};

const sortReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_TITLE_SORT':
      return {
        ...state,
        sort: 'TITLE',
        DESC: {
          ...state.DESC,
          TITLE: !state.DESC.TITLE,
        },
      };
    case 'TOGGLE_AUTHOR_SORT':
      return {
        ...state,
        sort: 'AUTHOR',
        DESC: {
          ...state.DESC,
          AUTHOR: !state.DESC.AUTHOR,
        },
      };
    case 'TOGGLE_LIKES_SORT':
      return {
        ...state,
        sort: 'LIKES',
        DESC: {
          ...state.DESC,
          LIKES: !state.DESC.LIKES,
        },
      };
    case 'TOGGLE_COMMENTS_SORT':
      return {
        ...state,
        sort: 'COMMENTS',
        DESC: {
          ...state.DESC,
          COMMENTS: !state.DESC.COMMENTS,
        },
      };
    default:
      console.log('not handling current type in sortReducer');
      throw new Error('not handling action type in sortReducer');
  }
};

const List = ({ list, removeItem }) => {
  const [sortState, dispatch] = useReducer(sortReducer, initialState);

  const handleSort = (key) => {
    switch (key) {
      case 'TITLE':
        dispatch({ type: 'TOGGLE_TITLE_SORT' });
        break;
      case 'AUTHOR':
        dispatch({ type: 'TOGGLE_AUTHOR_SORT' });
        break;
      case 'LIKES':
        dispatch({ type: 'TOGGLE_LIKES_SORT' });
        break;
      case 'COMMENTS':
        dispatch({ type: 'TOGGLE_COMMENTS_SORT' });
        break;
    }
  };

  let sort;
  if (sortState.sort === 'NONE') {
    sort = 'NONE';
  } else {
    sort = sortState.DESC[sortState.sort]
      ? sortState.sort
      : sortState.sort + '_ASC';
  }

  const sortFn = SORTS[sort];
  const sortedList = sortFn(list);

  return (
    <>
      <div className='list-control'>
        <span style={{ width: '40%' }}>
          <button
            className='button button-small'
            onClick={() => handleSort('TITLE')}
          >
            Title{' '}
            <span>
              {sortState.sort === 'TITLE' &&
                (sortState.DESC.TITLE ? (
                  <Up width='10px' height='10px' />
                ) : (
                  <Down width='10px' height='10px' />
                ))}
            </span>
          </button>
        </span>
        <span style={{ width: '20%' }}>
          <button
            className='button button-small'
            onClick={() => handleSort('AUTHOR')}
          >
            Author{' '}
            <span>
              {sortState.sort === 'AUTHOR' &&
                (sortState.DESC.AUTHOR ? (
                  <Up width='10px' height='10px' />
                ) : (
                  <Down width='10px' height='10px' />
                ))}
            </span>
          </button>
        </span>
        <span style={{ width: '10%' }}>
          <button
            className='button button-small'
            onClick={() => handleSort('LIKES')}
          >
            Likes{' '}
            <span>
              {sortState.sort === 'LIKES' &&
                (sortState.DESC.LIKES ? (
                  <Down width='10px' height='10px' />
                ) : (
                  <Up width='10px' height='10px' />
                ))}
            </span>
          </button>
        </span>
        <span style={{ width: '20%' }}>
          <button
            className='button button-small'
            onClick={() => handleSort('COMMENTS')}
          >
            Comments{' '}
            <span>
              {sortState.sort === 'COMMENTS' &&
                (sortState.DESC.COMMENTS ? (
                  <Down width='10px' height='10px' />
                ) : (
                  <Up width='10px' height='10px' />
                ))}
            </span>
          </button>
        </span>
      </div>
      {sortedList.map((item) => (
        <Item key={item.objectID} item={item} removeItem={removeItem} />
      ))}
    </>
  );
};

export default List;
