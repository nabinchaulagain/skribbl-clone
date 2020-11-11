import React from 'react';
import { screen, render, cleanup, fireEvent } from '@testing-library/react';
import DrawingBoard from './DrawingBoard';
import DrawingBoardProvider from '../providers/DrawingBoardProvider';
import { CanvasContextMock } from '../__mocks__/canvasCtx';
import StylePicker from './StylePicker';

describe('style picker', () => {
  beforeEach(() => {
    render(
      <DrawingBoardProvider drawingPermission={true} isGameStarted={true}>
        <DrawingBoard
          width={window.outerWidth}
          height={window.outerHeight}
        ></DrawingBoard>
        <StylePicker></StylePicker>
      </DrawingBoardProvider>
    );
  });
  it('changes brush color', () => {
    const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;
    const ctxMock = (canvas.getContext('2d') as unknown) as CanvasContextMock;
    const colorInput = screen.getByLabelText(/color/i);
    const testColor = '#0000ff';
    fireEvent.change(colorInput, { target: { value: testColor } });
    fireEvent.mouseDown(canvas, { clientX: 99, clientY: 99 });
    fireEvent.mouseUp(canvas, { clientX: 99, clientY: 99 });
    expect(ctxMock.strokeStyle).toBe(testColor);
  });
  it('changes brush size', () => {
    const canvas = screen.getByTestId('canvas') as HTMLCanvasElement;
    const ctxMock = (canvas.getContext('2d') as unknown) as CanvasContextMock;
    const slider = screen.getByLabelText(/brush size/i);
    const brushSize = 23;
    fireEvent.change(slider, { target: { value: brushSize } });
    fireEvent.mouseDown(canvas, { clientX: 99, clientY: 99 });
    fireEvent.mouseUp(canvas, { clientX: 99, clientY: 99 });
    expect(ctxMock.lineWidth).toBe(brushSize);
  });
});
afterEach(cleanup);
