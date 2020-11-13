import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  button: {
    color: '#9bceff',
    marginLeft: '5%',
  },
}));

const NavButton = ({ route, text }) => {
  const classes = useStyles();
  return (
    <Button className={classes.button} variant="outlined" component={NavLink} to={route} exact>
      {text}
    </Button>
  );
};

NavButton.propTypes = {
  route: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default NavButton;
