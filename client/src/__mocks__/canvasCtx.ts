export type CanvasContextMock = {
  canvas: HTMLCanvasElement;
  lineTo: jest.Mock;
  stroke: jest.Mock;
  beginPath: jest.Mock;
  moveTo: jest.Mock;
};
export default function (canvas: HTMLCanvasElement): CanvasContextMock {
  return {
    canvas,
    lineTo: jest.fn(),
    stroke: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
  };
}
