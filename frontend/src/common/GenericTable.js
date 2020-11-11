import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: '#9bceff',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  center: {
    marginLeft: '50%',
  },
}));

const GenericTable = ({
  columns,
  items,
  page,
  rowsPerPage,
  count,
  handlePageChange,
  handleRowsPerPageChange,
  onRowClick,
  isLoading,
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      <TableContainer>
        <Table data-testid="table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  className={classes.header}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <CircularProgress className={classes.center} />
                </TableCell>
              </TableRow>
            )}
          </TableHead>
          {!isLoading && (
            <TableBody>
              {items.map((row) => {
                return (
                  <TableRow
                    hover
                    onClick={() => {
                      onRowClick(row);
                    }}
                    tabIndex={-1}
                    key={row.id}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
      />
    </Paper>
  );
};

GenericTable.propTypes = {
  items: PropTypes.array,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  count: PropTypes.number,
  columns: PropTypes.array,
  handlePageChange: PropTypes.func,
  handleRowsPerPageChange: PropTypes.func,
  onRowClick: PropTypes.func,
  isLoading: PropTypes.bool,
};

GenericTable.defaultProps = {
  items: [],
  page: 0,
  rowsPerPage: 0,
  count: 0,
  columns: [],
  handlePageChange: () => {},
  handleRowsPerPageChange: () => {},
  onRowClick: () => {},
  isLoading: false,
};

export default GenericTable;
