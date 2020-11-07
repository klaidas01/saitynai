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

const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: '#9bceff',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  container: {
    marginTop: '5%',
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
          </TableHead>
          <TableBody>
            {items.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
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
  items: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  columns: PropTypes.array.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handleRowsPerPageChange: PropTypes.func.isRequired,
};

export default GenericTable;
