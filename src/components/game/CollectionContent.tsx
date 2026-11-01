import { useState } from "react";
import { sampleCollectibles } from "@/data/sample";
import { useSubjects } from '@/lib/subjects-store';
import type { Category, Rarity } from "@/data/types";
import { CollectibleCard } from "@/components/game/CollectibleCard";
import { GameButton, SampleBadge, Select, SectionTitle } from "@/components/game/ui";
import { useRewards } from './RewardsProvider';

const categories: Category[] = ["Painting", "Sculpture", "Artifact", "Animal", "Vehicle"];
const rarities: Rarity[] = ["Common", "Uncommon", "Rare", "Legendary"];
const all = { value: "all", label: "All" };

export function CollectionContent() {
  const [category, setCategory] = useState("all");
  const [rarity, setRarity] = useState("all");
  const [subject, setSubject] = useState("all");
  const { state } = useRewards();
  const { subjects } = useSubjects();
  const matches = (c: (typeof sampleCollectibles)[number]) => (category === 'all' || c.category === category) && (rarity === 'all' || c.rarity === rarity) && (subject === 'all' || c.subjectId === subject);
  const earned = state.collected.filter(matches);

  const items = sampleCollectibles.filter(
    (c) =>
      (category === "all" || c.category === category) &&
      (rarity === "all" || c.rarity === rarity) &&
      (subject === "all" || c.subjectId === subject),
  );

  return (
    <>


      <p className="mb-6 text-sm text-muted-foreground">{state.collected.length} earned collectibles</p>
      <section className="">
        <div className="mb-6 grid gap-3 sm:grid-cols-4 sm:items-end">
          <Select label="Category" value={category} onChange={setCategory} options={[all, ...categories.map((c) => ({ value: c, label: c }))]} />
          <Select label="Rarity" value={rarity} onChange={setRarity} options={[all, ...rarities.map((r) => ({ value: r, label: r }))]} />
          <Select label="Subject" value={subject} onChange={setSubject} options={[all, ...subjects.map((s) => ({ value: s.id, label: s.name }))]} />
          <GameButton variant="outline" onClick={() => { setCategory("all"); setRarity("all"); setSubject("all"); }}>
            Clear filters
          </GameButton>
        </div>
        <SectionTitle>Earned through study</SectionTitle>
        {earned.length ? <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{earned.map((c) => <CollectibleCard key={c.id} item={c} />)}</div> : <p className="mb-8 text-sm text-muted-foreground">{state.collected.length ? 'No earned items match these filters.' : 'Your collection awaits its first artwork.'}</p>}
        <SectionTitle action={<SampleBadge>Demonstration items</SampleBadge>}>Catalogue preview</SectionTitle>
        {items.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => <CollectibleCard key={c.id} item={c} />)}
          </div>
        ) : (
          <p className="panel p-6 text-center text-muted-foreground">No items match these filters.</p>
        )}
      </section>
    </>
  );
}
