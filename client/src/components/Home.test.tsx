import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Socket from '../utils/Socket';
import Home from './Home';

jest.mock('../utils/Socket');
let setUsernameMock: jest.Mock;
beforeEach(() => {
  setUsernameMock = jest.fn();
  render(<Home setUsername={setUsernameMock}></Home>);
});
describe('home page', () => {
  it("doesn't allow empty username", () => {
    const usernameInput = screen.getByPlaceholderText(/enter your username/i);
    const submitBtn = screen.getByDisplayValue(/start game/i);
    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.click(submitBtn);
    expect(Socket.initializeSocket).not.toBeCalled();
  });
  it('sends username to server', () => {
    const usernameInput = screen.getByPlaceholderText(/enter your username/i);
    const submitBtn = screen.getByDisplayValue(/start game/i);
    const sampleUsername = 'pocahontas';
    fireEvent.change(usernameInput, { target: { value: sampleUsername } });
    fireEvent.click(submitBtn);
    expect(Socket.initializeSocket).toBeCalledWith(sampleUsername);
  });
});
afterEach(cleanup);
