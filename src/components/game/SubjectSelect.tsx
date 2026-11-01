import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useSubjects } from '@/lib/subjects-store';
import { GameButton, Select } from './ui';

export function SubjectSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { subjects, add, remove, isBuiltIn } = useSubjects();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const selected = subjects.find((s) => s.id === value);
  const canDelete = Boolean(selected) && !isBuiltIn(value) && !adding;
  const displayName = selected?.name ?? value;
  const save = () => {
    try {
      const subject = add(name);
      if (!subject) return;
      onChange(subject.id);
      setAdding(false);
      setName('');
      setError('');
    } catch { setError('Your subject could not be saved. Please try again.'); }
  };
  const confirmDelete = () => {
    remove(value);
    setConfirming(false);
    onChange('history');
  };
  const options = subjects.map((s) => ({ value: s.id, label: s.name }));
  if (!subjects.some((s) => s.id === value)) options.push({ value, label: value });
  return <div className="min-w-0 space-y-2">
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1">
        <Select label="Subject" value={value} onChange={(next) => {
          if (next === '__add_subject__') setAdding(true);
          else { onChange(next); setAdding(false); setConfirming(false); }
        }} options={[...options, { value: '__add_subject__', label: '+ Add subject' }]} />
      </div>
      {canDelete && <GameButton type="button" variant="ghost" aria-label={`Delete ${displayName}`} title={`Delete ${displayName}`} className="mb-0.5 shrink-0 px-2" onClick={() => setConfirming(true)}><X size={16} /></GameButton>}
    </div>
    {confirming && <div role="alertdialog" aria-label={`Delete ${displayName}`} className="space-y-2 rounded-md border border-destructive/40 bg-card p-3 text-sm">
      <p>Are you sure you want to delete {displayName}?</p>
      <div className="flex flex-wrap gap-2">
        <GameButton type="button" variant="danger" onClick={confirmDelete}><X size={16} /> Delete</GameButton>
        <GameButton type="button" variant="outline" onClick={() => setConfirming(false)}>Cancel</GameButton>
      </div>
    </div>}
    {adding && <div className="space-y-2">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-muted-foreground">New subject</span>
        <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); save(); }
          if (e.key === 'Escape') { e.preventDefault(); setAdding(false); }
        }} className="min-w-0 w-full rounded-md border border-input bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      </label>
      <div className="flex flex-wrap gap-2">
        <GameButton type="button" disabled={!name.trim()} onClick={save}><Plus size={16} /> Add subject</GameButton>
        <GameButton type="button" variant="outline" onClick={() => { setAdding(false); setError(''); }}><X size={16} /> Cancel</GameButton>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>}
  </div>;
}
