import { React, useState, useEffect } from 'react';
import BookList from './BookList';
import { useSnackbar } from 'notistack';
import axiosInstance from './../../services/axiosInstance';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import { IconButton, InputAdornment } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { NavLink } from 'react-router-dom';

const AllBookList = () => {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchItems = async (page, rowsPerPage, searchTerm) => {
    try {
      const response = await axiosInstance.get('books', {
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
    <div>
      <TextField
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
      <Button type="button" component={NavLink} to="/books/create">
        Temp book create
      </Button>
      <BookList
        items={items}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        isLoading={isLoading}
      ></BookList>
    </div>
  );
};

export default AllBookList;

/*
Book list. Library id: {props.match.params.libraryId}
      <Button type="button" component={NavLink} to="/books/create">
        Temp book form link
      </Button> 
*/
