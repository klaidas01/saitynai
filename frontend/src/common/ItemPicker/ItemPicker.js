import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../../services/axiosInstance';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Populatedtable from './PopulatedTable';

const ItemPicker = ({
  path,
  columns,
  className,
  onChange,
  value,
  displayField,
  label,
  disabled,
}) => {
  const [item, setItem] = useState('');
  const [shrink, setShrink] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRowClick = (row) => {
    setItem(row);
    onChange(row.id);
    setShrink(true);
    handleClose();
  };

  useEffect(() => {
    const fetchItem = async () => {
      const response = await axiosInstance.get(path + '/' + value);
      setItem(response.data);
      onChange(response.data.id);
      setShrink(true);
    };
    if (value) fetchItem();
  }, [value]);

  return (
    <div>
      <TextField
        InputProps={{
          readOnly: true,
        }}
        onClick={handleClickOpen}
        className={className}
        fullWidth
        value={item[displayField] ? item[displayField] : ''}
        variant="outlined"
        label={label}
        InputLabelProps={{ shrink: shrink }}
        disabled={disabled}
      />
      <Dialog
        data-testid="dialog"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth="sm"
      >
        <Populatedtable onRowClick={(row) => handleRowClick(row)} columns={columns} path={path} />
      </Dialog>
    </div>
  );
};

ItemPicker.propTypes = {
  path: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  value: PropTypes.any,
  disabled: PropTypes.bool,
  displayField: PropTypes.string,
  label: PropTypes.string.isRequired,
};

ItemPicker.defaultProps = {
  className: '',
  value: undefined,
  disabled: false,
  displayField: 'name',
};

export default ItemPicker;
