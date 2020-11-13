import React from 'react';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import Socket from '../utils/Socket';
import Chatbox from './Chatbox';
import mockServerSocket from '../mocks/serverSocket';
import { act } from 'react-dom/test-utils';
import mockSocket from '../mocks/Socket';

describe('chatbox', (): void => {
  beforeEach(() => {
    const socketMock = mockSocket();
    //@ts-expect-error
    Socket.getSocket = () => {
      return socketMock;
    };
  });
  it('shows chat message', (): void => {
    const socketMock = Socket.getSocket();
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
    render(<Chatbox></Chatbox>);
    const input = screen.getByTestId('chat-input');
    const form = input.parentNode;
    fireEvent.change(input, { target: { value: 'pentagon' } });
    fireEvent.submit(form as HTMLElement);
    const socketMock = Socket.getSocket();
    expect(socketMock.emit).toBeCalledTimes(1);
    expect(socketMock.emit).toBeCalledWith('chatMsg', {
      type: 'chat',
      msg: 'pentagon',
    });
  });
});
afterEach(cleanup);
