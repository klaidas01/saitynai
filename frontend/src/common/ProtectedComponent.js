import React from 'react';
import PropTypes from 'prop-types';

const ProtectedComponent = ({children, roles, role}) => {

  if (!roles.includes(role))
  {
    return null;
  } 

  return (
    <div>
      {children}
    </div>
  );
};

ProtectedComponent.propTypes = {
  children: PropTypes.any,
  roles: PropTypes.array,
  role: PropTypes.string
};

export default ProtectedComponent;