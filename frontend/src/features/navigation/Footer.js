import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: '#eeeeee',
    display: 'flex',
    alignItems: 'center',
    height: '64px',
    justifyContent: 'center',
    width: '100%',
    marginTop: '2vh',
  },
  content: {
    textAlign: 'center',
    color: '#909090',
  },
  button: {
    padding: 0,
    margin: 0,
    textTransform: 'none',
    color: '#909090',
  },
}));

const Footer = () => {
  const classes = useStyles();
  const [date] = useState(new Date());

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={classes.container}>
      <div>
        <div className={classes.content}>
          Copyright &copy; {date.getFullYear()}. All Rights Reserved.
        </div>
        <div className={classes.content}>
          <Button className={classes.button} onClick={scrollToTop}>
            Back to top
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
