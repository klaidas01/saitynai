import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  button: {
    color: 'rgba(90, 161, 167, 0.466)',
    border: '1px solid rgba(90, 161, 167, 0.466)',
  },
}));

const CancelButton = ({ onClick, text }) => {
  const classes = useStyles();
  return (
    <Button
      data-testid="cancelButton"
      onClick={onClick}
      className={classes.button}
      variant="outlined"
    >
      {text}
    </Button>
  );
};

CancelButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default CancelButton;
