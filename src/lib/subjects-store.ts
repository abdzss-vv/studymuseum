import { useMemo, useSyncExternalStore } from 'react';
import { subjects as defaultSubjects } from '@/data/sample';
import type { Subject } from '@/data/types';

export const SUBJECTS_KEY = 'collectnstudy-subjects-v1';
const SUBJECTS_EVENT = 'collectnstudy-subjects-changed';
export function parseSubjects(raw: string | null): Subject[] {
  try {
    const rows: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(rows)) return [];
    const seen = new Set(defaultSubjects.map((s) => s.name.toLocaleLowerCase()));
    return rows.flatMap((row) => {
      if (typeof row !== 'string' || !row.trim()) return [];
      const name = row.trim();
      const key = name.toLocaleLowerCase();
      if (seen.has(key)) return [];
      seen.add(key);
      return [{ id: name, name }];
    });
  } catch { return []; }
}
export function addSubjectToList(custom: Subject[], input: string): { custom: Subject[]; subject: Subject } | null {
  const name = input.trim();
  if (!name) return null;
  const existing = [...defaultSubjects, ...custom].find((s) => s.name.toLocaleLowerCase() === name.toLocaleLowerCase());
  if (existing) return { custom, subject: existing };
  const subject = { id: name, name };
  return { custom: [...custom, subject], subject };
}
function snapshot() {
  try { return window.localStorage.getItem(SUBJECTS_KEY); } catch { return null; }
}
function subscribe(notify: () => void) {
  window.addEventListener('storage', notify);
  window.addEventListener(SUBJECTS_EVENT, notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener(SUBJECTS_EVENT, notify);
  };
}
export function useSubjects() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  const subjects = useMemo(() => [...defaultSubjects, ...parseSubjects(raw)], [raw]);
  const add = (input: string) => {
    const result = addSubjectToList(parseSubjects(snapshot()), input);
    if (!result) return null;
    window.localStorage.setItem(SUBJECTS_KEY, JSON.stringify(result.custom.map((s) => s.name)));
    window.dispatchEvent(new Event(SUBJECTS_EVENT));
    return result.subject;
  };
  return { subjects, add };
}