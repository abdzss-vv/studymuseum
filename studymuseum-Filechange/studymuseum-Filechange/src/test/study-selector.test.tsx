import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StudySelector } from '@/components/game/StudySelector';

describe('Study duration controls', () => {
  it('synchronizes slider and precise input and starts the exact duration', () => {
    const start = vi.fn(); render(<StudySelector onStart={start} />);
    const slider = screen.getByRole('slider', { name: 'Study duration' });
    const input = screen.getByRole('spinbutton', { name: 'Exact minutes' });
    fireEvent.change(slider, { target: { value: '73' } });
    expect((input as HTMLInputElement).value).toBe('73');
    fireEvent.change(input, { target: { value: '180' } });
    expect((slider as HTMLInputElement).value).toBe('180');
    fireEvent.click(screen.getByRole('button', { name: /Enter the reading room/ }));
    expect(start.mock.calls[0]?.[0]?.remaining).toBe(10800);
  });
  it('prevents out-of-range, blank and fractional starts while allowing one minute', () => {
    render(<StudySelector onStart={vi.fn()} />);
    const input = screen.getByRole('spinbutton', { name: 'Exact minutes' });
    const button = screen.getByRole('button', { name: /Enter the reading room/ });
    for (const value of ['0', '181', '', '1.5']) {
      fireEvent.change(input, { target: { value } });
      expect(button).toBeDisabled();
    }
    fireEvent.change(input, { target: { value: '1' } });
    expect(button).toBeEnabled();
    expect((screen.getByRole('slider') as HTMLInputElement).value).toBe('1');
  });
});