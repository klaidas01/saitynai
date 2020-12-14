/* eslint-disable react/prop-types */
import LibraryList from './../LibraryList';
import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom/extend-expect';
import MockAdapter from 'axios-mock-adapter';
import axiosInstance from './../../../services/axiosInstance';
import { act } from 'react-dom/test-utils';
import { cleanup, waitFor, render, fireEvent } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';

const axiosMock = new MockAdapter(axiosInstance);

axiosMock
  .onGet('libraries', { params: { Page: 0, RowsPerPage: 5, SearchTerm: '' } })
  .reply(200, {
    items: [
      { id: 1, name: 'FirstGroup1', address: 'Address' },
      { id: 2, name: 'FirstGroup2', address: 'Address' },
      { id: 3, name: 'FirstGroup3', address: 'Address' },
      { id: 4, name: 'SecondGroup1', address: 'Address' },
      { id: 5, name: 'FirstGroup4', address: 'Address' },
    ],
    count: 7,
  })
  .onGet('libraries', { params: { Page: 0, RowsPerPage: 5, SearchTerm: 'Second' } })
  .reply(200, {
    items: [{ id: 4, name: 'SecondGroup1', address: 'Address' }],
    count: 1,
  })
  .onGet('libraries', { params: { Page: 1, RowsPerPage: 5, SearchTerm: '' } })
  .reply(200, {
    items: [
      { id: 6, name: 'FirstGroup5', address: 'Address' },
      { id: 7, name: 'FirstGroup6', address: 'Address' },
    ],
    count: 1,
  })
  .onGet('libraries', { params: { Page: 0, RowsPerPage: 10, SearchTerm: '' } })
  .reply(200, {
    items: [
      { id: 1, name: 'FirstGroup1', address: 'Address' },
      { id: 2, name: 'FirstGroup2', address: 'Address' },
      { id: 3, name: 'FirstGroup3', address: 'Address' },
      { id: 4, name: 'SecondGroup1', address: 'Address' },
      { id: 5, name: 'FirstGroup4', address: 'Address' },
      { id: 6, name: 'FirstGroup5', address: 'Address' },
      { id: 7, name: 'FirstGroup6', address: 'Address' },
    ],
    count: 1,
  });

jest.mock('../../../common/GenericTable.js', () => {
  return {
    __esModule: true,
    // eslint-disable-next-line react/display-name
    default: (props) => (
      <div data-testid="table">
        {props.columns.map((item) => item.label).toString()},
        {props.items.map((item) => item.name + ',' + item.address).toString()}
        <button data-testid="nextPageButton" onClick={() => props.handlePageChange({}, 1)} />
        <button
          data-testid="rowsPerPageButton"
          onClick={() => props.handleRowsPerPageChange({ target: { value: 10 } })}
        />
      </div>
    ),
  };
});

afterEach(cleanup);

it('renders without crashing', async () => {
  const div = document.createElement('div');
  await act(async () => {
    ReactDOM.render(
      <SnackbarProvider>
        <LibraryList />
      </SnackbarProvider>,
      div
    );
  });
});

it('renders columns', async () => {
  const { getByTestId } = render(
    <SnackbarProvider>
      <LibraryList />
    </SnackbarProvider>
  );

  const table = getByTestId('table');

  await waitFor(() => {
    expect(table).toHaveTextContent('Name');
    expect(table).toHaveTextContent('Address');
  });
});

it('fetches first page of libraries on render', async () => {
  const { getByTestId } = render(
    <SnackbarProvider>
      <LibraryList />
    </SnackbarProvider>
  );

  const table = getByTestId('table');

  await waitFor(() => {
    expect(table).toHaveTextContent('FirstGroup1');
    expect(table).toHaveTextContent('FirstGroup4');
    expect(table).not.toHaveTextContent('FirstGroup5');
  });
});

it('Search fetches filtered libraries', async () => {
  const { getByTestId } = render(
    <SnackbarProvider>
      <LibraryList />
    </SnackbarProvider>
  );

  const SearchBar = getByTestId('searchBar');
  const table = getByTestId('table');
  fireEvent.change(SearchBar, {
    target: {
      value: 'Second',
    },
  });
  await waitFor(() => {
    expect(table).not.toHaveTextContent('FirstGroup4');
    expect(table).toHaveTextContent('SecondGroup1');
  });
});

it('Next page button fetches second page of libraries', async () => {
  const { getByTestId } = render(
    <SnackbarProvider>
      <LibraryList />
    </SnackbarProvider>
  );

  const table = getByTestId('table');
  const nextPageButton = getByTestId('nextPageButton');

  fireEvent.click(nextPageButton);

  await waitFor(() => {
    expect(table).toHaveTextContent('FirstGroup5');
    expect(table).not.toHaveTextContent('FirstGroup4');
  });
});

it('Increasing rows per page fetches more libraries', async () => {
  const { getByTestId } = render(
    <SnackbarProvider>
      <LibraryList />
    </SnackbarProvider>
  );

  const table = getByTestId('table');
  const rowsPerPageButton = getByTestId('rowsPerPageButton');

  fireEvent.click(rowsPerPageButton);

  await waitFor(() => {
    expect(table).toHaveTextContent('FirstGroup5');
    expect(table).toHaveTextContent('FirstGroup4');
  });
});
