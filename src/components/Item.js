import React from 'react';
import { ReactComponent as Remove } from '../images/remove.svg';
import { ReactComponent as Like } from '../images/like.svg';

const Item = ({ item, removeItem }) => {
  const { title, url, author, num_comments, points } = item;
  return (
    <div className='item'>
      <span title={title} style={{ width: '45%' }}>
        <a href={url} target='_blank' rel='noreferrer'>
          {title}
        </a>
      </span>
      <span style={{ width: '20%' }}>{author}</span>
      <span style={{ width: '15%', display: 'flex', alignItems: 'center' }}>
        <button className='button-like'>
          <Like width='18px' height='18px' className='like' />
        </button>
        <span>{points}</span>
      </span>
      <span style={{ width: '15%' }}>{num_comments}</span>
      <span style={{ width: '5%' }}>
        <button
          onClick={() => removeItem(item)}
          className='util-button button-small button-remove'
        >
          <Remove width='20px' height='18px' />
        </button>
      </span>
    </div>
  );
};

export default Item;
