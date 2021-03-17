import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';

const Account = () => {
  const [error, setError] = useState('');
  const history = useHistory();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    setError('');
    try {
      await logout();
      // redirect user to home(landing) page
      history.push(ROUTES.HOME);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='form-container'>
      {error && <p className='form-alert'>{error}</p>}
      <button onClick={handleLogout} className='form-button'>
        Log out
      </button>
    </div>
  );
};

export default Account;
