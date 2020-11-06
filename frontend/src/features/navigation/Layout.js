import React from 'react';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import NavBar from './NavBar';

const Layout = (props) => {
  return (
    <>
      <NavBar />
      <Container>{props.children}</Container>
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
