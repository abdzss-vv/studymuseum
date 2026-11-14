import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/study", label: "Study" },
  { to: "/museum", label: "Museum" },
  { to: "/collection", label: "Collection" },
  { to: "/tests", label: "Tests" },
] as const;

export function AppNav() {
  return (
    <header className="sticky top-0 z-20 border-b-4 border-gold bg-wood text-wood-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="font-serif text-2xl font-semibold tracking-wide">
          Collect<span className="text-gold">n</span>Study
        </Link>
        <nav aria-label="Main" className="-mx-1 flex gap-1 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold text-wood-foreground/80 transition-colors hover:bg-wood-foreground/10 hover:text-wood-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              activeProps={{ className: "bg-wood-foreground/15 !text-gold" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
