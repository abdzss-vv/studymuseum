import { useState, type FormEvent } from "react";
import type { SubjectId, Test } from "@/data/types";
import { GameButton } from "./ui";
import { SubjectSelect } from "./SubjectSelect";

export function TestForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Test;
  onSubmit: (t: Omit<Test, "id">) => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [subjectId, setSubjectId] = useState<SubjectId>(initial?.subjectId ?? "history");
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !deadline) return setError("Please enter a name and a deadline.");
    onSubmit({ name: name.trim(), subjectId, deadline });
    if (!initial) {
      setName("");
      setDeadline("");
    }
    setError("");
  };

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-muted-foreground">Test name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Chemistry Final"
          className="rounded-md border border-input bg-card px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
      <SubjectSelect
        value={subjectId}
        onChange={setSubjectId}
      />
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-semibold text-muted-foreground">Deadline</span>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="rounded-md border border-input bg-card px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
      <div className="flex gap-2">
        <GameButton type="submit">{initial ? "Save" : "Add test"}</GameButton>
        {onCancel && (
          <GameButton type="button" variant="outline" onClick={onCancel}>
            Cancel
          </GameButton>
        )}
      </div>
      {error && <p role="alert" className="text-sm text-destructive sm:col-span-4">{error}</p>}
    </form>
  );
}
