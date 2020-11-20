import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../services/authService';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component, path, exact, roles }) => {
  const user = useContext(UserContext);

  return roles.includes(user.role) ? (
    <Route exact={exact} path={path} component={component} />
  ) : (
    <Redirect to="/libraries" />
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.any.isRequired,
  roles: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
};

ProtectedRoute.defaultProps = {
  exact: true,
};

export default ProtectedRoute;
