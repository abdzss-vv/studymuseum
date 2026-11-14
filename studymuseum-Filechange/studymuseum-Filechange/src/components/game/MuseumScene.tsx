import museumScene from '@/assets/museum-scene-clean.png';
import { museumDisplays, sampleCollectibles } from '@/data/sample';
import type { Collectible } from '@/data/types';
import { GameButton } from './ui';

export function MuseumScene({ onInspect }: { onInspect: (item: Collectible) => void }) {
  return <div className="miniature-museum" aria-label="Museum gallery">
    <img className="miniature-museum-image" src={museumScene} alt="Isometric miniature museum with sunlit marble floors, ornate cream walls, arched windows and plants" width={588} height={602} />
    <div className="miniature-exhibits">
      {museumDisplays.map(({ item, position }) => item && <GameButton key={item.id} variant="ghost" className={`miniature-exhibit miniature-exhibit-${position}`} aria-label={`Inspect ${item.name}`} title={item.name} onClick={() => onInspect(item)} />)}
      {sampleCollectibles[2] && <GameButton variant="ghost" className="miniature-exhibit miniature-exhibit-amphora" aria-label="Inspect Black-Figure Amphora" title="Black-Figure Amphora" onClick={() => { const item = sampleCollectibles[2]; if (item) onInspect(item); }} />}
    </div>
  </div>;
}