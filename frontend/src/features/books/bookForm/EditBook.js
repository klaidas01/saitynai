import { React, useContext, useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState({ library: {} });

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('books/' + props.match.params.bookId);
        setBook(response.data);
      } catch (e) {
        enqueueSnackbar('Something went wrong', {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          variant: 'error',
        });
      }
      setLoading(false);
    };
    fetchBook();
  }, []);

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
        await axiosInstance.put('books/' + props.match.params.bookId, formData, config);
        enqueueSnackbar('Book updated', {
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

  if (user.role === 'Employee')
    return user.libraryId !== book.libraryId ? (
      <Redirect to="/libraries" />
    ) : (
      <BookForm
        onSubmit={onSumbit}
        title={book.title}
        author={book.author}
        pageCount={book.pageCount.toString()}
        description={book.description}
        libraryId={book.libraryId.toString()}
        coverImage={book.coverImage}
        lateFee={book.lateFee}
        libraryDisabled
      />
    );
  return (
    <BookForm
      onSubmit={onSumbit}
      title={book.title}
      author={book.author}
      pageCount={book.pageCount.toString()}
      description={book.description}
      libraryId={book.libraryId.toString()}
      coverImage={book.coverImage}
      lateFee={book.lateFee}
    />
  );
};

NewBook.propTypes = {
  match: PropTypes.object,
};

NewBook.defaultProps = {
  match: { params: {} },
};

export default NewBook;
