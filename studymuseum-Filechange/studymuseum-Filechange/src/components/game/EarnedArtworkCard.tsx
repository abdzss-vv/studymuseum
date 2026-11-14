import type { Collectible } from '@/data/types';
import { earnedArtworkDetails } from '@/lib/earned-artwork';

export function EarnedArtworkCard({ item }: { item: Collectible }) {
  const details = earnedArtworkDetails(item);
  return (
    <article className="earned-artwork">
      <div className="earned-artwork-face">
        <img src={details.front} alt={item.name} loading="lazy" />
      </div>
      <div className="earned-artwork-caption">
        <time className="earned-artwork-date" dateTime={details.receivedAt}>{details.date}</time>
        <p className="earned-artwork-subject">Studied: <strong>{details.subject}</strong></p>
      </div>
    </article>
  );
}