import cardFront from '@/assets/mona-lisa-front.png.asset.json';
import cardBack from '@/assets/reward-card-back.png.asset.json';
import pearlFront from '@/assets/pearl-earring-front.png.asset.json';
import pearlBack from '@/assets/pearl-earring-card-back.png.asset.json';
import waveFront from '@/assets/great-wave-front.png.asset.json';
import waveBack from '@/assets/great-wave-card-back.png.asset.json';
import waveImage from '@/assets/great-wave.jpg.asset.json';
import { galleryPortrait } from './sample';
import type { ArtworkId, Collectible, Rarity, SubjectId } from './types';

// Serve card fronts from the canonical asset host, independent of the editor iframe origin.
const frontUrl = (asset: { url: string }) => new URL(asset.url, 'https://studymuseum.lovable.app').href;

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

export const greatWaveDetails = {
  artist: 'Katsushika Hokusai',
  date: 'circa 1831',
  fact: 'A woodblock print from the series Thirty-six Views of Mount Fuji. The towering wave frames a tiny Mount Fuji, and its deep blue comes from imported Prussian blue pigment.',
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
  orientation?: 'portrait' | 'landscape'; // card face shape, portrait when omitted
}

export const artworkCards: Record<ArtworkId, ArtworkCard> = {
  'mona-lisa': {
    id: 'mona-lisa', name: 'Mona Lisa', rarity: 'Legendary', value: galleryPortrait.value,
    image: galleryPortrait.image, front: frontUrl(cardFront), back: cardBack.url, ...monaLisaDetails,
  },
  'pearl-earring': {
    id: 'pearl-earring', name: 'Girl with a Pearl Earring', rarity: 'Legendary', value: 1200,
    image: frontUrl(pearlFront), front: frontUrl(pearlFront), back: pearlBack.url, ...pearlEarringDetails,
  },
  'great-wave': {
    id: 'great-wave', name: 'The Great Wave off Kanagawa', rarity: 'Legendary', value: 1400,
    image: waveImage.url, front: frontUrl(waveFront), back: waveBack.url, orientation: 'landscape', ...greatWaveDetails,
  },
};

// Each completed study session earns one of the artwork cards, an equal 1-in-3 draw.
const artworkIds: ArtworkId[] = ['mona-lisa', 'pearl-earring', 'great-wave'];
export const pickArtwork = (): ArtworkId => artworkIds[Math.floor(Math.random() * artworkIds.length)] ?? 'mona-lisa';

export function makeReward(artworkId: ArtworkId, sessionId: string, subjectId: SubjectId, earnedAt: string): Collectible {
  const card = artworkCards[artworkId];
  return {
    id: `${artworkId}-${sessionId}`, name: card.name, category: 'Painting', rarity: card.rarity,
    image: card.image, value: card.value, subjectId, artwork: artworkId,
    earnedSessionId: sessionId, earnedAt,
    note: `${card.artist}, ${card.date} · ${card.fact}`,
  };
}
