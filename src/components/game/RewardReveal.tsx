import { useEffect, useRef, useState } from 'react';
import { Check, Gift, SkipForward } from 'lucide-react';
import rewardBox from '@/assets/reward-box.png';
import studyRoom from '@/assets/study-room.jpg';
import { subjectName } from '@/data/sample';
import { artworkCards } from '@/data/rewards';
import { GameButton } from './ui';
import { useRewards } from './RewardsProvider';

export function RewardReveal() {
  const { state, confirm, error } = useRewards();
  const reward = state.pending[0];
  const card = reward ? artworkCards[reward.artwork ?? 'mona-lisa'] : undefined;
  const [stage, setStage] = useState<'box' | 'card'>('box');
  const [flipped, setFlipped] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [saveError, setSaveError] = useState('');
  useEffect(() => { setStage('box'); setFlipped(false); setSpinning(false); setRotation(0); setSaveError(''); }, [reward?.id]);
  useEffect(() => {
    if (stage !== 'card' || !spinning) return;
    let cancelled = false;
    let frame = 0;
    const images = Array.from(cardRef.current?.querySelectorAll('img') ?? []);
    // Decode both faces before turning so the reverse never appears blank.
    Promise.all(images.map((image) => image.decode().catch(() => undefined))).then(() => {
      if (cancelled) return;
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => { if (!cancelled) setRotation(360); });
      });
    });
    return () => { cancelled = true; window.cancelAnimationFrame(frame); };
  }, [stage, spinning]);
  const openBox = () => {
    setSpinning(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setStage('card');
  };
  if (!reward) return null;
  return <section className="reward-screen" role="dialog" aria-modal="true" aria-label="Study collectible reward">
    <img src={studyRoom} className="focus-scenery" alt="" width={1920} height={1088} />
    <div className="reward-content">
      <p className="text-sm font-semibold text-primary">Study complete · {subjectName(reward.subjectId)}</p>
      <h1 className="mt-2 text-4xl">A new piece of history.</h1>
      {stage !== 'card' ? <>
        <GameButton autoFocus variant="ghost" className="reward-box" aria-label="Open collectible box" onClick={openBox}><img src={rewardBox} alt="Illustrated oak collectible box with brass fittings and a green ribbon" width={1024} height={1024} /></GameButton>
        <div className="flex flex-wrap justify-center gap-3"><GameButton onClick={openBox}><Gift size={17} /> Open box</GameButton><GameButton variant="outline" onClick={() => setStage('card')}><SkipForward size={17} /> Skip animation</GameButton></div>
      </> : <>
        <GameButton variant="ghost" aria-label={spinning ? 'Revealing collectible card' : flipped ? 'Show painting' : 'Flip card'} aria-pressed={spinning ? undefined : flipped} disabled={spinning} className={`artwork-card ${spinning ? 'artwork-card-spin' : ''}`} onClick={() => { setFlipped((v) => !v); setRotation((v) => v + 180); }}>
          <div ref={cardRef} className="artwork-card-inner" style={{ transform: `rotateY(${rotation}deg)` }} onTransitionEnd={(event) => { if (event.target === event.currentTarget && event.propertyName === 'transform') setSpinning(false); }}>
            <div className="artwork-card-face" aria-hidden={flipped}><img src={card.front} alt={`${card.name} artwork card, supplied high-resolution design`} width={723} height={1023} /></div>
            <div className="artwork-card-face artwork-card-back" aria-hidden={!flipped}><img src={card.back} alt={`${card.name}. Painted by ${card.artist}, ${card.date}. ${card.fact}`} width={723} height={1023} /></div>
          </div>
        </GameButton>
        <p className="mb-4 text-sm font-semibold text-primary">{reward.rarity} · Studied: {subjectName(reward.subjectId)}</p>
        <div className="flex justify-center"><GameButton autoFocus onClick={() => { try { confirm(reward.earnedSessionId ?? ''); } catch { setSaveError('Could not save to this browser. Your reward is still here; please try again.'); } }}><Check size={17} /> Add to collection</GameButton></div>
      </>}
      {(saveError || error) && <p role="alert" className="mt-4 text-sm text-destructive">{saveError || error}</p>}
    </div>
  </section>;
}
