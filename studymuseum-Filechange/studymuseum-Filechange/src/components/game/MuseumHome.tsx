import { useState } from 'react';
import { Sprout, VolumeX } from 'lucide-react';
import museumLogo from '@/assets/museum-logo.png';
import collectionButton from '@/assets/museum-collection.png';
import testsButton from '@/assets/museum-tests.png';
import progressButton from '@/assets/museum-progress.png';
import settingsButton from '@/assets/museum-settings.png';
import beginButton from '@/assets/museum-begin-session.png';
import { subjectName } from '@/data/sample';
import type { Collectible } from '@/data/types';
import type { StudySession } from '@/lib/study-session';
import { CollectionContent } from './CollectionContent';
import { TestsContent } from './TestsContent';
import { MuseumPanel } from './MuseumPanel';
import { FocusMode } from './FocusMode';
import { StudySelector } from './StudySelector';
import { GameButton, SampleBadge } from './ui';
import { useRewards } from './RewardsProvider';
import { MuseumScene } from './MuseumScene';

type Panel = 'collection' | 'tests' | 'progress' | 'settings' | 'study' | null;
export function MuseumHome() {
  const { state: rewards } = useRewards();
  const [panel, setPanel] = useState<Panel>(null);
  const [selected, setSelected] = useState<Collectible | null>(null);
  const [session, setSession] = useState<StudySession | null>(null);
  const [motion, setMotion] = useState(true);
  return <div className={`museum-home ${motion ? '' : 'museum-still'}`}>
    <header className="museum-top">
      <h1><img className="museum-logo" src={museumLogo} alt="Study Museum" width={401} height={105} /></h1>
    </header>
    <div className="museum-composition">
    <MuseumScene onInspect={setSelected} />
    <nav className="museum-tools" aria-label="Museum controls">
      <GameButton variant="ghost" className="museum-art-button" aria-label="Collection" title="Collection" onClick={() => setPanel('collection')}><img src={collectionButton} alt="" width={87} height={86} /></GameButton>
      <GameButton variant="ghost" className="museum-art-button" aria-label="Tests" title="Tests" onClick={() => setPanel('tests')}><img src={testsButton} alt="" width={87} height={86} /></GameButton>
      <GameButton variant="ghost" className="museum-art-button" aria-label="Museum progress" title="Museum progress" onClick={() => setPanel('progress')}><img src={progressButton} alt="" width={87} height={87} /></GameButton>
      <GameButton variant="ghost" className="museum-art-button" aria-label="Settings" title="Settings" onClick={() => setPanel('settings')}><img src={settingsButton} alt="" width={87} height={84} /></GameButton>
    </nav>
    </div>
    <div className="museum-bottom"><GameButton variant="ghost" className="museum-art-button begin-study" aria-label="Begin Session" onClick={() => setPanel('study')}><img src={beginButton} alt="" width={330} height={83} /></GameButton></div>
    <MuseumPanel open={panel !== null} onClose={() => setPanel(null)} title={panel === 'collection' ? 'Your collection' : panel === 'tests' ? 'Upcoming tests' : panel === 'progress' ? 'Museum journal' : panel === 'settings' ? 'Settings' : 'Settle in to study'} description="Museum panel. Close to return to the gallery." compact={panel === 'study' || panel === 'settings' || panel === 'progress'}>
      {panel === 'collection' && <CollectionContent />}
      {panel === 'tests' && <TestsContent />}
      {panel === 'study' && <StudySelector onStart={(value) => { setPanel(null); setSession(value); }} />}
      {panel === 'progress' && <><Sprout className="text-primary" size={30} /><h2 className="mt-4 text-2xl">Every museum starts small.</h2><dl className="journal-stats"><div><dt>Earned collectibles</dt><dd>{rewards.collected.length}</dd></div><div><dt>Gallery</dt><dd>Main hall</dd></div></dl><SampleBadge>Prototype</SampleBadge><p className="mt-4 text-sm text-muted-foreground">Session history, visitors and expansions are not active yet.</p></>}
      {panel === 'settings' && <><label className="flex items-center justify-between gap-4 border-b border-border py-4"><span>Ambient movement</span><input type="checkbox" checked={motion} onChange={(e) => setMotion(e.target.checked)} className="h-5 w-5 accent-primary" /></label><p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><VolumeX size={17} /> Sound is not included in this prototype.</p><p className="mt-4 text-xs text-muted-foreground">Preferences apply until this page is refreshed.</p></>}
    </MuseumPanel>
    <MuseumPanel open={selected !== null} onClose={() => setSelected(null)} title={selected?.name ?? 'Display detail'} description="Details of this demonstration collectible." compact>
      {selected && <><div className="gilded-frame overflow-hidden"><img src={selected.image} alt={selected.name} className="max-h-64 w-full object-contain" /></div><div className="mt-5 flex flex-wrap gap-2"><SampleBadge>Demonstration · Not earned</SampleBadge><span className="text-sm text-muted-foreground">{selected.rarity} · {selected.category}</span></div><p className="mt-4">Associated subject: <strong>{subjectName(selected.subjectId)}</strong></p><p className="mt-2 text-sm text-muted-foreground">{selected.note}</p><p className="mt-2 text-sm text-muted-foreground">Catalogue value: {selected.value} coins (placeholder)</p></>}
    </MuseumPanel>
    {session && <FocusMode initial={session} onExit={() => setSession(null)} />}
  </div>;
}