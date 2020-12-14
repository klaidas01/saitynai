import React, { useState, useEffect, useRef, useContext } from 'react';
import GenericTable from './../../common/GenericTable';
import TextField from '@material-ui/core/TextField';
import axiosInstance from './../../services/axiosInstance';
import { useSnackbar } from 'notistack';
import SearchIcon from '@material-ui/icons/Search';
import { IconButton, InputAdornment, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { UserContext } from './../../services/authService';
import StateCell from './StateCell';

const useStyles = makeStyles(() => ({
  search: {
    flexGrow: '1',
  },
  container: {
    marginTop: '2%',
    padding: '1%',
  },
  actions: {
    display: 'flex',
    marginBottom: '1%',
  },
}));

const UserReservationList = () => {
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
      const response = await axiosInstance.get('reservations/me', {
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

  const columns = [
    { id: 'userName', label: 'Username', maxWidth: '7vw' },
    { id: 'bookName', label: 'Book name', maxWidth: '7vw' },
    { id: 'libraryName', label: 'Library name', maxWidth: '7vw' },
    {
      id: 'startDate',
      label: 'Start date',
      format: (value) => new Date(value).toLocaleDateString(),
      maxWidth: '7vw',
    },
    {
      id: 'returnDate',
      label: 'Return date',
      format: (value) => new Date(value).toLocaleDateString(),
      maxWidth: '7vw',
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
      maxWidth: '5vw',
    },
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
      </div>
      <GenericTable
        columns={columns}
        items={items}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        isLoading={isLoading}
      />
    </Paper>
  );
};

export default UserReservationList;
