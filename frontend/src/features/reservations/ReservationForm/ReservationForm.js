import { Grid, Paper, Typography } from '@material-ui/core';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import CancelButton from './../../../common/CancelButton';
import ConfirmButton from './../../../common/ConfirmButton';
import { useHistory } from 'react-router-dom';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { lightBlue } from '@material-ui/core/colors';
import ItemPicker from '../../../common/ItemPicker/ItemPicker';
import { UserContext } from '../../../services/authService';

const bookColumns = [
  { id: 'title', label: 'Title', maxWidth: '7vw' },
  { id: 'author', label: 'Author', maxWidth: '7vw' },
  { id: 'library', label: 'Library', nested: true, nestedField: 'name', maxWidth: '7vw' },
];

const userColumns = [
  { id: 'userName', label: 'Username', maxWidth: '7vw' },
  { id: 'firstName', label: 'First Name', maxWidth: '7vw' },
  { id: 'lastName', label: 'Last Name', maxWidth: '7vw' },
];

const bookSchema = yup.object({
  startDate: yup.date().required('Start date is required.').typeError('Start date is required.'),
  returnDate: yup
    .date()
    .required('Return date is required.')
    .typeError('Return date is required.')
    .min(yup.ref('startDate'), 'Return date must be after start date'),
  bookId: yup.number().required('Book is required.'),
  userId: yup.string().required('User is required.'),
});

const useStyles = makeStyles(() => ({
  container: {
    marginTop: '2vh',
    paddingBottom: '2%',
    borderRadius: '16px',
  },
  header: {
    backgroundColor: '#9bceff',
    color: 'white',
    padding: '1.5%',
    paddingLeft: '5%',
    marginBottom: '2%',
    borderRadius: '16px 16px 0px 0px',
  },
  section1: {
    alignSelf: 'flex-start',
  },
  section2: {
    flexWrap: 'wrap',
  },
  gridContainer: {
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  buttons: {
    display: 'flex',
  },
  field: {
    marginTop: '5%',
  },
  dropZone: {
    height: '100%',
    fullWidth: 'true',
  },
  preview: {
    minWidth: '40%',
    marginLeft: '30%',
  },
  previewImg: {
    width: '100%',
  },
  error: {
    color: 'red',
  },
  button: {
    marginRight: '2%',
  },
  grow: {
    flexGrow: '1',
  },
}));

const defaultMaterialTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#9bceff',
      },
    },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: '#9bceff',
        '&:hover': {
          backgroundColor: '#9bb6ff',
        },
      },
      current: {
        color: lightBlue['700'],
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
      },
      textPrimary: {
        color: 'black',
      },
    },
  },
});

const ReservationForm = ({ startDate, returnDate, bookId, userId, onSubmit }) => {
  const classes = useStyles();
  const history = useHistory();
  const user = useContext(UserContext);

  return (
    <Paper variant="outlined" className={classes.container}>
      <Typography component="h2" variant="h6" className={classes.header}>
        Reservaton form
      </Typography>
      <Formik
        initialValues={{
          startDate: startDate,
          returnDate: returnDate,
          bookId: bookId,
          userId: userId,
        }}
        validationSchema={bookSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {(formikProps) => (
          <Grid className={classes.gridContainer} container spacing={5}>
            <Grid item xs={12} sm={6} className={classes.section1}>
              <ItemPicker
                path={
                  user.role === 'Employee'
                    ? 'libraries/' + user.libraryId + '/books/available'
                    : 'books/available'
                }
                getByIdPath="books"
                columns={bookColumns}
                onChange={(value) => formikProps.setFieldValue('bookId', value)}
                value={formikProps.values.bookId}
                displayField="title"
                label="Book"
              />
              {formikProps.errors.bookId && formikProps.touched.bookId ? (
                <div className={classes.error}>{formikProps.errors.bookId}</div>
              ) : null}
              <ItemPicker
                path="users"
                columns={userColumns}
                onChange={(value) => formikProps.setFieldValue('userId', value)}
                value={formikProps.values.userId}
                displayField="userName"
                label="User"
                className={classes.field}
              />
              {formikProps.errors.userId && formikProps.touched.userId ? (
                <div className={classes.error}>{formikProps.errors.userId}</div>
              ) : null}
            </Grid>
            <Grid item xs={12} sm={6} className={classes.section2}>
              <ThemeProvider theme={defaultMaterialTheme}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    autoOk
                    fullWidth
                    clearable
                    invalidDateMessage=""
                    error={false}
                    format="yyyy-MM-dd"
                    inputVariant="outlined"
                    label="Start date"
                    value={formikProps.values.startDate}
                    onChange={(value) => {
                      formikProps.setFieldValue('startDate', value);
                      if (value)
                        formikProps.setFieldValue(
                          'returnDate',
                          new Date(new Date().setDate(value.getDate() + 14))
                        );
                    }}
                    animateYearScrolling
                  />
                </MuiPickersUtilsProvider>
              </ThemeProvider>
              {formikProps.errors.startDate && formikProps.touched.startDate ? (
                <div className={classes.error}>{formikProps.errors.startDate}</div>
              ) : null}
              <ThemeProvider theme={defaultMaterialTheme}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    autoOk
                    fullWidth
                    clearable
                    className={classes.field}
                    invalidDateMessage=""
                    minDateMessage=""
                    error={false}
                    format="yyyy-MM-dd"
                    minDate={
                      formikProps.values.startDate
                        ? new Date(new Date().setDate(formikProps.values.startDate.getDate() + 1))
                        : undefined
                    }
                    inputVariant="outlined"
                    label="Return date"
                    value={formikProps.values.returnDate}
                    onChange={(value) => formikProps.setFieldValue('returnDate', value)}
                    animateYearScrolling
                  />
                </MuiPickersUtilsProvider>
              </ThemeProvider>
              {formikProps.errors.returnDate && formikProps.touched.returnDate ? (
                <div className={classes.error}>{formikProps.errors.returnDate}</div>
              ) : null}
            </Grid>
            <Grid item xs={12} className={classes.section2}>
              <div className={classes.buttons}>
                <div className={classes.grow} />
                <span className={classes.button}>
                  <CancelButton
                    onClick={() => {
                      history.goBack();
                    }}
                    text="Cancel"
                  />
                </span>
                <ConfirmButton onClick={formikProps.handleSubmit} text="Submit" />
              </div>
            </Grid>
          </Grid>
        )}
      </Formik>
    </Paper>
  );
};

ReservationForm.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  returnDate: PropTypes.instanceOf(Date),
  bookId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userId: PropTypes.string,
  onSubmit: PropTypes.func,
};

ReservationForm.defaultProps = {
  startDate: null,
  returnDate: null,
  bookId: '',
  userId: '',
  onSubmit: (values) => {
    console.log(values);
  },
};

export default ReservationForm;
