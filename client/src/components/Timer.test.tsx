import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import Timer from './Timer';
describe('timer', () => {
  it('renders', () => {
    render(<Timer roundTime={{ timeToComplete: 10, startTime: 15 }} />);
  });
  it('shows time correctly', () => {
    const roundTime = { timeToComplete: 20 * 1000, startTime: Date.now() };
    render(<Timer roundTime={roundTime}></Timer>);
    expect(screen.getByText(/20/i)).toBeTruthy();
  });
});
afterEach(cleanup);
