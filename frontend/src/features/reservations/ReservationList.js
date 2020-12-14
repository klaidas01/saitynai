import React, { useState, useEffect, useRef, useContext } from 'react';
import GenericTable from './../../common/GenericTable';
import TextField from '@material-ui/core/TextField';
import axiosInstance from './../../services/axiosInstance';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import SearchIcon from '@material-ui/icons/Search';
import { IconButton, InputAdornment, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NavButton from './../../common/NavButton';
import ProtectedComponent from './../../common/ProtectedComponent';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import GenericModal from '../../common/GenericModal';
import { UserContext } from './../../services/authService';
import StateCell from './StateCell';
import ConfirmButton from './../../common/ConfirmButton';

const useStyles = makeStyles(() => ({
  search: {
    flexGrow: '1',
  },
  container: {
    marginTop: '2vh',
    padding: '1%',
  },
  actions: {
    display: 'flex',
    marginBottom: '1%',
  },
  buttons: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
  },
}));

const ReservationList = ({ onRowClick, renderButtons }) => {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const didMount = useRef(false);
  const user = useContext(UserContext);

  const fetchItems = async (page, rowsPerPage, searchTerm) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('reservations', {
        params: {
          Page: page,
          RowsPerPage: rowsPerPage,
          SearchTerm: searchTerm,
        },
        user: user,
        setUser: user.setUser,
      });
      setItems(response.data.items);
      setCount(response.data.count);
      setRowsPerPage(rowsPerPage);
      setPage(page);
    } catch (e) {
      enqueueSnackbar('Could not get reservations', {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        variant: 'error',
      });
    }
    setIsLoading(false);
  };

  const Return = ({ row }) => {
    const markAsReturned = async (row) => {
      setIsLoading(true);
      try {
        await axiosInstance.patch(
          'reservations/' + row.id,
          {},
          { user: user, setUser: user.setUser }
        );
        await fetchItems(page, rowsPerPage, searchTerm);
      } catch (e) {
        enqueueSnackbar('Something went wrong', {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          variant: 'error',
        });
      }
      enqueueSnackbar('Reservation marked as returned', {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        variant: 'success',
      });
      setIsLoading(false);
    };

    return (
      <>
        {!row.isReturned && (
          <ConfirmButton text="Mark as returned" onClick={async () => await markAsReturned(row)} />
        )}
      </>
    );
  };

  const Buttons = ({ row }) => {
    const history = useHistory();
    const [open, setOpen] = useState(false);

    const remove = async (row) => {
      setIsLoading(true);
      try {
        await axiosInstance.delete('reservations/' + row.id, { user: user, setUser: user.setUser });
        await fetchItems(
          items.length !== 1 || count === 1 ? page : page - 1,
          rowsPerPage,
          searchTerm
        );
      } catch (e) {
        enqueueSnackbar('Something went wrong', {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          variant: 'error',
        });
      }
      enqueueSnackbar('Reservation deleted', {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        variant: 'success',
      });
      setIsLoading(false);
    };

    Return.propTypes = {
      row: PropTypes.object.isRequired,
    };

    return (
      <div className={classes.buttons}>
        <ProtectedComponent roles={['Administrator', 'Employee']}>
          {!row.isReturned && (
            <IconButton
              onClick={() => {
                history.push('/reservations/' + row.id + '/edit');
              }}
            >
              <EditIcon />
            </IconButton>
          )}
          <IconButton onClick={() => setOpen(true)}>
            <DeleteIcon />
          </IconButton>
          <GenericModal
            isOpen={open}
            title="Delete reservation"
            description="Are you sure you want to delete this reservation?"
            acceptName="Delete"
            declineName="Cancel"
            handleDecline={() => setOpen(false)}
            handleClose={() => setOpen(false)}
            handleAccept={async () => await remove(row)}
          />
        </ProtectedComponent>
      </div>
    );
  };

  Buttons.propTypes = {
    row: PropTypes.object.isRequired,
  };

  const columns = [
    { id: 'userName', label: 'Username', maxWidth: '5vw' },
    { id: 'bookName', label: 'Book name', maxWidth: '5vw' },
    { id: 'libraryName', label: 'Library name', maxWidth: '5vw' },
    {
      id: 'startDate',
      label: 'Start date',
      format: (value) => new Date(value).toLocaleDateString(),
      maxWidth: '5vw',
    },
    {
      id: 'returnDate',
      label: 'Return date',
      format: (value) => new Date(value).toLocaleDateString(),
      maxWidth: '5vw',
    },
    {
      id: 'state',
      label: 'Reservation state',
      Component: StateCell,
      align: 'center',
    },
    {
      id: 'lateFee',
      label: 'Late fee',
      format: (value) => (value ? value.toFixed(2) + '€' : '-'),
      align: 'center',
      maxWidth: '3vw',
    },
    {
      id: 'return',
      label: '',
      Component: Return,
      align: 'center',
    },
    { id: 'actions', label: '', Component: Buttons, align: 'right' },
  ];

  const handlePageChange = async (event, newPage) => {
    await fetchItems(newPage, rowsPerPage, searchTerm);
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (event) => {
    await fetchItems(0, +event.target.value, searchTerm);
  };

  useEffect(() => {
    const loadItems = async () => {
      await fetchItems(page, rowsPerPage, searchTerm);
    };
    loadItems();
  }, []);

  useEffect(() => {
    if (didMount.current) {
      const loadItems = async () => {
        await fetchItems(0, rowsPerPage, searchTerm);
      };
      const delayDebounceFn = setTimeout(() => {
        loadItems();
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    } else didMount.current = true;
  }, [searchTerm]);

  return (
    <Paper className={classes.container}>
      <div className={classes.actions}>
        <TextField
          className={classes.search}
          variant="outlined"
          label="Search"
          onChange={(event) => setSearchTerm(event.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton disabled>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {renderButtons && (
          <ProtectedComponent roles={['Administrator', 'Employee']}>
            <NavButton route="/reservations/create" text="Add new reservation" />
          </ProtectedComponent>
        )}
      </div>
      <GenericTable
        columns={columns}
        items={items}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        onRowClick={onRowClick}
        isLoading={isLoading}
        renderButtons={renderButtons}
        Buttons={Buttons}
      />
    </Paper>
  );
};

ReservationList.propTypes = {
  onRowClick: PropTypes.func,
  renderButtons: PropTypes.bool,
};

ReservationList.defaultProps = {
  onRowClick: () => {},
  renderButtons: true,
};

export default ReservationList;
