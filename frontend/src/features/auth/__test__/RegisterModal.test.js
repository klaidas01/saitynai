import React from 'react';
import ReactDOM from 'react-dom';

import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RegisterModal from '../RegisterModal';

afterEach(cleanup);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RegisterModal onSubmit={jest.fn()} />, div);
});

it('Renders login dialog when the button is clicked', () => {
  const { getByTestId } = render(<RegisterModal onSubmit={jest.fn()} />);
  const button = getByTestId('modalButton');
  fireEvent.click(button);
  expect(getByTestId('dialog')).toBeInTheDocument();
});

it('Does not render login dialog before the button is clicked', () => {
  const { queryByTestId } = render(<RegisterModal onSubmit={jest.fn()} />);
  expect(queryByTestId('dialog')).toBeNull();
});

it('Closes login dialog if cancel button is clicked', async () => {
  const { getByTestId, queryByTestId } = render(<RegisterModal onSubmit={jest.fn()} />);
  const button = getByTestId('modalButton');
  fireEvent.click(button);
  const cancelButton = getByTestId('cancelButton');
  fireEvent.click(cancelButton);
  await waitFor(() => {
    expect(queryByTestId('dialog')).toBeNull();
  });
});

it('Shows validation errors if submited without required values', async () => {
  const { getByTestId } = render(<RegisterModal onSubmit={jest.fn()} />);
  const button = getByTestId('modalButton');
  fireEvent.click(button);
  const submitButton = getByTestId('confirmButton');
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(getByTestId('usernameError')).not.toBe(null);
    expect(getByTestId('usernameError')).toHaveTextContent('Username is required.');

    expect(getByTestId('fnameError')).not.toBe(null);
    expect(getByTestId('fnameError')).toHaveTextContent('First name is required.');

    expect(getByTestId('lnameError')).not.toBe(null);
    expect(getByTestId('lnameError')).toHaveTextContent('Last name is required.');

    expect(getByTestId('emailError')).not.toBe(null);
    expect(getByTestId('emailError')).toHaveTextContent('E-mail is required.');

    expect(getByTestId('passwordError')).not.toBe(null);
    expect(getByTestId('passwordError')).toHaveTextContent('Password is required.');
  });
});

it('Does not invoke onSubmit if there are validation errors', () => {
  const mockOnSubmit = jest.fn();
  const { getByTestId } = render(<RegisterModal onSubmit={mockOnSubmit} />);
  const button = getByTestId('modalButton');
  fireEvent.click(button);
  const submitButton = getByTestId('confirmButton');
  fireEvent.click(submitButton);
  expect(mockOnSubmit).toHaveBeenCalledTimes(0);
});

it('Passes correct values to onSubmit', async () => {
  const mockOnSubmit = jest.fn();
  const { getByTestId } = render(<RegisterModal onSubmit={mockOnSubmit} />);
  const button = getByTestId('modalButton');
  fireEvent.click(button);

  const submitButton = getByTestId('confirmButton');
  const usernameInput = getByTestId('usernameInput');
  const fnameInput = getByTestId('fnameInput');
  const lnameInput = getByTestId('lnameInput');
  const emailInput = getByTestId('emailInput');
  const passwordInput = getByTestId('passwordInput');

  fireEvent.change(usernameInput, {
    target: {
      value: 'TestName',
    },
  });

  fireEvent.change(fnameInput, {
    target: {
      value: 'TestFirstName',
    },
  });

  fireEvent.change(lnameInput, {
    target: {
      value: 'TestLastName',
    },
  });

  fireEvent.change(emailInput, {
    target: {
      value: 'TestEmail@email.com',
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
    expect(mockOnSubmit).toBeCalledWith({
      name: 'TestName',
      password: 'TestPassword',
      fname: 'TestFirstName',
      lname: 'TestLastName',
      email: 'TestEmail@email.com',
    });
  });
});

it('displays validation error when invalid email is submited', async () => {
  const { getByTestId } = render(<RegisterModal onSubmit={jest.fn()} />);
  const button = getByTestId('modalButton');
  fireEvent.click(button);
  const submitButton = getByTestId('confirmButton');
  const emailInput = getByTestId('emailInput');

  fireEvent.change(emailInput, {
    target: {
      value: 'invalidEmail',
    },
  });

  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(getByTestId('emailError')).not.toBe(null);
    expect(getByTestId('emailError')).toHaveTextContent('Invalid E-mail.');
  });
});
