import React, { useState } from 'react';
import { ReactComponent as Remove } from '../images/remove.svg';
import { ReactComponent as Like } from '../images/like.svg';
import { ReactComponent as Liked } from '../images/liked.svg';
import { useAuthContext } from '../contexts/AuthContext';

// no longer need reomve item, will only use in users saved stories
const Item = ({ item, removeItem }) => {
  const { title, url, author, num_comments, points } = item;
  const { currentUser } = useAuthContext();

  // temp state to test liked
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    // TODO need to handle storing in database on click.
    // this will be handled in a diff component
    setLiked((prevState) => !prevState);
  };

  return (
    <div className='item'>
      <span title={title} style={{ width: '45%' }}>
        <a href={url} target='_blank' rel='noreferrer'>
          {title}
        </a>
      </span>
      <span style={{ width: '20%' }}>{author}</span>
      <span style={{ width: '15%', display: 'flex', alignItems: 'center' }}>
        <span>{points}</span>
      </span>
      <span style={{ width: '15%' }}>{num_comments}</span>
      {currentUser && (
        <span style={{ width: '5%' }}>
          <button
            onClick={handleLikeClick}
            className='util-button button-small button-remove'
          >
            {liked ? (
              <Liked width='20px' height='18px' />
            ) : (
              <Like width='20px' height='18px' />
            )}
          </button>
        </span>
      )}
      {/* <span style={{ width: '5%' }}>
        <button
          onClick={() => removeItem(item)}
          className='util-button button-small button-remove'
        >
          <Remove width='20px' height='18px' />
        </button>
      </span> */}
    </div>
  );
};

export default Item;
