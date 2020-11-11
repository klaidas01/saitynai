import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import ConfirmButton from '../../common/ConfirmButton';
import CancelButton from '../../common/CancelButton';
import * as yup from 'yup';
import { Formik } from 'formik';
import { DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const registerSchema = yup.object({
  fname: yup.string().required('First name is required.'),
  lname: yup.string().required('Last name is required.'),
  email: yup.string().required('E-mail is required.').email('Invalid E-mail.'),
  name: yup.string().required('Username is required.'),
  password: yup.string().required('Password is required.'),
});

const useStyles = makeStyles(() => ({
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '3%',
    marginBottom: '2%',
  },
  button: {
    marginRight: '3%',
  },
  error: {
    color: 'red',
  },
  inactive: {
    textDecoration: 'inherit',
    textTransform: 'none',
    color: '#9e9e9e',
    marginRight: '2%',
    whiteSpace: 'nowrap',
  },
  active: {
    textTransform: 'none',
    color: '#9e9e9e',
    fontWeight: 'bold',
    marginRight: '2%',
    whiteSpace: 'nowrap',
  },
  header: {
    backgroundColor: '#9bceff',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
}));

const RegisterModal = ({ onSubmit }) => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        data-testid="modalButton"
        variant="text"
        onClick={handleClickOpen}
        className={open ? classes.active : classes.inactive}
      >
        Sign Up
      </Button>
      <Dialog
        data-testid="dialog"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle className={classes.header}>Sign Up</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              name: '',
              fname: '',
              lname: '',
              email: '',
              password: '',
            }}
            validationSchema={registerSchema}
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {(formikProps) => (
              <>
                <TextField
                  inputProps={{ 'data-testid': 'usernameInput' }}
                  label="Username"
                  onChange={formikProps.handleChange('name')}
                  value={formikProps.values.name}
                  fullWidth
                />
                {formikProps.errors.name && formikProps.touched.name ? (
                  <div data-testid="usernameError" className={classes.error}>
                    {formikProps.errors.name}
                  </div>
                ) : null}
                <TextField
                  inputProps={{ 'data-testid': 'fnameInput' }}
                  label="First name"
                  onChange={formikProps.handleChange('fname')}
                  value={formikProps.values.fname}
                  fullWidth
                />
                {formikProps.errors.fname && formikProps.touched.fname ? (
                  <div data-testid="fnameError" className={classes.error}>
                    {formikProps.errors.fname}
                  </div>
                ) : null}
                <TextField
                  inputProps={{ 'data-testid': 'lnameInput' }}
                  label="Last name"
                  onChange={formikProps.handleChange('lname')}
                  value={formikProps.values.lname}
                  fullWidth
                />
                {formikProps.errors.lname && formikProps.touched.lname ? (
                  <div data-testid="lnameError" className={classes.error}>
                    {formikProps.errors.lname}
                  </div>
                ) : null}
                <TextField
                  inputProps={{ 'data-testid': 'emailInput' }}
                  label="E-mail address"
                  onChange={formikProps.handleChange('email')}
                  value={formikProps.values.email}
                  fullWidth
                />
                {formikProps.errors.email && formikProps.touched.email ? (
                  <div data-testid="emailError" className={classes.error}>
                    {formikProps.errors.email}
                  </div>
                ) : null}
                <TextField
                  inputProps={{ 'data-testid': 'passwordInput' }}
                  onChange={formikProps.handleChange('password')}
                  value={formikProps.values.password}
                  label="Password"
                  type="password"
                  fullWidth
                />
                {formikProps.errors.password && formikProps.touched.password ? (
                  <div data-testid="passwordError" className={classes.error}>
                    {formikProps.errors.password}
                  </div>
                ) : null}
                <div className={classes.buttons}>
                  <div className={classes.button}>
                    <CancelButton onClick={handleClose} text="Cancel" />
                  </div>
                  <div className={classes.button}>
                    <ConfirmButton
                      onClick={(values) => {
                        formikProps.handleSubmit(values);
                        handleClose();
                      }}
                      text="Submit"
                    />
                  </div>
                </div>
              </>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

RegisterModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default RegisterModal;
