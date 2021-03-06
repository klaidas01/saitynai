import { React, useState, useEffect, useRef, useContext } from 'react';
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
import { UserContext } from '../../services/authService';

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
}));

const BookList = (props) => {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [switchValue, setSwtichValue] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const didMount = useRef(false);
  const user = useContext(UserContext);

  const fetchItems = async (page, rowsPerPage, searchTerm, availableOnly) => {
    setIsLoading(true);
    const path = props.match.params.libraryId
      ? 'libraries/' + props.match.params.libraryId + '/books'
      : 'books';
    try {
      const response = await axiosInstance.get(availableOnly ? path + '/available' : path, {
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
      enqueueSnackbar('Could not get books', {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        variant: 'error',
      });
    }
    setIsLoading(false);
  };

  const remove = async (item) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete('books/' + item.id, { user: user, setUser: user.setUser });
      await fetchItems(
        items.length !== 1 || count === 1 ? page : page - 1,
        rowsPerPage,
        searchTerm,
        switchValue
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
    enqueueSnackbar('Book deleted', {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
      variant: 'success',
    });
    setIsLoading(false);
  };

  const handleSwitchChange = async (event, value) => {
    await fetchItems(page, rowsPerPage, searchTerm, value);
    setSwtichValue(value);
  };

  const handlePageChange = async (event, newPage) => {
    await fetchItems(newPage, rowsPerPage, searchTerm, switchValue);
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (event) => {
    await fetchItems(0, +event.target.value, searchTerm, switchValue);
  };

  useEffect(() => {
    const loadItems = async () => {
      await fetchItems(page, rowsPerPage, searchTerm, switchValue);
    };
    loadItems();
  }, [props.match.params.libraryId]);

  useEffect(() => {
    if (didMount.current) {
      const loadItems = async () => {
        await fetchItems(0, rowsPerPage, searchTerm, switchValue);
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
        {props.renderButtons && (
          <ProtectedComponent
            roles={
              !props.match.params.libraryId || user.libraryId === +props.match.params.libraryId
                ? ['Administrator', 'Employee']
                : ['Administrator']
            }
          >
            {user.role === 'Employee' ? (
              <NavButton
                route={'/libraries/' + user.libraryId + '/books/create'}
                text="Add new book"
              />
            ) : (
              <NavButton route="books/create" text="Add new book" />
            )}
          </ProtectedComponent>
        )}
      </div>
      <ImageGridList
        items={items}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        handleRemoveBook={remove}
        isLoading={isLoading}
        switchValue={switchValue}
        onSwitch={handleSwitchChange}
      ></ImageGridList>
    </Paper>
  );
};

BookList.propTypes = {
  match: PropTypes.object,
  renderButtons: PropTypes.bool,
};

BookList.defaultProps = {
  match: { params: {} },
  renderButtons: true,
};

export default BookList;
