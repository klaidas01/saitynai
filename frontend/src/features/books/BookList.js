import { React } from 'react';
import PropTypes from 'prop-types';

const BookList = (props) => {
  return (
    <div>Book list. Library id: {props.match.params.libraryId}</div>
  );
};

BookList.propTypes = {
  match: PropTypes.object
};

export default BookList;