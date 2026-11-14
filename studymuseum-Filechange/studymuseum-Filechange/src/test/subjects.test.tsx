import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addSubjectToList, availableSubjects, parseRemovedSubjects, parseSubjects, removeSubjectFromList, SUBJECTS_KEY, REMOVED_SUBJECTS_KEY } from '@/lib/subjects-store';
import { StudySelector } from '@/components/game/StudySelector';
import { TestForm } from '@/components/game/TestForm';
import { subjectName } from '@/data/sample';

beforeEach(() => localStorage.clear());
afterEach(cleanup);
describe('Custom subjects', () => {
  it('saves a subject entered in Begin Session and reuses it for Upcoming Tests after remount', () => {
    const start = vi.fn();
    const view = render(<StudySelector onStart={start} />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Subject' }), { target: { value: '__add_subject__' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'New subject' }), { target: { value: 'Chemistry' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add subject' }));
    fireEvent.click(screen.getByRole('button', { name: /Enter the reading room/ }));
    expect(start.mock.calls[0]?.[0].subject).toBe('Chemistry');
    expect(parseSubjects(localStorage.getItem(SUBJECTS_KEY))).toEqual([{ id: 'Chemistry', name: 'Chemistry' }]);
    view.unmount();
    const submit = vi.fn();
    render(<TestForm onSubmit={submit} />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Subject' }), { target: { value: 'Chemistry' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Test name' }), { target: { value: 'Organic chemistry exam' } });
    fireEvent.change(screen.getByLabelText('Deadline'), { target: { value: '2026-11-15' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add test' }));
    expect(submit).toHaveBeenCalledWith({ name: 'Organic chemistry exam', subjectId: 'Chemistry', deadline: '2026-11-15' });
    expect(subjectName(submit.mock.calls[0]?.[0].subjectId)).toBe('Chemistry');
  });
  it('creates a subject in Upcoming Tests and shares it with the study menu immediately', () => {
    const start = vi.fn();
    render(<><TestForm onSubmit={vi.fn()} /><StudySelector onStart={start} /></>);
    const selects = screen.getAllByRole('combobox', { name: 'Subject' });
    const testSelect = selects[0];
    const studySelect = selects[1];
    if (!testSelect || !studySelect) throw new Error('Both subject menus must be available');
    fireEvent.change(testSelect, { target: { value: '__add_subject__' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'New subject' }), { target: { value: 'Art History' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add subject' }));
    fireEvent.change(studySelect, { target: { value: 'Art History' } });
    fireEvent.click(screen.getByRole('button', { name: /Enter the reading room/ }));
    expect(start.mock.calls[0]?.[0].subject).toBe('Art History');
  });
  it('rejects empty subjects and reuses matching built-in or custom subjects', () => {
    expect(addSubjectToList([], '  ')).toBeNull();
    expect(addSubjectToList([], ' history ')?.subject.id).toBe('history');
    const added = addSubjectToList([], ' Chemistry ');
    expect(added?.subject.name).toBe('Chemistry');
    expect(addSubjectToList(added?.custom ?? [], 'chemistry')?.custom).toHaveLength(1);
  });
  it('removes only the named custom subject from the saved list', () => {
    const custom = [{ id: 'Chemistry', name: 'Chemistry' }, { id: 'Latin', name: 'Latin' }];
    expect(removeSubjectFromList(custom, 'Chemistry')).toEqual([{ id: 'Latin', name: 'Latin' }]);
    expect(removeSubjectFromList(custom, 'physics')).toEqual(custom);
  });
  it('deletes a custom subject only after an explicit confirmation', () => {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(['Chemistry']));
    const start = vi.fn();
    render(<StudySelector onStart={start} />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Subject' }), { target: { value: 'Chemistry' } });
    fireEvent.click(screen.getByRole('button', { name: 'Remove Chemistry' }));
    expect(screen.getByText('Are you sure you want to delete Chemistry?')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(parseSubjects(localStorage.getItem(SUBJECTS_KEY))).toEqual([{ id: 'Chemistry', name: 'Chemistry' }]);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Chemistry' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(parseSubjects(localStorage.getItem(SUBJECTS_KEY))).toEqual([]);
    expect(screen.queryByText('Are you sure you want to delete Chemistry?')).toBeNull();
    expect(within(screen.getByRole('combobox', { name: 'Subject' })).getByRole('option', { name: 'History' })).toBeTruthy();
  });
  it.each([['history', 'History'], ['math', 'Mathematics']])('removes built-in %s only after confirmation and persists across remount', (id, name) => {
    const view = render(<StudySelector onStart={vi.fn()} />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Subject' }), { target: { value: id } });
    fireEvent.click(screen.getByRole('button', { name: `Remove ${name}` }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(parseRemovedSubjects(localStorage.getItem(REMOVED_SUBJECTS_KEY))).toEqual([]);
    fireEvent.click(screen.getByRole('button', { name: `Remove ${name}` }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(parseRemovedSubjects(localStorage.getItem(REMOVED_SUBJECTS_KEY))).toEqual([id]);
    view.unmount();
    render(<TestForm onSubmit={vi.fn()} />);
    expect(within(screen.getByRole('combobox', { name: 'Subject' })).queryByRole('option', { name })).toBeNull();
    expect(subjectName(id)).toBe(name);
  });
  it('can restore a removed built-in subject through Add subject with its stable ID', () => {
    localStorage.setItem(REMOVED_SUBJECTS_KEY, JSON.stringify(['history']));
    const start = vi.fn();
    render(<StudySelector onStart={start} />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Subject' }), { target: { value: '__add_subject__' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'New subject' }), { target: { value: 'History' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add subject' }));
    fireEvent.click(screen.getByRole('button', { name: /Enter the reading room/ }));
    expect(start.mock.calls[0]?.[0].subject).toBe('history');
    expect(parseRemovedSubjects(localStorage.getItem(REMOVED_SUBJECTS_KEY))).toEqual([]);
  });
  it('requires a subject before starting a session when all subjects were removed', () => {
    const ids = availableSubjects([], []).map((s) => s.id);
    localStorage.setItem(REMOVED_SUBJECTS_KEY, JSON.stringify(ids));
    const start = vi.fn();
    render(<StudySelector onStart={start} />);
    fireEvent.click(screen.getByRole('button', { name: /Enter the reading room/ }));
    expect(start).not.toHaveBeenCalled();
    expect(availableSubjects([], ids)).toEqual([]);
  });
});