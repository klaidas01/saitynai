import React, { useContext } from 'react';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as Logo } from './Icons/book.svg';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import ProtectedComponent from '../../common/ProtectedComponent';
import { logOut, UserContext } from '../../services/authService';
import Button from '@material-ui/core/Button';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(() => ({
  title: {
    color: '#9e9e9e',
    fontSize: '130%',
    marginRight: '2%',
  },
  appBar: {
    backgroundColor: '#eeeeee',
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  auth: {
    display: 'flex',
    marginRight: '18%',
  },
  icon: {
    maxHeight: 25,
    maxWidth: 25,
    marginLeft: '18%',
    marginRight: '0.5%',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
  },
  navButton: {
    textDecoration: 'inherit',
    textTransform: 'none',
    color: '#9e9e9e',
    marginRight: '2%',
    whiteSpace: 'nowrap',
  },
  navActive: {
    textTransform: 'none',
    color: '#9e9e9e',
    fontWeight: 'bold',
    marginRight: '2%',
    whiteSpace: 'nowrap',
  },
}));

const NavBar = () => {
  const { enqueueSnackbar } = useSnackbar();
  const user = useContext(UserContext);

  const onLogin = (values) => {
    const postLogin = async (values) => {
      try {
        const response = await axiosInstance.post('users/token', {
          username: values.name,
          password: values.password,
        });
        if (!response.data.message) {
          Cookies.set('currentUser', response.data, { secure: true, sameSite: 'Strict' });
          user.setUser(response.data);
          enqueueSnackbar('Login success', {
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
            variant: 'success',
          });
        } else {
          enqueueSnackbar(response.data.message, {
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
            variant: 'error',
          });
        }
      } catch (e) {
        enqueueSnackbar('Login failed', {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          variant: 'error',
        });
      }
    };
    postLogin(values);
  };

  const onRegister = (values) => {
    const postRegister = async (values) => {
      try {
        await axiosInstance.post('users/register', {
          firstname: values.fname,
          lastname: values.lname,
          username: values.name,
          email: values.email,
          password: values.password,
        });
        enqueueSnackbar('Registration success', {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          variant: 'success',
        });
      } catch (e) {
        enqueueSnackbar('Registration failed', {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          variant: 'error',
        });
      }
    };
    postRegister(values);
  };

  const classes = useStyles();
  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar>
        <Logo className={classes.icon} />
        <Typography className={classes.title}>Library management system</Typography>
        <div className={classes.navigation}>
          <Button
            component={NavLink}
            to="/libraries"
            className={classes.navButton}
            activeClassName={classes.navActive}
          >
            Libraries
          </Button>
          <Button
            component={NavLink}
            to="/books"
            className={classes.navButton}
            activeClassName={classes.navActive}
          >
            Books
          </Button>
          <ProtectedComponent roles={['Administrator', 'Employee']}>
            <Button
              component={NavLink}
              to="/reservations"
              className={classes.navButton}
              activeClassName={classes.navActive}
            >
              Reservations
            </Button>
          </ProtectedComponent>
          <ProtectedComponent roles={['Administrator', 'Employee', 'User']}>
            <Button
              exact
              component={NavLink}
              to="/userReservations"
              className={classes.navButton}
              activeClassName={classes.navActive}
            >
              My Reservations
            </Button>
          </ProtectedComponent>
        </div>
        <div className={classes.auth}>
          <ProtectedComponent roles={['Guest']}>
            <LoginModal onSubmit={(values) => onLogin(values)} />
          </ProtectedComponent>
          <ProtectedComponent roles={['Guest']}>
            <RegisterModal onSubmit={(values) => onRegister(values)} />
          </ProtectedComponent>
          <ProtectedComponent roles={['Administrator', 'Employee', 'User']}>
            <Button
              variant="text"
              onClick={() => logOut((r) => user.setUser(r))}
              className={classes.navButton}
            >
              Log Out
            </Button>
          </ProtectedComponent>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
