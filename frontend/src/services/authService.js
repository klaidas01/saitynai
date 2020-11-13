import Cookies from 'js-cookie';
import React from 'react';

export const isAuthenticated = () => {
  return Cookies.get('currentUser') !== 'undefined' ? true : false;
};

export const currentUser = () => {
  if (isAuthenticated()) {
    try {
      const user = JSON.parse(Cookies.get('currentUser'));
      return user;
    } catch {
      return { role: 'Guest' };
    }
  }
  return { role: 'Guest' };
};

export const logOut = (setUser) => {
  Cookies.remove('currentUser');
  setUser({ role: 'Guest' });
};

export const UserContext = React.createContext({ role: 'Guest' });

export const UserProvider = UserContext.Provider;
