import React from 'react';
import { ReactComponent as Like } from '../images/like.svg';
import { ReactComponent as Liked } from '../images/liked.svg';
import { useStoriesContext } from '../contexts/StoriesContext';
import { useAuthContext } from '../contexts/AuthContext';

// no longer need reomve item, will only use in users saved stories
const Item = ({ item }) => {
  const { title, url, author, num_comments, points, liked, objectID } = item;
  const { toggleLikeStory } = useStoriesContext();
  const {
    currentUser,
    addStoryToUserLikes,
    removeStoryFromUserLikes,
  } = useAuthContext();

  const handleLikeClick = () => {
    toggleLikeStory(objectID);
    if (liked) {
      // user unliked the story

      removeStoryFromUserLikes(currentUser.uid, objectID); // removing the story from user liked stories in db
    } else {
      // user liked the story

      const story = { title, url, author, num_comments, points, id: objectID };
      addStoryToUserLikes(currentUser.uid, objectID, story);
    }
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
    </div>
  );
};

export default Item;
