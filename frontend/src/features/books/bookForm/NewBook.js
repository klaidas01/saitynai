import { React, useContext, useState } from 'react';
import BookForm from './BookForm';
import axiosInstance from './../../../services/axiosInstance';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { Redirect, useHistory } from 'react-router-dom';
import { UserContext, logOut } from '../../../services/authService';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  center: {
    marginLeft: '50%',
    marginTop: '10%',
  },
}));

const NewBook = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const classes = useStyles();
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const onSumbit = (values) => {
    const uploadItem = async () => {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('author', values.author);
      formData.append('pageCount', values.pageCount);
      formData.append('description', values.description);
      formData.append('lateFee', values.lateFee);
      formData.append('libraryId', values.libraryId);
      formData.append('coverImage', values.coverImage ? values.coverImage : null);

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      try {
        await axiosInstance.post('books', formData, config);
        enqueueSnackbar('Book created', {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          variant: 'success',
        });
        history.goBack();
      } catch (e) {
        enqueueSnackbar('Something went wrong', {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          variant: 'error',
        });
        if (e.response && e.response.status === 401);
        {
          history.push('/libraries');
          if (user.role !== 'Guest') {
            logOut(user.setUser);
          }
        }
      }
      setLoading(false);
    };
    uploadItem();
  };
  if (loading) return <CircularProgress className={classes.center} />;
  if (props.match.params.libraryId)
    return user.role === 'Employee' && user.libraryId !== +props.match.params.libraryId ? (
      <Redirect to="/libraries" />
    ) : (
      <BookForm onSubmit={onSumbit} libraryId={props.match.params.libraryId} libraryDisabled />
    );
  return <BookForm onSubmit={onSumbit} />;
};

NewBook.propTypes = {
  match: PropTypes.object,
};

NewBook.defaultProps = {
  match: { params: {} },
};

export default NewBook;
