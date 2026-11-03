import { describe, expect, it } from 'vitest';
import { completeReward, confirmReward, emptyRewards, parseRewards } from '@/lib/rewards-store';
import { pauseSession, startSession, tickSession } from '@/lib/study-session';

describe('Study rewards', () => {
  const now = '2026-10-28T04:00:00.000Z';
  it('grants one of the two artwork cards for natural completion with the studied subject', () => {
    const state = completeReward(emptyRewards, tickSession(startSession('biology', 1, 1000), 61000), now);
    expect(state.pending).toHaveLength(1);
    expect(['Mona Lisa', 'Girl with a Pearl Earring']).toContain(state.pending[0]?.name);
    expect(state.pending[0]?.subjectId).toBe('biology');
    expect(state.collected).toHaveLength(0);
  });
  it('draws both artwork cards across many completed sessions', () => {
    const names = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const pending = completeReward(emptyRewards, tickSession(startSession('history', 1, 1000), 61000), now).pending[0];
      if (pending) names.add(pending.name);
    }
    expect(names).toEqual(new Set(['Mona Lisa', 'Girl with a Pearl Earring']));
  });
  it('keeps the earned artwork card across refresh and falls back to Mona Lisa for older saves', () => {
    const session = tickSession(startSession('literature', 1, 1000), 61000);
    const pending = completeReward(emptyRewards, session, now);
    expect(pending.pending[0]?.artwork).toBe(pending.pending[0]?.name === 'Girl with a Pearl Earring' ? 'pearl-earring' : 'mona-lisa');
    expect(parseRewards(JSON.stringify(pending)).pending[0]?.name).toBe(pending.pending[0]?.name);
    const legacy = JSON.stringify({ pending: [{ name: 'Mona Lisa', subjectId: 'history', earnedSessionId: 'old-1', earnedAt: now }], collected: [] });
    expect(parseRewards(legacy).pending[0]?.name).toBe('Mona Lisa');
    expect(parseRewards(legacy).pending[0]?.subjectId).toBe('history');
  });
  it('does not grant unfinished or paused sessions', () => {
    const session = startSession('history', 1, 1000);
    expect(completeReward(emptyRewards, tickSession(session, 60999), now)).toBe(emptyRewards);
    expect(completeReward(emptyRewards, pauseSession(session, 2000), now)).toBe(emptyRewards);
  });
  it('requires confirmation and prevents repeated completions and confirmations', () => {
    const session = tickSession(startSession('physics', 1, 1000), 61000);
    const pending = completeReward(emptyRewards, session, now);
    expect(completeReward(pending, session, now)).toBe(pending);
    const confirmed = confirmReward(pending, session.id);
    expect(confirmed.pending).toHaveLength(0);
    expect(confirmed.collected).toHaveLength(1);
    expect(confirmReward(confirmed, session.id)).toBe(confirmed);
    expect(completeReward(confirmed, session, now)).toBe(confirmed);
  });
  it('restores pending and confirmed rewards on refresh without duplicate claims', () => {
    const session = tickSession(startSession('literature', 1, 1000), 61000);
    const pending = completeReward(emptyRewards, session, now);
    const restored = parseRewards(JSON.stringify(pending));
    expect(restored.pending[0]?.subjectId).toBe('literature');
    const confirmed = confirmReward(restored, session.id);
    expect(parseRewards(JSON.stringify(confirmed)).collected).toEqual(confirmed.collected);
    expect(parseRewards(JSON.stringify({ pending: pending.pending, collected: confirmed.collected })).pending).toHaveLength(0);
  });
  it('retains a separate reward for each genuinely completed session', () => {
    const first = tickSession(startSession('math', 1, 1000), 61000);
    const second = tickSession(startSession('history', 1, 1000), 61000);
    const state = completeReward(completeReward(emptyRewards, first, now), second, now);
    expect(state.pending).toHaveLength(2);
    expect(state.pending.map((r) => r.subjectId)).toEqual(['math', 'history']);
  });
  it('recovers safely from malformed local data', () => {
    expect(parseRewards('bad json')).toEqual(emptyRewards);
    expect(parseRewards('{"pending":[{}],"collected":[]}')).toEqual(emptyRewards);
  });
  it('retains custom studied subjects on artwork across confirmation and refresh without duplicates', () => {
    const session = tickSession(startSession('Chemistry', 1, 1000), 61000);
    const pending = completeReward(emptyRewards, session, now);
    expect(pending.pending[0]?.subjectId).toBe('Chemistry');
    const confirmed = confirmReward(parseRewards(JSON.stringify(pending)), session.id);
    const restored = parseRewards(JSON.stringify(confirmed));
    expect(restored.collected[0]?.subjectId).toBe('Chemistry');
    expect(completeReward(restored, session, now).collected).toHaveLength(1);
    expect(completeReward(emptyRewards, startSession('Chemistry', 1, 1000), now)).toBe(emptyRewards);
  });
});