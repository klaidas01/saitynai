import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: '#9bceff',
    color: 'white',
  },
  button: {
    fontWeight: 'bold',
    color: 'gray',
  },
}));

const Transition = React.forwardRef((props, ref) => {
  Transition.displayName = 'Transtition';
  return <Slide direction="up" ref={ref} {...props} />;
});

const GenericModal = ({
  title,
  description,
  acceptName,
  declineName,
  handleAccept,
  handleDecline,
  handleClose,
  isOpen,
}) => {
  const classes = useStyles();
  return (
    <div>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="title"
        aria-describedby="description"
      >
        <DialogTitle className={classes.header} id="title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="description">{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAccept} className={classes.button}>
            {acceptName}
          </Button>
          <Button onClick={handleDecline} className={classes.button}>
            {declineName}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

GenericModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  acceptName: PropTypes.string.isRequired,
  declineName: PropTypes.string.isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleDecline: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default GenericModal;
