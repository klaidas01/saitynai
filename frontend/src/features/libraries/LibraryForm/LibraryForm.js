import { Grid, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import TextField from '@material-ui/core/TextField';
import CancelButton from './../../../common/CancelButton';
import ConfirmButton from './../../../common/ConfirmButton';
import { useHistory } from 'react-router-dom';

const bookSchema = yup.object({
  name: yup
    .string()
    .required('Book title is required.')
    .max(50, 'Book title is too long! (max 50 characters)'),
  address: yup
    .string()
    .required('Book author is required.')
    .max(50, 'Book author is too long! (max 50 characters)'),
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
    marginTop: '2%',
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

const LibraryForm = ({ name, address, onSubmit }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Paper variant="outlined" className={classes.container}>
      <Typography component="h2" variant="h6" className={classes.header}>
        Book form
      </Typography>
      <Formik
        initialValues={{
          name: name,
          address: address,
        }}
        validationSchema={bookSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {(formikProps) => (
          <Grid className={classes.gridContainer} container spacing={5}>
            <Grid item xs={12} className={classes.section1}>
              <TextField
                label="Name"
                onChange={formikProps.handleChange('name')}
                value={formikProps.values.name}
                variant="outlined"
                fullWidth
              />
              {formikProps.errors.name && formikProps.touched.name ? (
                <div className={classes.error}>{formikProps.errors.name}</div>
              ) : null}
              <TextField
                className={classes.field}
                label="Address"
                onChange={formikProps.handleChange('address')}
                value={formikProps.values.address}
                variant="outlined"
                fullWidth
              />
              {formikProps.errors.address && formikProps.touched.address ? (
                <div className={classes.error}>{formikProps.errors.address}</div>
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

LibraryForm.propTypes = {
  name: PropTypes.string,
  address: PropTypes.string,
  onSubmit: PropTypes.func,
};

LibraryForm.defaultProps = {
  name: '',
  address: '',
  onSubmit: (values) => {
    console.log(values);
  },
};

export default LibraryForm;
