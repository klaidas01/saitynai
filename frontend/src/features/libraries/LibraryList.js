import React, { useState, useEffect } from 'react';
import GenericTable from './../../common/GenericTable';
import TextField from '@material-ui/core/TextField';
import axiosInstance from './../../services/axiosInstance';

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'address', label: 'Address', minWidth: 170 },
];

const LibraryList = () => {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const fetchItems = async (page, rowsPerPage, searchTerm) => {
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
    } catch (e) {
      console.log(e);
    }
  };

  const handlePageChange = async (event, newPage) => {
    await fetchItems(newPage, rowsPerPage, searchTerm);
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (event) => {
    setPage(0);
    await fetchItems(0, +event.target.value, searchTerm);
    setRowsPerPage(+event.target.value);
  };

  useEffect(() => {
    const loadItems = async () => {
      fetchItems(page, rowsPerPage, searchTerm);
    };
    loadItems();
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      setPage(0);
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
        inputProps={{ 'data-testid': 'searchBar' }}
        label="Search"
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
      />
      <GenericTable
        columns={columns}
        items={items}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
};

export default LibraryList;
