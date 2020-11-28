import { React, useContext, useState } from 'react';
import ReservationForm from './ReservationForm';
import axiosInstance from './../../../services/axiosInstance';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { UserContext, logOut } from '../../../services/authService';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  center: {
    marginLeft: '50%',
    marginTop: '10%',
  },
}));

const NewReservation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const user = useContext(UserContext);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const onSumbit = (values) => {
    const uploadItem = async () => {
      setLoading(true);
      try {
        await axiosInstance.post('reservations', values);
        enqueueSnackbar('Reservation created', {
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
    uploadItem();
  };
  if (loading) return <CircularProgress className={classes.center} />;
  return <ReservationForm onSubmit={onSumbit} />;
};

export default NewReservation;
