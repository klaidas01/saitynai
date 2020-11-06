import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import ConfirmButton from '../../common/ConfirmButton';
import CancelButton from '../../common/CancelButton';
import { currentUserRole } from '../../services/authService';

const LoginModal = ({active, inactive}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    console.log(currentUserRole());
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="text" onClick={handleClickOpen} className = {open ? active : inactive}>
        Sign Up
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="login-title">Register</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label="Username"
            type="text"
            fullWidth
          />
          <TextField
            margin="dense"
            id="fname"
            label="First Name"
            type="text"
            fullWidth
          />
          <TextField
            margin="dense"
            id="lname"
            label="Last Name"
            type="text"
            fullWidth
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={handleClose} text="Cancel" />
          <ConfirmButton onClick={handleClose} text="Submit" />
        </DialogActions>
      </Dialog>
    </div>
  );
};

LoginModal.propTypes = {
  active: PropTypes.string,
  inactive: PropTypes.string
};

export default LoginModal;