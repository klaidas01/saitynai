import { IconButton } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { React } from 'react';
import { PropTypes } from 'prop-types';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import BlueSwitch from './../../common/BlueSwitch';

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
    display: 'flex',
  },
  filter: {
    flexShrink: 0,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: 1.43,
  },
  switch: {
    marginLeft: '2%',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const CustomPagination = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { count, page, rowsPerPage, switchValue, onChangePage, onSwitch } = props;

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <div className={classes.container}>
        <p className={classes.filter}>Only show available books</p>
        <BlueSwitch
          checked={switchValue}
          onChange={onSwitch}
          className={classes.switch}
          size="small"
        />
      </div>
    </div>
  );
};

CustomPagination.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onSwitch: PropTypes.func.isRequired,
  switchValue: PropTypes.bool.isRequired,
};

export default CustomPagination;
