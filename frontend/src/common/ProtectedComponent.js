import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../services/authService';

const ProtectedComponent = ({ children, roles }) => {
  const user = useContext(UserContext);

  if (!roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

ProtectedComponent.propTypes = {
  children: PropTypes.any.isRequired,
  roles: PropTypes.array.isRequired,
};

export default ProtectedComponent;
