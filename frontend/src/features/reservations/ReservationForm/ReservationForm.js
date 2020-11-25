import { Grid, Paper, Typography } from '@material-ui/core';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
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

const bookColumns = [
  { id: 'title', label: 'Title' },
  { id: 'author', label: 'Author' },
  { id: 'library', label: 'Library', nested: true, nestedField: 'name' },
];

const userColumns = [
  { id: 'userName', label: 'Username' },
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
];

const bookSchema = yup.object({
  startDate: yup.date().required('Start date is required.').typeError('Start date is required.'),
  endDate: yup
    .date()
    .required('End date is required.')
    .typeError('End date is required.')
    .min(yup.ref('startDate'), 'End date must be after start date'),
  bookId: yup.number().required('Book is required.'),
  userId: yup.string().required('User is required.'),
});

const useStyles = makeStyles(() => ({
  container: {
    marginTop: '2%',
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

const ReservationForm = ({ startDate, endDate, bookId, userId, onSubmit }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Paper variant="outlined" className={classes.container}>
      <Typography component="h2" variant="h6" className={classes.header}>
        Reservaton form
      </Typography>
      <Formik
        initialValues={{
          startDate: startDate,
          endDate: endDate,
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
                path="books"
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
                          'endDate',
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
                    label="End date"
                    value={formikProps.values.endDate}
                    onChange={(value) => formikProps.setFieldValue('endDate', value)}
                    animateYearScrolling
                  />
                </MuiPickersUtilsProvider>
              </ThemeProvider>
              {formikProps.errors.endDate && formikProps.touched.endDate ? (
                <div className={classes.error}>{formikProps.errors.endDate}</div>
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
  endDate: PropTypes.instanceOf(Date),
  bookId: PropTypes.string,
  userId: PropTypes.string,
  onSubmit: PropTypes.func,
};

ReservationForm.defaultProps = {
  startDate: null,
  endDate: null,
  bookId: '',
  userId: '',
  onSubmit: (values) => {
    console.log(values);
  },
};

export default ReservationForm;
