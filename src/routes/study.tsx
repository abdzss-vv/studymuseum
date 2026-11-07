import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MuseumHome } from "@/components/game/MuseumHome";
import { MuseumPanel } from "@/components/game/MuseumPanel";
import { StudySelector } from "@/components/game/StudySelector";
import { FocusMode } from "@/components/game/FocusMode";
import type { StudySession } from "@/lib/study-session";

export const Route = createFileRoute("/study")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Study Session" },
      { name: "description", content: "Start a focused study session with a calm timer." },
      { property: "og:title", content: "Study Session" },
      { property: "og:description", content: "Start a focused study session with a calm timer." },
    ],
  }),
  component: StudyPage,
});

function StudyPage() {
  const [session, setSession] = useState<StudySession | null>(null);
  const navigate = useNavigate();
  const exit = () => { navigate({ to: "/" }); };
  return <><MuseumHome /><MuseumPanel open={!session} onClose={exit} title="Settle in to study" description="Choose a subject and session duration." compact><StudySelector onStart={setSession} /></MuseumPanel>{session && <FocusMode initial={session} onExit={exit} />}</>;
}
