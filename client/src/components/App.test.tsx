import React from 'react';
import socketMock from '../utils/socket';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import DrawingBoardProvider, { Line } from '../providers/DrawingBoardProvider';
import DrawingBoard from './DrawingBoard';
import createCanvasCtxMock, { CanvasContextMock } from '../__mocks__/canvasCtx';
import mockServerSocket from '../__mocks__/serverSocket';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(HTMLCanvasElement as any).prototype.getContext = function (): CanvasContextMock {
  if (!this.ctxMock) {
    this.ctxMock = createCanvasCtxMock(this);
  }
  return this.ctxMock;
};

jest.mock('../utils/socket');
describe('drawing board', (): void => {
  describe('user', () => {
    beforeEach(() => {
      render(
        <DrawingBoardProvider>
          <DrawingBoard
            width={window.outerWidth}
            height={window.outerHeight}
          ></DrawingBoard>
        </DrawingBoardProvider>
      );
    });
    it('can draw dot', (): void => {
      const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;
      const ctxMock = (canvas.getContext('2d') as unknown) as CanvasContextMock;
      fireEvent.mouseDown(canvas, { clientX: 50, clientY: 50 });
      fireEvent.mouseUp(canvas, { clientX: 50, clientY: 50 });
      expect(ctxMock.stroke).toBeCalledTimes(1);
      expect(ctxMock.lineTo).toBeCalledTimes(1);
    });
    it('can draw patterns', (): void => {
      const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;
      const ctxMock = (canvas.getContext('2d') as unknown) as CanvasContextMock;
      fireEvent.mouseDown(canvas, { clientX: 70, clientY: 70 });
      fireEvent.mouseMove(canvas, { clientX: 50, clientY: 100 });
      fireEvent.mouseUp(canvas, { clientX: 50, clientY: 50 });
      expect(ctxMock.stroke).toBeCalledTimes(2);
      expect(ctxMock.lineTo).toBeCalledTimes(2);
    });
    it('can finish pattern when stop holding mouse', (): void => {
      const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;
      const ctxMock = (canvas.getContext('2d') as unknown) as CanvasContextMock;
      fireEvent.mouseDown(canvas, { clientX: 50, clientY: 50 });
      fireEvent.mouseUp(canvas, { clientX: 50, clientY: 50 });
      expect(ctxMock.beginPath).toBeCalledTimes(1);
    });
  });
  describe('socket', (): void => {
    it('draws when socket recieves a message', (): void => {
      //@ts-expect-error
      socketMock.on = jest.fn((msg: string, cb: () => void) => {
        //@ts-expect-error
        socketMock.listeners = { [msg]: [cb] };
      });
      render(
        <DrawingBoardProvider>
          <DrawingBoard
            width={window.outerWidth}
            height={window.outerHeight}
          ></DrawingBoard>
        </DrawingBoardProvider>
      );
      const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;
      const ctxMock = (canvas.getContext('2d') as unknown) as CanvasContextMock;
      const serverSocket = mockServerSocket(socketMock);

      const line: Line = {
        brushSize: 10,
        color: '#000000',
        x: 10,
        y: 10,
        isEnding: true,
      };
      serverSocket.emit('lineDraw', line);
      serverSocket.emit('lineDraw', line);
      serverSocket.emit('lineDraw', line);
      expect(ctxMock.stroke).toBeCalledTimes(3);
    });
  });
});
afterEach(cleanup);
