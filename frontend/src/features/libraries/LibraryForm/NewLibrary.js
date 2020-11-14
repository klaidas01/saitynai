import { React, useContext } from 'react';
import LibraryForm from './LibraryForm';
import axiosInstance from './../../../services/axiosInstance';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { UserContext, logOut } from '../../../services/authService';

const NewLibrary = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const user = useContext(UserContext);
  const onSumbit = (values) => {
    const uploadItem = async () => {
      try {
        await axiosInstance.post('libraries', values);
        enqueueSnackbar('Library created', {
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
          if (user.role !== 'Guest') {
            logOut(user.setUser);
          }
        }
      }
    };
    uploadItem();
  };
  return <LibraryForm onSubmit={onSumbit} />;
};

export default NewLibrary;
