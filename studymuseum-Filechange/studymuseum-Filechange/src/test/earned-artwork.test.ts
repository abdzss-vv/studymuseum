import { describe, expect, it } from 'vitest';
import { makeReward, artworkCards } from '@/data/rewards';
import { earnedArtworkDetails } from '@/lib/earned-artwork';
import { parseRewards } from '@/lib/rewards-store';
import monaFront from '@/assets/mona-lisa-front.png';
import pearlFront from '@/assets/pearl-earring-front.png';
import waveFront from '@/assets/great-wave-front.png';

describe('Earned artwork information', () => {
  it('resolves every supplied front independently of the preview address', () => {
    for (const [id, asset] of [['mona-lisa', monaFront], ['pearl-earring', pearlFront], ['great-wave', waveFront]] as const) {
      expect(artworkCards[id].front).toBe(`https://studymuseum.lovable.app${asset.url}`);
    }
  });
  it('uses the subject selected for the earned reward, including custom subjects', () => {
    const reward = makeReward('pearl-earring', 'custom-session', 'Chemistry', '2026-11-09T12:00:00Z');
    const restored = parseRewards(JSON.stringify({ pending: [], collected: [reward] })).collected[0];
    expect(restored).toBeDefined();
    if (!restored) throw new Error('Reward was not restored');
    expect(earnedArtworkDetails(restored).subject).toBe('Chemistry');
    expect(earnedArtworkDetails({ ...restored, subjectId: 'history' }).subject).toBe('History');
  });

  it('displays the receipt day in the user’s local calendar, not today or the UTC day', () => {
    const receivedAt = new Date(2026, 10, 9, 23, 45).toISOString();
    const reward = makeReward('mona-lisa', 'dated-session', 'history', receivedAt);
    expect(earnedArtworkDetails(reward).date).toBe('09/11/2026');
  });

  it('uses the integrated front face for each artwork including the landscape Great Wave', () => {
    for (const id of ['mona-lisa', 'pearl-earring', 'great-wave'] as const) {
      expect(earnedArtworkDetails(makeReward(id, id, 'biology', '2026-11-09T12:00:00Z')).front).toBe(artworkCards[id].front);
    }
  });
});