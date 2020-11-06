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
import axiosInstance from '../../services/axiosInstance';
import Cookies from 'js-cookie';

const loginSchema = yup.object({
  name: yup
    .string()
    .required('Username is required.'),
  password: yup
    .string()
    .required('Password is required.')
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
}));

const LoginModal = ({active, inactive, setRole}) => {
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
      <Button variant="text" onClick={handleClickOpen} className = {open ? active : inactive}>
        Login
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth="sm">
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              name: '',
              password: ''
            }}
            validationSchema={loginSchema}
            onSubmit={(values) => {
              const postLogin = async (values) => {
                try {
                  const response = await axiosInstance.post('users/token', {username: values.name, password: values.password});
                  if (!response.data.message)
                  {
                    Cookies.set('currentUser', response.data, { secure: true });
                    setRole(response.data.roles[0]);
                    console.log('login success');
                  }
                  else
                  {
                    console.log('login failed');
                  }
                }
                catch (e) {
                  console.log(e);
                }
              };
              postLogin(values);
            }}
          >
            {(formikProps) => (
              <>
                <TextField
                  label="Username"
                  onChange={formikProps.handleChange('name')}
                  value={formikProps.values.name}
                  fullWidth
                />
                {formikProps.errors.name && formikProps.touched.name ? (
                  <div className={classes.error}>{formikProps.errors.name}</div>
                ) : null}
                <TextField
                  onChange={formikProps.handleChange('password')}
                  value={formikProps.values.password}
                  label="Password"
                  type="password"
                  fullWidth
                />
                {formikProps.errors.password && formikProps.touched.password ? (
                  <div className={classes.error}>{formikProps.errors.password}</div>
                ) : null}
                <div className={classes.buttons}>
                  <div className={classes.button}><CancelButton onClick={handleClose} text="Cancel" /></div>
                  <div className={classes.button}><ConfirmButton onClick={formikProps.handleSubmit} text="Submit" /></div>
                </div>
              </>)
            }
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

LoginModal.propTypes = {
  active: PropTypes.string,
  inactive: PropTypes.string,
  setRole: PropTypes.func
};

export default LoginModal;