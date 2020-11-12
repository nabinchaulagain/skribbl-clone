import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import socketMock from '../utils/socket';
import Chatbox from './Chatbox';
import mockServerSocket from '../__mocks__/serverSocket';
import { act } from 'react-dom/test-utils';

jest.mock('../utils/socket');

describe('chatbox', (): void => {
  beforeEach((): void => {
    //@ts-expect-error
    socketMock.listeners = {};
    //@ts-expect-error
    socketMock.on = jest.fn((msg: string, cb: () => void) => {
      //@ts-expect-error
      if (!socketMock.listeners[msg]) {
        //@ts-expect-error
        socketMock.listeners[msg] = [];
      }
      //@ts-expect-error
      socketMock.listeners[msg].push(cb);
    });
  });
  it('shows chat message', (): void => {
    const serverSocket = mockServerSocket(socketMock);
    render(<Chatbox></Chatbox>);
    act((): void => {
      serverSocket.emit('chatMsg', { type: 'chat', msg: 'test message' });
    });
    act((): void => {
      serverSocket.emit('chatMsg', {
        type: 'chat',
        msg: 'test message 2',
      });
    });
    expect(screen.getAllByTestId('chatbox-message')).toHaveLength(2);
  });
  it('sends chat message to server', (): void => {
    const serverSocket = mockServerSocket(socketMock);
    render(<Chatbox></Chatbox>);
    const input = screen.getByTestId('chat-input');
    const form = input.parentNode;
    fireEvent.change(input, { target: { value: 'pentagon' } });
    fireEvent.submit(form as HTMLElement);
    expect(socketMock.emit).toBeCalledTimes(1);
    expect(socketMock.emit).toBeCalledWith('chatMsg', {
      type: 'chat',
      msg: 'pentagon',
    });
  });
});
