import React from 'react';
import ReactDOM from 'react-dom';

import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginModal from './../LoginModal';

afterEach(cleanup);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LoginModal onSubmit={jest.fn()} />, div);
});

it('Renders login dialog when the button is clicked', () => {
  const { getByTestId } = render(<LoginModal onSubmit={jest.fn()} />);
  const button = getByTestId('modalButton');
  fireEvent.click(button);
  expect(getByTestId('dialog')).toBeInTheDocument();
});

it('Does not render login dialog before the button is clicked', () => {
  const { queryByTestId } = render(<LoginModal onSubmit={jest.fn()} />);
  expect(queryByTestId('dialog')).toBeNull();
});

it('Closes login dialog if cancel button is clicked', async () => {
  const { getByTestId, queryByTestId } = render(<LoginModal onSubmit={jest.fn()} />);
  const button = getByTestId('modalButton');
  fireEvent.click(button);
  const cancelButton = getByTestId('cancelButton');
  fireEvent.click(cancelButton);
  await waitFor(() => {
    expect(queryByTestId('dialog')).toBeNull();
  });
});

it('Shows validation errors if submited without required values', async () => {
  const { getByTestId } = render(<LoginModal onSubmit={jest.fn()} />);
  const button = getByTestId('modalButton');
  fireEvent.click(button);
  const submitButton = getByTestId('confirmButton');
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(getByTestId('usernameError')).not.toBe(null);
    expect(getByTestId('usernameError')).toHaveTextContent('Username is required.');

    expect(getByTestId('passwordError')).not.toBe(null);
    expect(getByTestId('passwordError')).toHaveTextContent('Password is required.');
  });
});

it('Does not invoke onSubmit if there are validation errors', () => {
  const mockOnSubmit = jest.fn();
  const { getByTestId } = render(<LoginModal onSubmit={mockOnSubmit} />);
  const button = getByTestId('modalButton');
  fireEvent.click(button);
  const submitButton = getByTestId('confirmButton');
  fireEvent.click(submitButton);
  expect(mockOnSubmit).toHaveBeenCalledTimes(0);
});

it('Passes correct values to onSubmit', async () => {
  const mockOnSubmit = jest.fn();
  const { getByTestId } = render(<LoginModal onSubmit={mockOnSubmit} />);
  const button = getByTestId('modalButton');
  fireEvent.click(button);

  const submitButton = getByTestId('confirmButton');
  const usernameInput = getByTestId('usernameInput');
  const passwordInput = getByTestId('passwordInput');

  fireEvent.change(usernameInput, {
    target: {
      value: 'TestName',
    },
  });

  fireEvent.change(passwordInput, {
    target: {
      value: 'TestPassword',
    },
  });

  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(mockOnSubmit).toBeCalled();
    expect(mockOnSubmit).toBeCalledWith({ name: 'TestName', password: 'TestPassword' });
  });
});
