import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { useAuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser } = useAuthContext();

  return (
    <div className='navbar-container'>
      <Link to={ROUTES.HOME} className='link title-link'>
        Tech Stories
      </Link>
      <div>{currentUser ? <AuthLinks /> : <NonAuthLinks />}</div>
    </div>
  );
};

// navbar links if there is no current user
const NonAuthLinks = () => (
  <>
    <Link to={ROUTES.SIGN_UP} className='link navbar-link'>
      Sign up
    </Link>
    <Link to={ROUTES.LOG_IN} className='link navbar-link'>
      Log in
    </Link>
  </>
);

// navbar links if there is a user
const AuthLinks = () => (
  <>
    <Link to={ROUTES.MY_STORIES} className='link navbar-link'>
      My stories
    </Link>
    {/* replace with settings logo -> place log out in settings*/}
    <Link to={ROUTES.ACCOUNT} className='link navbar-link'>
      Account
    </Link>
  </>
);

export default Navbar;
