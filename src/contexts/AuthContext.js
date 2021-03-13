// we will use context so that each page/component can have acccess to the user currently logged in
import React, { useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase';

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);

  /* AUTH */
  const signup = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return auth.signOut();
  };

  const resetPassword = (email) => {
    return auth.sendPasswordResetEmail(email);
  };

  /* DATABASE */
  const story = () => {
    // todo
  };
  const stories = () => {
    // todo
  };

  // check for current user on initial render
  useEffect(() => {
    // user changes only on log in or sign out
    const unsubscribe = auth.onAuthStateChanged((user) => {
      user ? setCurrentUser(user) : setCurrentUser(null);
      setLoading(false);
    });

    // unsubsrcibe from firebase to prevent mem leak
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ signup, login, logout, resetPassword, currentUser }}
    >
      {/* only if we have verified if there is or isnt a user should we render the children */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// custom hook for global state
export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;
