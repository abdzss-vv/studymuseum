import { describe, expect, it } from 'vitest';
import { startSession, tickSession, pauseSession, resumeSession, validDuration } from '@/lib/study-session';

describe('Study session', () => {
  it('supports every whole-minute duration from 1 through 180', () => {
    for (let minutes = 1; minutes <= 180; minutes++) {
      expect(validDuration(minutes)).toBe(true);
      expect(startSession('history', minutes, 1000).remaining).toBe(minutes * 60);
    }
  });
  it.each([0, 181, -1, 1.5, NaN, Infinity])('rejects invalid duration %s', (minutes) => {
    expect(validDuration(minutes)).toBe(false);
    expect(() => startSession('history', minutes, 1000)).toThrow();
  });
  it('keeps the target duration fixed during pause and resume', () => {
    const session = startSession('history', 180, 1000);
    expect(resumeSession(pauseSession(session, 61000), 90000).total).toBe(10800);
  });
  it('starts with the selected subject and duration', () => {
    const session = startSession('biology', 15, 1000);
    expect(session.subject).toBe('biology');
    expect(session.remaining).toBe(900);
    expect(session.endsAt).toBe(901000);
  });
  it('uses elapsed time even when timer callbacks are delayed', () => {
    expect(tickSession(startSession('history', 25, 1000), 121000).remaining).toBe(1380);
  });
  it('holds remaining time while paused and resumes from that time', () => {
    const paused = pauseSession(startSession('history', 15, 1000), 61000);
    expect(paused.remaining).toBe(840);
    expect(tickSession(paused, 400000).remaining).toBe(840);
    const resumed = resumeSession(paused, 500000);
    expect(tickSession(resumed, 560000).remaining).toBe(780);
  });
  it('only completes when the full countdown has elapsed', () => {
    const session = startSession('physics', 15, 1000);
    expect(tickSession(session, 900999).status).toBe('running');
    expect(tickSession(session, 901000).status).toBe('done');
    expect(tickSession(session, 902000).remaining).toBe(0);
  });
});