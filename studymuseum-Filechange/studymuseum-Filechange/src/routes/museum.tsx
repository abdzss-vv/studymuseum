import { createFileRoute } from "@tanstack/react-router";
import { MuseumHome } from "@/components/game/MuseumHome";

export const Route = createFileRoute("/museum")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Museum" },
      { name: "description", content: "Display your earned collectibles in your own museum." },
      { property: "og:title", content: "Museum" },
      { property: "og:description", content: "Display your earned collectibles in your own museum." },
    ],
  }),
  component: MuseumHome,
});

