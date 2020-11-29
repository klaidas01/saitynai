import React, { useState, useContext } from 'react';
import {
  Typography,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Box,
} from '@material-ui/core';
import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import defaultCover from './Images/CoverNotAvailable.jpg';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import BookModal from './BookModal';
import ProtectedComponent from '../../common/ProtectedComponent';
import { UserContext } from '../../services/authService';
import GenericModal from './../../common/GenericModal';
import { useHistory } from 'react-router-dom';
import CustomPagination from './CustomPagination';

const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: '#9bceff',
    color: 'white',
    padding: '1.5%',
    paddingLeft: '5%',
    marginBottom: '3%',
    borderRadius: '16px 16px 0px 0px',
  },
  center: {
    marginLeft: '50%',
  },
  container: {
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingBottom: '3%',
  },
  cover: {
    height: '14vw',
    width: '100%',
  },
  coverMd: {
    height: '25vw',
    width: '100%',
  },
  button: {
    color: 'white',
  },
  pagination: {
    borderTop: '1px solid #bdbdbd',
  },
  notFound: {
    color: '#A8A8A8',
    margin: 'auto',
    width: '100%',
    textAlign: 'center',
  },
}));

const ImageGridList = ({
  items,
  page,
  rowsPerPage,
  count,
  switchValue,
  handlePageChange,
  handleRowsPerPageChange,
  handleRemoveBook,
  onSwitch,
  isLoading,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const mediumBreakpoint = useMediaQuery(theme.breakpoints.up('lg'));
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState({ library: {} });
  const user = useContext(UserContext);
  const [openDelete, setOpenDelete] = useState(false);
  const history = useHistory();

  const onBookClick = (item) => {
    setBook(item);
    setOpen(true);
  };

  return (
    <Box border={1} borderColor="grey.400" borderRadius={16}>
      <BookModal open={open} book={book} handleClose={() => setOpen(false)} />
      <Box className={classes.header}>
        <Typography component="h2" variant="h6">
          Books
        </Typography>
      </Box>
      <div className={classes.container}>
        {isLoading && <CircularProgress className={classes.center} />}
        {!isLoading && (
          <GridList cellHeight="auto" spacing={30} cols={mediumBreakpoint ? 5 : 3}>
            {(!items || items.length === 0) && <div className={classes.notFound}> No entries</div>}
            {items.map((tile) => (
              <GridListTile key={tile.id}>
                <img
                  src={tile.coverImage ? `data:image/jpeg;base64,${tile.coverImage}` : defaultCover}
                  alt={tile.title}
                  className={mediumBreakpoint ? classes.cover : classes.coverMd}
                />
                <ProtectedComponent
                  roles={
                    user.role === 'Employee' && tile.libraryId === user.libraryId
                      ? ['Administrator', 'Employee']
                      : ['Administrator']
                  }
                >
                  <GridListTileBar
                    titlePosition="top"
                    actionIcon={
                      <>
                        <IconButton
                          className={classes.button}
                          onClick={() => {
                            history.push('/books/' + tile.id + '/edit');
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          className={classes.button}
                          onClick={() => {
                            setBook(tile);
                            setOpenDelete(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    }
                  />
                </ProtectedComponent>
                <GridListTileBar
                  title={tile.title}
                  subtitle={<span>by: {tile.author}</span>}
                  actionIcon={
                    <IconButton
                      aria-label={`info about ${tile.title}`}
                      className={classes.button}
                      onClick={() => onBookClick(tile)}
                    >
                      <InfoOutlinedIcon />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        )}
      </div>
      <div className={classes.pagination}>
        <TablePagination
          labelRowsPerPage="Books per page"
          rowsPerPageOptions={[10, 20, 40]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          test="test"
          ActionsComponent={() => (
            <CustomPagination
              count={count}
              page={page}
              rowsPerPage={rowsPerPage}
              onChangePage={handlePageChange}
              switchValue={switchValue}
              onSwitch={onSwitch}
            />
          )}
        />
      </div>
      <GenericModal
        isOpen={openDelete}
        title="Delete book"
        description="Are you sure you want to delete this book?"
        acceptName="Delete"
        declineName="Cancel"
        handleDecline={() => setOpenDelete(false)}
        handleClose={() => setOpenDelete(false)}
        handleAccept={async () => {
          setOpenDelete(false);
          await handleRemoveBook(book);
        }}
      />
    </Box>
  );
};

ImageGridList.propTypes = {
  items: PropTypes.array,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  count: PropTypes.number,
  handlePageChange: PropTypes.func,
  handleRowsPerPageChange: PropTypes.func,
  isLoading: PropTypes.bool,
  handleRemoveBook: PropTypes.func,
  switchValue: PropTypes.bool,
  onSwitch: PropTypes.func,
};

ImageGridList.defaultProps = {
  items: [],
  page: 0,
  rowsPerPage: 0,
  count: 0,
  handlePageChange: () => {},
  handleRowsPerPageChange: () => {},
  handleRemoveBook: () => {},
  isLoading: false,
  switchValue: false,
  onSwitch: () => {},
};

export default ImageGridList;
