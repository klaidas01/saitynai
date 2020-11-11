import { React } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { NavLink } from 'react-router-dom';

const BookList = (props) => {
  return (
    <div>
      Book list. Library id: {props.match.params.libraryId}
      <Button type="button" component={NavLink} to="/books/create">
        Temp book form link
      </Button>
    </div>
  );
};

BookList.propTypes = {
  match: PropTypes.object.isRequired,
};

export default BookList;
