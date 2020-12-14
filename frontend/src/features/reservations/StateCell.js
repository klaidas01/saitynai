import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  root: {
    color: 'white',
    textAlign: 'center',
    padding: '8px 20px 8px 20px',
    borderRadius: 20,
  },
}));

const StateCell = ({ row }) => {
  const classes = useStyles();

  return (
    <Box
      bgcolor={row.state === 'Returned' ? '#80bb18' : row.state === 'Late' ? '#fe2e2e' : '#ffc213'}
      className={classes.root}
      display="inline"
    >
      <Typography variant="body2" component="span">
        {row.state}
      </Typography>
    </Box>
  );
};

StateCell.propTypes = {
  row: PropTypes.object.isRequired,
};

export default StateCell;
