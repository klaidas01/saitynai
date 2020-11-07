import React, { useState, useEffect } from 'react';
import GenericTable from './../../common/GenericTable';
import TextField from '@material-ui/core/TextField';

const columns = [
  { id: 'col1', label: 'Column1', minWidth: 170 },
  { id: 'col2', label: 'Column2', minWidth: 170 },
  { id: 'col3', label: 'Column3', minWidth: 170 },
];

const items = [
  { id: 1, col1: 'item1value1', col2: 'item1value2', col3: 'item1value3' },
  { id: 2, col1: 'iteem2value1', col2: 'item2value2', col3: 'item2value3' },
  { id: 3, col1: 'item3value1', col2: 'item3value2', col3: 'item3value3' },
  { id: 4, col1: 'item4value1', col2: 'item4value2', col3: 'item4value3' },
  { id: 5, col1: 'item5value1', col2: 'item5value2', col3: 'item5value3' },
  { id: 6, col1: 'item6value1', col2: 'item6value2', col3: 'item6value3' },
  { id: 7, col1: 'item7value1', col2: 'item7value2', col3: 'item7value3' },
];

const getItems = async (page, rowsPerPage) => {
  const data = items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return new Promise((resolve) => {
    const result = { items: data, count: items.length };
    setTimeout(() => {
      resolve(result);
    }, 100);
  });
};

const filterItems = async (page, rowsPerPage, searchTerm) => {
  const filteredData = items.filter((obj) => {
    return obj.col1.indexOf(searchTerm) !== -1;
  });
  const data = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return new Promise((resolve) => {
    const result = { items: data, count: filteredData.length };
    setTimeout(() => {
      resolve(result);
    }, 100);
  });
};

const LibraryList = () => {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const handlePageChange = async (event, newPage) => {
    if (searchTerm) {
      const filteredData = await filterItems(newPage, rowsPerPage, searchTerm);
      setItems(filteredData.items);
      setCount(filteredData.count);
    } else {
      const data = await getItems(newPage, rowsPerPage);
      setItems(data.items);
      setCount(data.count);
    }
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (event) => {
    if (searchTerm) {
      const filteredData = await filterItems(0, +event.target.value, searchTerm);
      setItems(filteredData.items);
      setCount(filteredData.count);
    } else {
      const data = await getItems(0, +event.target.value);
      setItems(data.items);
      setCount(data.count);
    }
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const loadItems = async () => {
      const data = await getItems(page, rowsPerPage);
      setItems(data.items);
      setCount(data.count);
    };
    loadItems();
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      if (searchTerm) {
        const filteredData = await filterItems(0, rowsPerPage, searchTerm);
        setItems(filteredData.items);
        setCount(filteredData.count);
      } else {
        const data = await getItems(page, rowsPerPage);
        setItems(data.items);
        setCount(data.count);
      }
      setPage(0);
    };
    const delayDebounceFn = setTimeout(() => {
      loadItems();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div>
      <TextField label="Search" onChange={(e) => setSearchTerm(e.target.value)} fullWidth />
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
