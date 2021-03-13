import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AuthProvider from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import MyStories from './components/MyStories';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Settings from './components/Settings';
import ForgotPassword from './components/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';

import { ROUTES } from './utils/constants';
import './App.css';

function App() {
  return (
    <div className='app-container'>
      <AuthProvider>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path={ROUTES.HOME} component={Home} />
            <Route path={ROUTES.SIGN_UP} component={SignUp} />
            <Route path={ROUTES.LOG_IN} component={LogIn} />
            <PrivateRoute path={ROUTES.MY_STORIES} component={MyStories} />
            <PrivateRoute path={ROUTES.SETTINGS} component={Settings} />
            <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
            <Route path='*' component={Home} />
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
