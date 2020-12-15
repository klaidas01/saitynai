import React from 'react';
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
import { Box } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: '#9bceff',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  container: {
    overflow: 'hidden',
  },
  center: {
    marginLeft: '50%',
  },
  actions: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
  },
  notFound: {
    color: '#A8A8A8',
  },
  table: {
    width: '100%',
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
  hover,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.container} border={1} borderColor="grey.400" borderRadius={16}>
      <TableContainer className={classes.table}>
        <Table>
          <TableHead data-testid="table">
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, width: column.maxWidth }}
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
              {(!items || items.length === 0) && (
                <TableRow>
                  <TableCell className={classes.notFound} align="center" colSpan={columns.length}>
                    No entries
                  </TableCell>
                </TableRow>
              )}
              {items.map((row) => {
                return (
                  <TableRow
                    hover={hover}
                    onClick={() => {
                      onRowClick(row);
                    }}
                    tabIndex={-1}
                    key={row.id}
                  >
                    {columns.map((column) => {
                      const value = column.nested
                        ? row[column.id][column.nestedField]
                        : row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <div
                            style={{
                              minWidth: column.minWidth,
                              width: column.maxWidth,
                              wordWrap: 'break-word',
                            }}
                          >
                            {column.Component ? (
                              <column.Component row={row} />
                            ) : column.format ? (
                              column.format(value)
                            ) : (
                              value
                            )}
                          </div>
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
    </Box>
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
  hover: PropTypes.bool,
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
  hover: false,
};

export default GenericTable;
