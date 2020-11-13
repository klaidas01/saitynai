import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import TitleIcon from '@material-ui/icons/Title';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import CreateIcon from '@material-ui/icons/Create';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import DescriptionIcon from '@material-ui/icons/Description';
import ApartmentIcon from '@material-ui/icons/Apartment';
import CancelButton from '../../common/CancelButton';

const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: '#9bceff',
    color: 'white',
  },
  section1: {
    minWidth: '50%',
    display: 'flex',
    alignItems: 'center',
  },
  section2: {
    display: 'flex',
    alignItems: 'center',
  },
  border: {
    margin: '2%',
    padding: '1%',
  },
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '2%',
    marginLeft: '2%',
    marginBottom: '1%',
  },
}));

const BookModal = ({ book, open, handleClose }) => {
  const classes = useStyles();

  return (
    <div>
      <Dialog data-testid="dialog" open={open} onClose={handleClose} fullWidth>
        <DialogTitle className={classes.header}>Book information</DialogTitle>
        <Box border={1} borderColor="grey.400" borderRadius={16} className={classes.border}>
          <Grid container alignItems="stretch">
            <Grid item className={classes.section1} sm={6}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <TitleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={'Book title: ' + book.title} />
                </ListItem>
              </List>
            </Grid>
            <Grid item className={classes.section2} sm={6}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <ImportContactsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={'Page count: ' + book.pageCount} />
                </ListItem>
              </List>
            </Grid>
            <Grid item className={classes.section1} sm={6}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <CreateIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={'Author: ' + book.author} />
                </ListItem>
              </List>
            </Grid>
            <Grid item className={classes.section2} sm={6}>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <ApartmentIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={'Library name: ' + book.library.name}
                    secondary={'Address: ' + book.library.address}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item sm={12}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <DescriptionIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={'Description: ' + book.description} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{book.isReserved ? <CancelIcon /> : <CheckCircleIcon />}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    book.isReserved ? 'This book is currently taken.' : 'This book is available'
                  }
                />
              </ListItem>
            </Grid>
          </Grid>
        </Box>
        <div className={classes.button}>
          <CancelButton onClick={() => handleClose()} text="Close" />
        </div>
      </Dialog>
    </div>
  );
};

BookModal.propTypes = {
  book: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default BookModal;
