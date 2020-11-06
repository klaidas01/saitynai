import React, { useState } from 'react';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as Logo } from './Icons/book.svg';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import ProtectedComponent from '../../common/ProtectedComponent';
import { currentUserRole, logOut } from '../../services/authService';
import Button from '@material-ui/core/Button';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Cookies from 'js-cookie';

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
  const [role, setRole] = useState(currentUserRole());

  const onLogin = (values) => {
    const postLogin = async (values) => {
      try {
        const response = await axiosInstance.post('users/token', {
          username: values.name,
          password: values.password,
        });
        if (!response.data.message) {
          Cookies.set('currentUser', response.data, { secure: true });
          setRole(response.data.roles[0]);
          console.log('login success');
        } else {
          console.log('login failed');
        }
      } catch (e) {
        console.log(e);
      }
    };
    postLogin(values);
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
            exact
            to="/libraries"
            className={classes.navButton}
            activeClassName={classes.navActive}
          >
            Libraries
          </Button>
          <ProtectedComponent roles={['Guest']} role={role}>
            <LoginModal onSubmit={(values) => onLogin(values)} />
          </ProtectedComponent>
          <ProtectedComponent roles={['Guest']} role={role}>
            <RegisterModal active={classes.navActive} inactive={classes.navButton} />
          </ProtectedComponent>
          <ProtectedComponent roles={['Administrator', 'Employee', 'User']} role={role}>
            <Button
              variant="text"
              onClick={() => logOut((r) => setRole(r))}
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
