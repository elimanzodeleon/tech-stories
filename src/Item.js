import React from 'react';
import { ReactComponent as Remove } from './remove.svg';
import { ReactComponent as Like } from './like.svg';

const Item = ({ item, removeItem }) => {
  const { title, url, author, num_comments, points } = item;
  return (
    <div className='item'>
      <span style={{ width: '45%' }}>
        <a href={url} target='_blank'>
          {title}
        </a>
      </span>
      <span style={{ width: '15%' }}>{author}</span>
      <span style={{ width: '10%' }}>
        <Like width='18px' height='18px' className='like' /> {points}
      </span>
      <span style={{ width: '20%' }}>{num_comments} comments</span>
      <span style={{ width: '5%' }}>
        <button
          onClick={() => removeItem(item)}
          className='button button-small'
        >
          <Remove width='20px' height='18px' />
        </button>
      </span>
    </div>
  );
};

export default Item;
