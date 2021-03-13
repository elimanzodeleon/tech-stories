import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');
  const { resetPassword } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert('');
    try {
      await resetPassword(email);
      setAlert('Please check your inbox for further instructions.');
    } catch {
      setAlert("We couldn't find your account with that information.");
    }
    setLoading(false);
  };

  const handleChange = (set) => (e) => {
    set(e.target.value);
  };

  return (
    <div className='form-container'>
      <h2>Password reset</h2>
      {alert && <p className='form-alert'>{alert}</p>}
      <form onSubmit={handleSubmit} className='form-body'>
        <input
          type='email'
          placeholder='email'
          required
          value={email}
          onChange={handleChange(setEmail)}
          className='form-input'
        />
        <button type='submit' className='form-button'>
          Reset password
        </button>
      </form>
      <br />
      <div className='form-helper-links'>
        <Link to={ROUTES.LOG_IN} className='link'>
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
