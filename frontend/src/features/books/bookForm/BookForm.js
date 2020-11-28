import { Grid, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import TextField from '@material-ui/core/TextField';
import CancelButton from './../../../common/CancelButton';
import ConfirmButton from './../../../common/ConfirmButton';
import { DropzoneArea } from 'material-ui-dropzone';
import { useHistory } from 'react-router-dom';
import { b64toFile } from './../../../services/helperFunctions';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import ItemPicker from './../../../common/ItemPicker/ItemPicker';

const bookSchema = yup.object({
  title: yup
    .string()
    .required('Book title is required.')
    .max(50, 'Book title is too long! (max 50 characters)'),
  author: yup
    .string()
    .required('Book author is required.')
    .max(50, 'Book author is too long! (max 50 characters)'),
  pageCount: yup
    .number()
    .typeError('Rating must be a number.')
    .required('Page count is required.')
    .test('Page count validation', 'Page count must be higher than 0.', (value) => {
      return value > 0;
    }),
  description: yup
    .string()
    .required('Book description is required.')
    .max(500, 'Book description is too long! (max 500 characters)'),
  lateFee: yup.number().required('Late fee is required.').typeError('Late fee must be a number.'),
  libraryId: yup.number().required('Library is required.'),
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

const columns = [
  { id: 'name', label: 'Name', maxWidth: '13vw' },
  { id: 'address', label: 'Address', maxWidth: '13vw' },
];

const BookForm = ({
  title,
  author,
  pageCount,
  description,
  libraryId,
  coverImage,
  lateFee,
  onSubmit,
  libraryDisabled,
}) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Paper variant="outlined" className={classes.container}>
      <Typography component="h2" variant="h6" className={classes.header}>
        Book form
      </Typography>
      <Formik
        initialValues={{
          title: title,
          author: author,
          pageCount: pageCount,
          description: description,
          libraryId: libraryId,
          coverImage: coverImage,
          lateFee: lateFee,
        }}
        validationSchema={bookSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {(formikProps) => (
          <Grid className={classes.gridContainer} container spacing={5}>
            <Grid item xs={12} sm={6} className={classes.section1}>
              <TextField
                label="Title"
                onChange={formikProps.handleChange('title')}
                value={formikProps.values.title}
                variant="outlined"
                fullWidth
              />
              {formikProps.errors.title && formikProps.touched.title ? (
                <div className={classes.error}>{formikProps.errors.title}</div>
              ) : null}
              <TextField
                className={classes.field}
                label="Author"
                onChange={formikProps.handleChange('author')}
                value={formikProps.values.author}
                variant="outlined"
                fullWidth
              />
              {formikProps.errors.author && formikProps.touched.author ? (
                <div className={classes.error}>{formikProps.errors.author}</div>
              ) : null}
              <TextField
                label="Page count"
                className={classes.field}
                onChange={formikProps.handleChange('pageCount')}
                value={formikProps.values.pageCount}
                variant="outlined"
                fullWidth
              />
              {formikProps.errors.pageCount && formikProps.touched.pageCount ? (
                <div className={classes.error}>{formikProps.errors.pageCount}</div>
              ) : null}
              <TextField
                label="Description"
                multiline={true}
                rows={5}
                fullWidth
                className={classes.field}
                onChange={formikProps.handleChange('description')}
                value={formikProps.values.description}
                variant="outlined"
                size="medium"
              />
              {formikProps.errors.description && formikProps.touched.description ? (
                <div className={classes.error}>{formikProps.errors.description}</div>
              ) : null}
              <CurrencyTextField
                className={classes.field}
                label="Late fee per day"
                variant="outlined"
                value={formikProps.values.lateFee}
                currencySymbol="€"
                digitGroupSeparator=""
                decimalCharacter="."
                outputFormat="string"
                textAlign="left"
                onChange={(e, value) => formikProps.setFieldValue('lateFee', value)}
                minimumValue="0"
                fullWidth
              />
              {formikProps.errors.lateFee && formikProps.touched.lateFee ? (
                <div className={classes.error}>{formikProps.errors.lateFee}</div>
              ) : null}
              <ItemPicker
                path="libraries"
                columns={columns}
                onChange={(value) => formikProps.setFieldValue('libraryId', value)}
                value={formikProps.values.libraryId}
                displayField="name"
                label="Book's library"
                className={classes.field}
                disabled={libraryDisabled}
              />
              {formikProps.errors.libraryId && formikProps.touched.libraryId ? (
                <div className={classes.error}>{formikProps.errors.libraryId}</div>
              ) : null}
            </Grid>
            <Grid item xs={12} sm={6} className={classes.section2}>
              <DropzoneArea
                acceptedFiles={['image/*']}
                dropzoneClass={classes.dropZone}
                previewGridClasses={{
                  item: classes.preview,
                }}
                getPreviewIcon={(file) => {
                  if (file.file.type.split('/')[0] === 'image')
                    return (
                      <img className={classes.previewImg} role="presentation" src={file.data} />
                    );
                }}
                dropzoneText={'Upload book cover image'}
                filesLimit={1}
                onChange={(files) => formikProps.setFieldValue('coverImage', files[0])}
                initialFiles={
                  formikProps.values.coverImage && !(formikProps.values.coverImage instanceof Blob)
                    ? [b64toFile(formikProps.values.coverImage, 'Cover Image', 'image/jpeg')]
                    : []
                }
                showAlerts={false}
              />
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

BookForm.propTypes = {
  title: PropTypes.string,
  author: PropTypes.string,
  pageCount: PropTypes.string,
  description: PropTypes.string,
  onSubmit: PropTypes.func,
  libraryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coverImage: PropTypes.string,
  lateFee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  libraryDisabled: PropTypes.bool,
};

BookForm.defaultProps = {
  title: '',
  author: '',
  pageCount: '',
  description: '',
  coverImage: '',
  onSubmit: (values) => {
    console.log(values);
  },
  libraryId: '',
  lateFee: '0',
  libraryDisabled: false,
};

export default BookForm;
