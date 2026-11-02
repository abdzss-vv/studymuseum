import type { StudySession } from './study-session';
import type { ArtworkId, Collectible } from '@/data/types';
import { makeReward, pickArtwork } from '@/data/rewards';

export const REWARDS_KEY = 'collectnstudy-rewards-v1';
export interface RewardsState { pending: Collectible[]; collected: Collectible[] }
export const emptyRewards: RewardsState = { pending: [], collected: [] };
export function completeReward(state: RewardsState, session: StudySession, now: string): RewardsState {
  if (session.status !== 'done' || session.remaining !== 0 || !session.subject.trim()) return state;
  if ([...state.pending, ...state.collected].some((r) => r.earnedSessionId === session.id)) return state;
  return { ...state, pending: [...state.pending, makeReward(pickArtwork(), session.id, session.subject, now)] };
}
export function confirmReward(state: RewardsState, sessionId: string): RewardsState {
  const reward = state.pending.find((r) => r.earnedSessionId === sessionId);
  if (!reward) return state;
  return { pending: state.pending.filter((r) => r.earnedSessionId !== sessionId),
    collected: state.collected.some((r) => r.earnedSessionId === sessionId) ? state.collected : [...state.collected, reward] };
}
export function parseRewards(raw: string | null): RewardsState {
  if (!raw) return emptyRewards;
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data.pending) || !Array.isArray(data.collected)) return emptyRewards;
    const seen = new Set<string>();
    const normalize = (rows: unknown[]): Collectible[] => rows.flatMap((row) => {
      if (!row || typeof row !== 'object') return [];
      const r = row as Partial<Collectible>;
      if (typeof r.earnedSessionId !== 'string' || typeof r.earnedAt !== 'string' || typeof r.subjectId !== 'string' || !r.subjectId.trim() || seen.has(r.earnedSessionId)) return [];
      // Older saves predate the artwork field and fall back to the Mona Lisa card.
      const artwork: ArtworkId = r.artwork === 'pearl-earring' ? 'pearl-earring' : 'mona-lisa';
      seen.add(r.earnedSessionId);
      return [makeReward(artwork, r.earnedSessionId, r.subjectId, r.earnedAt)];
    });
    const collected = normalize(data.collected);
    return { collected, pending: normalize(data.pending) };
  } catch { return emptyRewards; }
}