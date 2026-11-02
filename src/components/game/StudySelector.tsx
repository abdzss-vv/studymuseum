import { useState } from 'react';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { GameButton } from './ui';
import { SubjectSelect } from './SubjectSelect';
import { startSession, validDuration, type StudySession } from '@/lib/study-session';

export function StudySelector({ onStart }: { onStart: (session: StudySession) => void }) {
  const [subject, setSubject] = useState('history');
  const [minutes, setMinutes] = useState(25);
  const [input, setInput] = useState('25');
  const valid = validDuration(Number(input)) && input.trim() !== '';
  const update = (value: string) => {
    setInput(value);
    if (validDuration(Number(value))) setMinutes(Number(value));
  };
  return <div className="space-y-6">
    <BookOpen className="text-primary" size={28} />
    <SubjectSelect value={subject} onChange={setSubject} />
    <fieldset><legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Clock size={15} /> Session duration</legend>
      <div className="mb-4 flex items-center justify-between gap-4"><output className="font-serif text-4xl text-primary" aria-live="polite">{minutes} <span className="text-xl">minutes</span></output><label className="text-sm text-muted-foreground">Exact minutes<input aria-label="Exact minutes" type="number" min={1} max={180} step={1} value={input} onChange={(e) => update(e.target.value)} aria-invalid={!valid} className="mt-1 block w-24 rounded-md border border-input bg-card p-2 text-foreground" /></label></div>
      <input className="duration-slider" aria-label="Study duration" type="range" min={1} max={180} step={1} value={minutes} onChange={(e) => update(e.target.value)} />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>1 minute</span><span>180 minutes</span></div>
      {!valid && <p role="alert" className="mt-2 text-sm text-destructive">Choose a whole number from 1 to 180 minutes.</p>}
    </fieldset>
    <GameButton disabled={!valid || !subject} className="w-full py-3" onClick={() => onStart(startSession(subject, minutes, Date.now()))}>Enter the reading room <ArrowRight size={17} /></GameButton>
  </div>;
}