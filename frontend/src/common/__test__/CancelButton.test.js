import React from 'react';
import ReactDOM from 'react-dom';
import CancelButton from './../CancelButton';

import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CancelButton text="Cancel" onClick={jest.fn()} />, div);
});

it('renders button text', () => {
  const { getByTestId } = render(<CancelButton text="Cancel" onClick={jest.fn()} />);
  expect(getByTestId('cancelButton')).toHaveTextContent('Cancel');
});

it('invokes onClick once when clicked', () => {
  const onClickMock = jest.fn();
  const { getByTestId } = render(<CancelButton text="Cancel" onClick={onClickMock} />);
  const button = getByTestId('cancelButton');
  fireEvent.click(button);
  expect(onClickMock).toHaveBeenCalledTimes(1);
});
