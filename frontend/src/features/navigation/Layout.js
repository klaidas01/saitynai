import React, { useState } from 'react';
//import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import NavBar from './NavBar';
import { makeStyles } from '@material-ui/core/styles';
import { currentUserRole, RoleProvider } from '../../services/authService';

const useStyles = makeStyles(() => ({
  container: {
    paddingLeft: '19%',
    paddingRight: '19%',
  },
}));

const Layout = (props) => {
  const classes = useStyles();
  const [role, setRole] = useState(currentUserRole());
  return (
    <RoleProvider value={role}>
      <NavBar setRole={setRole} />
      <div className={classes.container}>{props.children}</div>
    </RoleProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.any,
};

Layout.defaultProps = {
  children: [],
};

export default Layout;
