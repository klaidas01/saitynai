import { React, useContext, useState, useEffect } from 'react';
import ReservationForm from './ReservationForm';
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

const EditReservation = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const user = useContext(UserContext);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState({});

  useEffect(() => {
    const fetchReservation = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          '/reservations/' + props.match.params.reservationId
        );
        setReservation(response.data);
      } catch (e) {
        enqueueSnackbar('Something went wrong', {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          variant: 'error',
        });
        history.push('/libraries');
      }
      setLoading(false);
    };
    fetchReservation();
  }, []);

  const onSumbit = (values) => {
    const updateLibrary = async () => {
      setLoading(true);
      try {
        await axiosInstance.put('reservations/' + props.match.params.reservationId, values);
        enqueueSnackbar('Reservation updated', {
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
  return (
    <ReservationForm
      onSubmit={onSumbit}
      userId={reservation.userId}
      bookId={reservation.bookId}
      startDate={new Date(reservation.startDate)}
      returnDate={new Date(reservation.returnDate)}
    />
  );
};

EditReservation.propTypes = {
  match: PropTypes.object.isRequired,
};

export default EditReservation;
