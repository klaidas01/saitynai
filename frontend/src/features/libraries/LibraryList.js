import React, { useState, useEffect, useContext, useRef } from 'react';
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
import { UserContext } from '../../services/authService';

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

const LibraryList = ({ onRowClick, renderButtons }) => {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const user = useContext(UserContext);
  const didMount = useRef(false);

  const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'address', label: 'Address', minWidth: 170 },
  ];

  const fetchItems = async (page, rowsPerPage, searchTerm) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('libraries', {
        params: {
          Page: page,
          RowsPerPage: rowsPerPage,
          SearchTerm: searchTerm,
        },
      });
      setItems(response.data.items);
      setCount(response.data.count);
      setRowsPerPage(rowsPerPage);
      setPage(page);
    } catch (e) {
      enqueueSnackbar('Could not get libraries', {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        variant: 'error',
      });
    }
    setIsLoading(false);
  };

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
          onChange={(e) => setSearchTerm(e.target.value)}
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
          <ProtectedComponent role={user.role} roles={['Administrator']}>
            <NavButton route="/libraries/create" text="Add new library" />
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
      />
    </Paper>
  );
};

LibraryList.propTypes = {
  onRowClick: PropTypes.func,
  renderButtons: PropTypes.bool,
};

LibraryList.defaultProps = {
  onRowClick: () => {},
  renderButtons: true,
};

export default LibraryList;
