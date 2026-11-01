import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addSubjectToList, parseSubjects, SUBJECTS_KEY } from '@/lib/subjects-store';
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
    fireEvent.change(selects[0], { target: { value: '__add_subject__' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'New subject' }), { target: { value: 'Art History' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add subject' }));
    fireEvent.change(selects[1], { target: { value: 'Art History' } });
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
});