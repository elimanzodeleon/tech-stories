import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const history = useHistory();

  const { signup } = useAuthContext();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do match.');
    }
    setLoading(true);
    setError('');
    try {
      await signup(email, password);
      setLoading(false);
      history.push(ROUTES.HOME);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const handleChange = (set) => (e) => {
    set(e.target.value);
  };

  return (
    <div className='form-container'>
      <h2>Create your account</h2>
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
        <input
          type='password'
          placeholder='confirm password'
          required
          value={confirmPassword}
          onChange={handleChange(setConfirmPassword)}
          className='form-input'
        />
        <button type='submit' className='form-button' disabled={loading}>
          Sign up
        </button>
      </form>
      <div className='form-helper-links'>
        <br />
        <div>
          Already have an account?{' '}
          <Link to={ROUTES.LOG_IN} className='link'>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
