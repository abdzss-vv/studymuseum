import cardFront from '@/assets/reward-card-front.png.asset.json';
import cardBack from '@/assets/reward-card-back.png.asset.json';
import pearlFront from '@/assets/pearl-earring-card-front.png.asset.json';
import pearlBack from '@/assets/pearl-earring-card-back.png.asset.json';
import { galleryPortrait } from './sample';
import type { ArtworkId, Collectible, Rarity, SubjectId } from './types';

// Details shown on the back of each artwork card.
export const monaLisaDetails = {
  artist: 'Leonardo da Vinci',
  date: 'circa 1503–1519',
  fact: 'The portrait is believed to depict Lisa Gherardini. Leonardo’s sfumato technique blends tones to create soft shadows and her enigmatic smile.',
};
export const pearlEarringDetails = {
  artist: 'Johannes Vermeer',
  date: 'circa 1665',
  fact: 'Often called the “Mona Lisa of the North”, this tronie’s pearl is likely an illusion painted with two quick white brushstrokes, and her turban blue comes from lapis lazuli pigment once more precious than gold.',
};

export interface ArtworkCard {
  id: ArtworkId;
  name: string;
  rarity: Rarity;
  value: number;
  image: string; // image shown in the collection
  front: string; // supplied card-front design
  back: string; // supplied card-back design
  artist: string;
  date: string;
  fact: string;
}

export const artworkCards: Record<ArtworkId, ArtworkCard> = {
  'mona-lisa': {
    id: 'mona-lisa', name: 'Mona Lisa', rarity: 'Legendary', value: galleryPortrait.value,
    image: galleryPortrait.image, front: cardFront.url, back: cardBack.url, ...monaLisaDetails,
  },
  'pearl-earring': {
    id: 'pearl-earring', name: 'Girl with a Pearl Earring', rarity: 'Legendary', value: 1200,
    image: pearlFront.url, front: pearlFront.url, back: pearlBack.url, ...pearlEarringDetails,
  },
};

// Each completed study session earns one of the artwork cards, currently a 50-50 draw.
export const pickArtwork = (): ArtworkId => (Math.random() < 0.5 ? 'mona-lisa' : 'pearl-earring');

export function makeReward(artworkId: ArtworkId, sessionId: string, subjectId: SubjectId, earnedAt: string): Collectible {
  const card = artworkCards[artworkId];
  return {
    id: `${artworkId}-${sessionId}`, name: card.name, category: 'Painting', rarity: card.rarity,
    image: card.image, value: card.value, subjectId, artwork: artworkId,
    earnedSessionId: sessionId, earnedAt,
    note: `${card.artist}, ${card.date} · ${card.fact}`,
  };
}
