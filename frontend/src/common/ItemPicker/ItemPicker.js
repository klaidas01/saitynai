import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../../services/axiosInstance';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Populatedtable from './PopulatedTable';
import { UserContext } from '../../services/authService';

const ItemPicker = ({
  path,
  getByIdPath,
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
  const user = useContext(UserContext);
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
      const response = await axiosInstance.get((getByIdPath ? getByIdPath : path) + '/' + value, {
        user: user,
        setUser: user.setUser,
      });
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
  getByIdPath: PropTypes.string,
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
  getByIdPath: '',
};

export default ItemPicker;
