import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NavBar from './NavBar';
import { makeStyles } from '@material-ui/core/styles';
import { currentUser, UserProvider } from '../../services/authService';

const useStyles = makeStyles(() => ({
  container: {
    paddingLeft: '19%',
    paddingRight: '19%',
  },
}));

const Layout = (props) => {
  const classes = useStyles();
  const [user, setUser] = useState(currentUser());

  return (
    <UserProvider value={{ ...user, setUser: setUser }}>
      <NavBar />
      <div className={classes.container}>{props.children}</div>
    </UserProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.any,
};

Layout.defaultProps = {
  children: [],
};

export default Layout;
