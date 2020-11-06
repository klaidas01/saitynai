import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  button: {
    backgroundColor: '#9bceff',
    boxShadow: 'none',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(53, 147, 219, 0.466)',
    },
  },
}));

const ConfirmButton = ({ onClick, text }) => {
  const classes = useStyles();
  return (
    <Button
      data-testid="confirmButton"
      onClick={onClick}
      className={classes.button}
      variant="outlined"
    >
      {text}
    </Button>
  );
};

ConfirmButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default ConfirmButton;
