import { artworkCards } from '@/data/rewards';
import { subjectName } from '@/data/sample';
import type { Collectible } from '@/data/types';

export function earnedArtworkDetails(item: Collectible) {
  const card = artworkCards[item.artwork ?? 'mona-lisa'];
  const received = new Date(item.earnedAt ?? '');
  const date = Number.isNaN(received.getTime()) ? '' :
    `${String(received.getDate()).padStart(2, '0')}/${String(received.getMonth() + 1).padStart(2, '0')}/${received.getFullYear()}`;
  return { front: card.front, subject: subjectName(item.subjectId), date, receivedAt: item.earnedAt };
}