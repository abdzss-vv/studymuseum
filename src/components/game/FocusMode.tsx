import { useEffect, useState } from 'react';
import { ArrowLeft, Pause, Play, Check, Leaf } from 'lucide-react';
import studyRoom from '@/assets/study-room.jpg';
import { subjectName } from '@/data/sample';
import type { SubjectId } from '@/data/types';
import { pauseSession, resumeSession, tickSession, type StudySession } from '@/lib/study-session';
import { GameButton } from './ui';
import { MuseumPanel } from './MuseumPanel';
import { useRewards } from './RewardsProvider';

export function FocusMode({ initial, onExit }: { initial: StudySession; onExit: () => void }) {
  const [session, setSession] = useState(initial);
  const [confirmExit, setConfirmExit] = useState(false);
  const { complete } = useRewards();
  useEffect(() => {
    if (session.status === 'done') { complete(session); onExit(); }
  }, [session.status, complete, onExit, session]);
  useEffect(() => {
    if (session.status !== 'running') return;
    const id = window.setInterval(() => setSession((current) => tickSession(current, Date.now())), 250);
    return () => window.clearInterval(id);
  }, [session.status]);
  const time = `${String(Math.floor(session.remaining / 60)).padStart(2, '0')}:${String(session.remaining % 60).padStart(2, '0')}`;
  return <section className="focus-mode" aria-label="Study focus mode">
    <img className="focus-scenery" src={studyRoom} alt="A quiet sunlit reading room in the museum" width={1920} height={1088} />
    <div className="focus-top"><GameButton variant="outline" onClick={() => {
      if (session.status === 'done') onExit();
      else { setSession((current) => pauseSession(current, Date.now())); setConfirmExit(true); }
    }}><ArrowLeft size={16} /> Exit session</GameButton></div>
    <div className="focus-content">
      <Leaf className="mx-auto mb-5 text-primary" size={28} />
      <h1 className="text-3xl">{subjectName(session.subject as SubjectId)}</h1>
      {session.status === 'done' ? <div className="mt-8"><Check size={36} className="mx-auto text-primary" /><h2 className="mt-4 text-4xl">A moment well spent.</h2><p className="mt-3 text-muted-foreground">Your {session.total / 60}-minute session has ended.</p></div> : <>
        <p className="focus-timer" role="timer" aria-label={`${time} remaining`}>{time}</p>
        <progress className="focus-progress" value={session.total - session.remaining} max={session.total} aria-label="Session progress" />
        {session.status === 'paused' && <p className="mt-5 text-sm text-muted-foreground">Take a breath. Your session is paused.</p>}
        <GameButton variant="outline" className="mt-7 min-w-32" onClick={() => setSession((current) => current.status === 'running' ? pauseSession(current, Date.now()) : resumeSession(current, Date.now()))}>
          {session.status === 'paused' ? <><Play size={16} /> Resume</> : <><Pause size={16} /> Pause</>}
        </GameButton>
      </>}
    </div>
    <MuseumPanel open={confirmExit} onClose={() => setConfirmExit(false)} title="Leave the reading room?" description="End this session or keep studying." compact>
      <p className="text-muted-foreground">This unfinished session will not be saved. No rewards will be awarded.</p>
      <div className="mt-6 flex flex-wrap gap-3"><GameButton onClick={() => { setConfirmExit(false); setSession((current) => resumeSession(current, Date.now())); }}>Keep studying</GameButton><GameButton variant="outline" onClick={onExit}>End session</GameButton></div>
    </MuseumPanel>
  </section>;
}