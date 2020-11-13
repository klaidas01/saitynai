import { React, useContext } from 'react';
import BookForm from './BookForm';
import axiosInstance from './../../../services/axiosInstance';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../../services/authService';

const NewBook = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const user = useContext(UserContext);
  const onSumbit = (values) => {
    const uploadItem = async () => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('author', values.author);
      formData.append('pageCount', values.pageCount);
      formData.append('description', values.description);
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
        if (e.response.status === 401);
        {
          history.push('/libraries');
          if (user.role !== 'Guest') user.setRole({ role: 'Guest' });
        }
      }
    };
    uploadItem();
  };
  if (props.match.params.libraryId)
    return (
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
