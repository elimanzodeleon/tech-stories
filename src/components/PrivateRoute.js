import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuthContext();
  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? <Component {...props} /> : <Redirect to={ROUTES.LOG_IN} />
      }
    />
  );
};

export default PrivateRoute;
