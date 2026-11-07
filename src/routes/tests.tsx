import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/game/ui";
import { TestsContent } from "@/components/game/TestsContent";

export const Route = createFileRoute("/tests")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Tests" },
      { name: "description", content: "Track upcoming tests and deadlines." },
      { property: "og:title", content: "Tests" },
      { property: "og:description", content: "Track upcoming tests and deadlines." },
    ],
  }),
  component: Tests,
});

function Tests() { return <><PageHeader title="Upcoming Tests" /><TestsContent /></>; }
