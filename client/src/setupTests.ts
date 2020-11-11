// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import createCanvasCtxMock, { CanvasContextMock } from './__mocks__/canvasCtx';

(HTMLCanvasElement as any).prototype.getContext = function (): CanvasContextMock {
  if (!this.ctxMock) {
    this.ctxMock = createCanvasCtxMock(this);
  }
  return this.ctxMock;
};
