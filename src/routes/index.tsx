import { createFileRoute } from "@tanstack/react-router";
import { MuseumHome } from "@/components/game/MuseumHome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your little museum" },

      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "description", content: "Turn focused study sessions into collectible art and build your own museum." },
      { property: "og:title", content: "Study Museum — Your little museum" },
      { property: "og:description", content: "Turn focused study sessions into collectible art and build your own museum." },
    ],
  }),
  component: MuseumHome,
});
