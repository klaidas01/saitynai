import { React, useState, useEffect, useContext } from 'react';
import ImageGridList from './ImageGridList';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../services/axiosInstance';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import { IconButton, InputAdornment, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NavButton from '../../common/NavButton';
import PropTypes from 'prop-types';
import ProtectedComponent from '../../common/ProtectedComponent';
import { RoleContext } from '../../services/authService';

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

const BookList = (props) => {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const role = useContext(RoleContext);

  const fetchItems = async (page, rowsPerPage, searchTerm) => {
    try {
      const response = await axiosInstance.get(
        props.match.params.libraryId
          ? 'libraries/' + props.match.params.libraryId + '/books'
          : 'books',
        {
          params: {
            Page: page,
            RowsPerPage: rowsPerPage,
            SearchTerm: searchTerm,
          },
        }
      );
      setItems(response.data.items);
      setCount(response.data.count);
      setRowsPerPage(rowsPerPage);
      setPage(page);
    } catch (e) {
      enqueueSnackbar('Could not get books', {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        variant: 'error',
      });
    }
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
      setIsLoading(true);
      await fetchItems(page, rowsPerPage, searchTerm);
      setIsLoading(false);
    };
    loadItems();
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      await fetchItems(0, rowsPerPage, searchTerm);
    };
    const delayDebounceFn = setTimeout(() => {
      loadItems();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
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
        <ProtectedComponent role={role} roles={['Administrator', 'Employee']}>
          <NavButton route="books/create" text="Add new book" />
        </ProtectedComponent>
      </div>
      <ImageGridList
        items={items}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        isLoading={isLoading}
      ></ImageGridList>
    </Paper>
  );
};

BookList.propTypes = {
  match: PropTypes.object,
};

BookList.defaultProps = {
  match: { params: {} },
};

export default BookList;

/*
Book list. Library id: {props.match.params.libraryId}
      <Button type="button" component={NavLink} to="/books/create">
        Temp book form link
      </Button> 
*/
