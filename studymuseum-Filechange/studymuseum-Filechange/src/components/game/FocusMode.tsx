import { useEffect, useState } from 'react';
import { ArrowLeft, Pause, Play, Check, Leaf } from 'lucide-react';
import studyRoom from '@/assets/study-room.jpg';
import { subjectName } from '@/data/sample';
import type { SubjectId } from '@/data/types';
import { pauseSession, resumeSession, tickSession, type StudySession } from '@/lib/study-session';
import chime from '@/assets/timer-done-chime.wav';
import { GameButton } from './ui';
import { MuseumPanel } from './MuseumPanel';
import { useRewards } from './RewardsProvider';

export function FocusMode({ initial, onExit }: { initial: StudySession; onExit: () => void }) {
  const [session, setSession] = useState(initial);
  const [confirmExit, setConfirmExit] = useState(false);
  const { complete } = useRewards();
  const finish = () => { complete(session); onExit(); };
  useEffect(() => {
    if (session.status !== 'done') return;
    const audio = new Audio(chime);
    let timer: number | undefined;
    let stopped = false;
    const play = () => { if (!stopped) audio.play().catch(() => {}); };
    audio.onended = () => { timer = window.setTimeout(play, 2000); };
    play();
    return () => { stopped = true; window.clearTimeout(timer); audio.onended = null; audio.pause(); };
  }, [session.status]);
  useEffect(() => {
    if (session.status !== 'running') return;
    const id = window.setInterval(() => setSession((current) => tickSession(current, Date.now())), 250);
    return () => window.clearInterval(id);
  }, [session.status]);
  const time = `${String(Math.floor(session.remaining / 60)).padStart(2, '0')}:${String(session.remaining % 60).padStart(2, '0')}`;
  return <section className="focus-mode" aria-label="Study focus mode">
    <img className="focus-scenery" src={studyRoom} alt="A quiet sunlit reading room in the museum" width={1920} height={1088} />
    <div className="focus-top"><GameButton variant="outline" onClick={() => {
      if (session.status === 'done') finish();
      else { setSession((current) => pauseSession(current, Date.now())); setConfirmExit(true); }
    }}><ArrowLeft size={16} /> Exit session</GameButton></div>
    <div className="focus-content">
      <Leaf className="mx-auto mb-5 text-primary" size={28} />
      <h1 className="text-3xl">{subjectName(session.subject as SubjectId)}</h1>
      {session.status === 'done' ? <>
        <p className="focus-timer focus-timer-done" role="timer" aria-label="Time is up">00:00</p>
        <GameButton className="mt-2 min-w-32" onClick={finish}><Check size={16} /> End Session</GameButton>
      </> : <>
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