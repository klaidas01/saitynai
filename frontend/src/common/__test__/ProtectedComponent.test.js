import React from 'react';
import ReactDOM from 'react-dom';

import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProtectedComponent from './../ProtectedComponent';

afterEach(cleanup);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ProtectedComponent roles={['Administrator', 'Employee']} role="Guest">
      Child
    </ProtectedComponent>,
    div
  );
});

it('renders children when role is in the role list', () => {
  const { getByText } = render(
    <ProtectedComponent roles={['Administrator', 'Employee']} role="Administrator">
      Child
    </ProtectedComponent>
  );
  expect(getByText('Child')).toBeInTheDocument();
});

it('does not render children when role is not in the role list', () => {
  const { queryByText } = render(
    <ProtectedComponent roles={['Administrator', 'Employee']} role="Guest">
      Child
    </ProtectedComponent>
  );
  expect(queryByText('Child')).toBeNull();
});
