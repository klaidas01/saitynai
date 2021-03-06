import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NavBar from './NavBar';
import { makeStyles } from '@material-ui/core/styles';
import { currentUser, UserProvider } from '../../services/authService';
import Footer from './Footer';

const useStyles = makeStyles(() => ({
  container: {
    paddingLeft: '19%',
    paddingRight: '19%',
    minHeight: 'calc(96vh - 128px)',
  },
}));

const Layout = (props) => {
  const classes = useStyles();
  const [user, setUser] = useState(currentUser());

  return (
    <UserProvider value={{ ...user, setUser: setUser }}>
      <NavBar />
      <div className={classes.container}>{props.children}</div>
      <Footer />
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
