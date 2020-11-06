import React from 'react';
import ReactDOM from 'react-dom';
import ConfirmButton from './../ConfirmButton';

import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ConfirmButton text="Submit" onClick={jest.fn()} />, div);
});

it('renders button text', () => {
  const { getByTestId } = render(<ConfirmButton text="Submit" onClick={jest.fn()} />);
  expect(getByTestId('confirmButton')).toHaveTextContent('Submit');
});

it('invokes onClick once when clicked', () => {
  const onClickMock = jest.fn();
  const { getByTestId } = render(<ConfirmButton text="Submit" onClick={onClickMock} />);
  const button = getByTestId('confirmButton');
  fireEvent.click(button);
  expect(onClickMock).toHaveBeenCalledTimes(1);
});
