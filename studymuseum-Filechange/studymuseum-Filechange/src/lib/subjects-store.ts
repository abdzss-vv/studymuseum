import { useMemo, useSyncExternalStore } from 'react';
import { subjects as defaultSubjects } from '@/data/sample';
import type { Subject } from '@/data/types';

export const SUBJECTS_KEY = 'collectnstudy-subjects-v1';
export const REMOVED_SUBJECTS_KEY = 'collectnstudy-removed-subjects-v1';
const SUBJECTS_EVENT = 'collectnstudy-subjects-changed';
export function parseRemovedSubjects(raw: string | null): string[] {
  try {
    const rows: unknown = JSON.parse(raw ?? '[]');
    return Array.isArray(rows) ? rows.filter((id): id is string => typeof id === 'string' && isBuiltInSubject(id)) : [];
  } catch { return []; }
}
export function availableSubjects(custom: Subject[], removed: string[]): Subject[] {
  return [...defaultSubjects.filter((s) => !removed.includes(s.id)), ...custom];
}
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
export function removeSubjectFromList(custom: Subject[], id: string): Subject[] {
  return custom.filter((s) => s.id !== id);
}
export function isBuiltInSubject(id: string): boolean {
  return defaultSubjects.some((s) => s.id === id);
}
function snapshot(key = SUBJECTS_KEY) {
  try { return window.localStorage.getItem(key); } catch { return null; }
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
  const removedRaw = useSyncExternalStore(subscribe, () => snapshot(REMOVED_SUBJECTS_KEY), () => null);
  const subjects = useMemo(() => availableSubjects(parseSubjects(raw), parseRemovedSubjects(removedRaw)), [raw, removedRaw]);
  const add = (input: string) => {
    const result = addSubjectToList(parseSubjects(snapshot()), input);
    if (!result) return null;
    window.localStorage.setItem(SUBJECTS_KEY, JSON.stringify(result.custom.map((s) => s.name)));
    window.localStorage.setItem(REMOVED_SUBJECTS_KEY, JSON.stringify(parseRemovedSubjects(snapshot(REMOVED_SUBJECTS_KEY)).filter((id) => id !== result.subject.id)));
    window.dispatchEvent(new Event(SUBJECTS_EVENT));
    return result.subject;
  };
  const remove = (id: string) => {
    const next = removeSubjectFromList(parseSubjects(snapshot()), id);
    window.localStorage.setItem(SUBJECTS_KEY, JSON.stringify(next.map((s) => s.name)));
    if (isBuiltInSubject(id)) {
      window.localStorage.setItem(REMOVED_SUBJECTS_KEY, JSON.stringify([...new Set([...parseRemovedSubjects(snapshot(REMOVED_SUBJECTS_KEY)), id])]));
    }
    window.dispatchEvent(new Event(SUBJECTS_EVENT));
    return availableSubjects(next, parseRemovedSubjects(snapshot(REMOVED_SUBJECTS_KEY)));
  };
  return { subjects, add, remove, isBuiltIn: isBuiltInSubject };
}