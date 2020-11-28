import { React, useContext, useState, useEffect } from 'react';
import LibraryForm from './LibraryForm';
import axiosInstance from './../../../services/axiosInstance';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { UserContext, logOut } from '../../../services/authService';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles(() => ({
  center: {
    marginLeft: '50%',
    marginTop: '10%',
  },
}));

const EditLibrary = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const user = useContext(UserContext);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [library, setLibrary] = useState({});

  useEffect(() => {
    const fetchLibrary = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('libraries/' + props.match.params.libraryId);
        setLibrary(response.data);
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
    fetchLibrary();
  }, []);

  const onSumbit = (values) => {
    const updateLibrary = async () => {
      setLoading(true);
      try {
        await axiosInstance.put('libraries/' + props.match.params.libraryId, values);
        enqueueSnackbar('Library updated', {
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
        if (e.response);
        {
          history.push('/libraries');
          if (user.role !== 'Guest' && e.response.status === 401) {
            logOut(user.setUser);
          }
        }
      }
      setLoading(false);
    };
    updateLibrary();
  };

  if (loading) return <CircularProgress className={classes.center} />;
  return <LibraryForm onSubmit={onSumbit} name={library.name} address={library.address} />;
};

EditLibrary.propTypes = {
  match: PropTypes.object.isRequired,
};

export default EditLibrary;
