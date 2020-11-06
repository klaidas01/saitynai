import React from 'react';
import PropTypes from 'prop-types';

const ProtectedComponent = ({ children, roles, role }) => {
  if (!roles.includes(role)) {
    return null;
  }

  return <div data-testid="protectedComponent">{children}</div>;
};

ProtectedComponent.propTypes = {
  children: PropTypes.any.isRequired,
  roles: PropTypes.array.isRequired,
  role: PropTypes.string.isRequired,
};

export default ProtectedComponent;
