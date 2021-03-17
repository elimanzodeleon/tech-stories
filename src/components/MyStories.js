import React, { useState, useLayoutEffect } from 'react';
import { useStoriesContext } from '../contexts/StoriesContext';
import { useAuthContext } from '../contexts/AuthContext';
import { ReactComponent as Remove } from '../images/remove.svg';

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleLikeStory } = useStoriesContext();
  const { user, currentUser, removeStoryFromUserLikes } = useAuthContext();

  const getUsersLikedStories = async () => {
    setLoading(true);
    try {
      await user(currentUser.uid).on('value', (snapshot) => {
        // first check if there is a user entry in db before attempting to grab liked stories
        // this will not run for users who have not liked any stories
        if (snapshot.exists()) {
          const res = Object.values(snapshot.val().likedStories);
          setStories(res);
        } else {
          // there is nothing in the current users likes so set stories to empty array
          setStories([]);
        }
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleRemoveStoryClick = (id) => {
    toggleLikeStory(id);
    removeStoryFromUserLikes(currentUser.uid, id);
  };

  useLayoutEffect(() => {
    getUsersLikedStories();
  }, []);

  if (loading) {
    return <p style={{ paddingTop: '20px' }}>loading...</p>;
  }

  return (
    <div style={{ paddingTop: '20px' }}>
      <h2 style={{ textAlign: 'center', paddingBottom: '10px' }}>
        My liked stories
      </h2>
      <div>
        {stories.map((story) => {
          const { id, title, author, points, url } = story;
          return (
            <div key={id} className='item'>
              <span>
                <a href={url} target='_blank' rel='noreferrer'>
                  {title}
                </a>{' '}
                by {author} - likes: {points}
              </span>
              <button
                onClick={() => handleRemoveStoryClick(id)}
                className='button util-button'
              >
                <Remove width='18px' height='18px' />
              </button>
            </div>
          );
        })}
      </div>

      {stories.length === 0 && (
        <p style={{ textAlign: 'center' }}>
          {' '}
          Start liking stories. What are you waiting for?
        </p>
      )}
    </div>
  );
};

export default MyStories;
