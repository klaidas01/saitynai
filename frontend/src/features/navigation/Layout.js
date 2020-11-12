import React from 'react';
//import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import NavBar from './NavBar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    paddingLeft: '19%',
    paddingRight: '19%',
  },
}));

const Layout = (props) => {
  const classes = useStyles();
  return (
    <>
      <NavBar />
      <div className={classes.container}>{props.children}</div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.any,
};

Layout.defaultProps = {
  children: [],
};

export default Layout;
