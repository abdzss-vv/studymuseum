import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { completeReward, confirmReward, emptyRewards, parseRewards, REWARDS_KEY, type RewardsState } from '@/lib/rewards-store';
import type { StudySession } from '@/lib/study-session';

const RewardsContext = createContext<{ state: RewardsState; complete: (s: StudySession) => void; confirm: (id: string) => void; error: string }>({ state: emptyRewards, complete: () => {}, confirm: () => {}, error: '' });
export const useRewards = () => useContext(RewardsContext);
export function RewardsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(emptyRewards);
  const [error, setError] = useState('');
  const current = useRef(emptyRewards);
  useEffect(() => {
    try { current.current = parseRewards(localStorage.getItem(REWARDS_KEY)); setState(current.current); }
    catch { setError('Local saving is unavailable. Keep this page open to retain your reward.'); }
    const sync = (event: StorageEvent) => { if (event.key === REWARDS_KEY) { current.current = parseRewards(event.newValue); setState(current.current); } };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const complete = (session: StudySession) => {
    const next = completeReward(current.current, session, new Date().toISOString());
    if (next === current.current) return;
    try { localStorage.setItem(REWARDS_KEY, JSON.stringify(next)); setError(''); }
    catch { setError('Your reward could not be saved. Keep this page open and try confirming again.'); }
    current.current = next; setState(next);
  };
  const confirm = (id: string) => {
    // Read latest persisted claims before committing, so another tab cannot repeat a claim.
    const persisted = parseRewards(localStorage.getItem(REWARDS_KEY));
    const merged = { collected: persisted.collected, pending: [...persisted.pending, ...current.current.pending].filter((r, i, a) => !persisted.collected.some((c) => c.earnedSessionId === r.earnedSessionId) && a.findIndex((p) => p.earnedSessionId === r.earnedSessionId) === i) };
    const next = confirmReward(merged, id);
    localStorage.setItem(REWARDS_KEY, JSON.stringify(next));
    current.current = next; setState(next); setError('');
  };
  return <RewardsContext.Provider value={{ state, complete, confirm, error }}>{children}</RewardsContext.Provider>;
}