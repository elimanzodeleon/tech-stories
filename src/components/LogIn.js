import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { useAuthContext } from '../contexts/AuthContext';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { login } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      setLoading(false);
      history.push('/');
    } catch {
      setLoading(false);
      setError(
        'The email and password you entered did not match our records. Please double-check and try again.'
      );
    }
  };

  const handleChange = (set) => (e) => {
    set(e.target.value);
  };

  return (
    <div className='form-container'>
      <h1>Log in to Tech Stories</h1>
      {error && <p className='form-alert'>{error}</p>}
      <form onSubmit={handleSubmit} className='form-body'>
        <input
          type='email'
          placeholder='email'
          required
          value={email}
          onChange={handleChange(setEmail)}
          className='form-input'
        />
        <input
          type='password'
          placeholder='password'
          required
          value={password}
          onChange={handleChange(setPassword)}
          className='form-input'
        />
        <button type='submit' className='form-button' disabled={loading}>
          Log in
        </button>
      </form>
      <div className='form-helper-links'>
        <Link to={ROUTES.FORGOT_PASSWORD} className='link'>
          Forgot password?
        </Link>
        <br />
        <div>
          Don't have an account?{' '}
          <Link to={ROUTES.SIGN_UP} className='link'>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
