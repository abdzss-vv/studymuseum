import type { Collectible, Rarity } from "@/data/types";
import { subjectName } from "@/data/sample";

const rarityClass: Record<Rarity, string> = {
  Common: "text-rarity-common border-rarity-common",
  Uncommon: "text-rarity-uncommon border-rarity-uncommon",
  Rare: "text-rarity-rare border-rarity-rare",
  Legendary: "text-rarity-legendary border-rarity-legendary",
};

export function CollectibleCard({ item, compact }: { item: Collectible; compact?: boolean }) {
  return (
    <article className="panel flex flex-col overflow-hidden">
      <div className="gilded-frame m-3 aspect-square overflow-hidden">
        <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 pb-4">
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${rarityClass[item.rarity]}`}>
            {item.rarity}
          </span>
          <span className="text-xs text-muted-foreground">{item.category}</span>
        </div>
        <h3 className="text-xl leading-tight text-foreground">{item.name}</h3>
        {!compact && (
          <>
            <p className="text-xs text-muted-foreground">{item.note}</p>
            <div className="mt-auto flex items-center justify-between pt-2 text-sm">
              <span className="text-muted-foreground">Studied: {subjectName(item.subjectId)}</span>
              {!item.earnedSessionId && <span className="font-semibold text-wood">{item.value} ✦</span>}
            </div>
          </>
        )}
      </div>
    </article>
  );
}
