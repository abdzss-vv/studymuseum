import { useState } from "react";
import { subjectName } from "@/data/sample";
import { useTests, daysUntil, timeRemainingLabel } from "@/lib/tests-store";
import { TestForm } from "@/components/game/TestForm";
import { GameButton, SectionTitle } from "@/components/game/ui";

function urgency(deadline: string) {
  const n = daysUntil(deadline);
  if (n < 0) return "border-l-muted-foreground opacity-70";
  if (n <= 3) return "border-l-destructive";
  if (n <= 10) return "border-l-gold";
  return "border-l-sage";
}

export function TestsContent() {
  const { tests, add, update, remove } = useTests();
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <>


      <section>
        <h2 className="mb-3 text-2xl">Add a test</h2>
        <TestForm onSubmit={add} />
      </section>

      <section className="mt-10">
        <SectionTitle>Schedule</SectionTitle>
        {tests.length === 0 && <p className="panel p-6 text-center text-muted-foreground">No tests yet. Add one above.</p>}
        <ul className="space-y-3">
          {tests.map((t) => (
            <li key={t.id} className={`panel border-l-4 p-4 ${urgency(t.deadline)}`}>
              {editing === t.id ? (
                <TestForm
                  initial={t}
                  onSubmit={(v) => { update({ ...v, id: t.id }); setEditing(null); }}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl">{t.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {subjectName(t.subjectId)} ·{" "}
                      {t.deadline}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="mr-2 font-serif text-2xl text-wood"><span suppressHydrationWarning>{timeRemainingLabel(t.deadline)}</span></span>
                    <GameButton variant="outline" onClick={() => setEditing(t.id)} aria-label={`Edit ${t.name}`}>Edit</GameButton>
                    <GameButton variant="danger" onClick={() => remove(t.id)} aria-label={`Remove ${t.name}`}>Remove</GameButton>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
