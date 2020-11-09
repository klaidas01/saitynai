import React from 'react';
import ReactDOM from 'react-dom';
import GenericTable from './../GenericTable';

import { cleanup, render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const mockColumns = [
  { id: 'col1', label: 'Column1', minWidth: 170 },
  { id: 'col2', label: 'Column2', minWidth: 170, format: (value) => value.toFixed(2) },
  { id: 'col3', label: 'Column3', minWidth: 170 },
];

const mockItems = [
  { id: 1, col1: 'item1value1', col2: 2.999, col3: 'item1value3' },
  { id: 2, col1: 'item2value1', col2: 'item2value2', col3: 'item2value3' },
  { id: 3, col1: 'item3value1', col2: 'item3value2', col3: 'item3value3' },
  { id: 4, col1: 'item4value1', col2: 'item4value2', col3: 'item4value3' },
  { id: 5, col1: 'itemvalue1', col2: 'itemvalue2', col3: 'itemvalue3' },
  { id: 6, col1: 'item6value1', col2: 'item6value2', col3: 'item6value3' },
  { id: 7, col1: 'item7value1', col2: 'item7value2', col3: 'item7value3' },
];

afterEach(cleanup);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <GenericTable
      columns={mockColumns}
      items={mockItems}
      page={0}
      rowsPerPage={5}
      count={mockItems.length}
      handlePageChange={jest.fn()}
      handleRowsPerPageChange={jest.fn()}
    />,
    div
  );
});

it('renders columns', async () => {
  const { getByTestId } = render(
    <GenericTable
      columns={mockColumns}
      items={mockItems}
      page={0}
      rowsPerPage={5}
      count={mockItems.length}
      handlePageChange={jest.fn()}
      handleRowsPerPageChange={jest.fn()}
    />
  );

  const table = getByTestId('table');

  await waitFor(() => {
    expect(table).not.toBe(null);
    expect(table).toHaveTextContent('Column1');
    expect(table).toHaveTextContent('Column2');
    expect(table).toHaveTextContent('Column3');
  });
});

it('Renders table items', async () => {
  const pageChangeMock = jest.fn();
  const { getByTestId } = render(
    <GenericTable
      columns={mockColumns}
      items={mockItems}
      page={0}
      rowsPerPage={5}
      count={mockItems.length}
      handlePageChange={pageChangeMock}
      handleRowsPerPageChange={jest.fn()}
    />
  );

  const table = getByTestId('table');

  await waitFor(() => {
    expect(table).toHaveTextContent('itemvalue1');
    expect(table).toHaveTextContent('item4value1');
    expect(table).toHaveTextContent('3.00');
  });
});

it('Next page button invokes handler', async () => {
  const pageChangeMock = jest.fn();
  const { getByTitle } = render(
    <GenericTable
      columns={mockColumns}
      items={mockItems}
      page={0}
      rowsPerPage={5}
      count={mockItems.length}
      handlePageChange={pageChangeMock}
      handleRowsPerPageChange={jest.fn()}
    />
  );

  const nextPageButton = getByTitle('Next page');

  fireEvent.click(nextPageButton);

  await waitFor(() => {
    expect(pageChangeMock).toHaveBeenCalledTimes(1);
  });
});

it('Previous page button invokes handler', async () => {
  const pageChangeMock = jest.fn();
  const { getByTitle } = render(
    <GenericTable
      columns={mockColumns}
      items={mockItems}
      page={1}
      rowsPerPage={5}
      count={mockItems.length}
      handlePageChange={pageChangeMock}
      handleRowsPerPageChange={jest.fn()}
    />
  );

  const nextPageButton = getByTitle('Previous page');

  fireEvent.click(nextPageButton);

  await waitFor(() => {
    expect(pageChangeMock).toHaveBeenCalledTimes(1);
  });
});
