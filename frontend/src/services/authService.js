import Cookies from 'js-cookie';

export const isAuthenticated = () => {
  return ((Cookies.get('currentUser') !== 'undefined') ? true : false);
};

export const currentUserRole = () => {
  if (isAuthenticated())
  {
    try {
      const role = JSON.parse(Cookies.get('currentUser')).roles[0];
      return role;
    }
    catch{
      return 'Guest';
    }
  }
  return 'Guest';
};

export const logOut = (setRole) => {
  Cookies.remove('currentUser');
  setRole('Guest');
};