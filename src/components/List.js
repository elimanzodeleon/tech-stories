import React, { useState } from 'react';
import { sortBy } from 'lodash'; // library that includes sorting function
import Item from './Item';
import { ReactComponent as Up } from '../images/up.svg';
import { ReactComponent as Down } from '../images/down.svg';

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, 'title'),
  AUTHOR: (list) => sortBy(list, 'author'),
  LIKES: (list) => sortBy(list, 'points').reverse(),
  COMMENTS: (list) => sortBy(list, 'num_comments').reverse(),
};

const List = ({ list, removeItem }) => {
  const [sort, setSort] = useState({
    sortKey: 'NONE',
    revereSort: false,
  });

  const handleSort = (key) => {
    // if btn clicked is our current state then we toggle reverseSort to opposite of curr val
    // else we have a new key so reset reverseSort to false
    const reverseSort = key === sort.sortKey && !sort.reverseSort;
    setSort({
      sortKey: key,
      reverseSort,
    });
  };

  // func we will be using for sorting
  const sortFn = SORTS[sort.sortKey];
  // sorted list using function from above
  // if reverSort then we will reverse whatever si returned from our function
  const sortedList = sort.reverseSort ? sortFn(list).reverse() : sortFn(list);

  return (
    <>
      <div className='list-control'>
        <span style={{ width: '45%' }}>
          <button
            className='button button-small'
            onClick={() => handleSort('TITLE')}
          >
            Title{' '}
            <span>
              {sort.sortKey === 'TITLE' &&
                (sort.reverseSort ? (
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
            onClick={() => handleSort('AUTHOR')}
          >
            Author{' '}
            <span>
              {sort.sortKey === 'AUTHOR' &&
                (sort.reverseSort ? (
                  <Down width='10px' height='10px' />
                ) : (
                  <Up width='10px' height='10px' />
                ))}
            </span>
          </button>
        </span>
        <span style={{ width: '15%' }}>
          <button
            className='button button-small'
            onClick={() => handleSort('LIKES')}
          >
            Likes{' '}
            <span>
              {sort.sortKey === 'LIKES' &&
                (sort.reverseSort ? (
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
              {sort.sortKey === 'COMMENTS' &&
                (sort.reverseSort ? (
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
