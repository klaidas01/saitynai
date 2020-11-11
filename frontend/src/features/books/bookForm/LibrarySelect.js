import { React, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import LibraryList from './../../libraries/LibraryList';

const LibrarySelect = ({ className, setId }) => {
  const [value, setValue] = useState('');
  const [shrink, setShrink] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRowClick = (row) => {
    setValue(row);
    setId(+row.id);
    setShrink(true);
    handleClose();
  };

  return (
    <div>
      <TextField
        InputProps={{
          readOnly: true,
        }}
        onClick={handleClickOpen}
        className={className}
        fullWidth
        value={value ? value.name : ''}
        variant="outlined"
        label="Book's library"
        InputLabelProps={{ shrink: shrink }}
      />
      <Dialog
        data-testid="dialog"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth="sm"
      >
        <LibraryList onRowClick={(row) => handleRowClick(row)} />
      </Dialog>
    </div>
  );
};

LibrarySelect.propTypes = {
  setId: PropTypes.func.isRequired,
  className: PropTypes.string,
};

LibrarySelect.defaultProps = {
  className: '',
};

export default LibrarySelect;
