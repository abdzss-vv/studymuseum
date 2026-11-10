<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Sample/demo data lives in `src/data/` (types in `types.ts`), never inline in route components — keeps content easy to replace.
- Reusable game UI lives in `src/components/game/`; colours only via tokens in `src/styles.css` — keeps theming in one place.
- Earned collection tiles use a dedicated front-face display and local-calendar receipt metadata, separate from demo tiles and reveal controls — isolates collection presentation without changing reward behavior.
- Resolve supplied card-front asset pointers against the canonical asset-serving origin — prevents editor iframe addresses from changing front-image delivery.
- Tests list persists in localStorage via `src/lib/tests-store.ts` (no backend in prototype) — scope excludes backend.
- MuseumHome is the shared immersive experience for home and museum; standalone collection and tests routes reuse their panel content — prevents competing screen implementations while preserving public URLs.
- FocusMode and StudySelector share pure timestamp-based session logic in study-session — keeps countdown accurate after inactive tabs and makes pause/completion testable.
- RewardsProvider owns pending and collected local rewards; pure rewards-store transitions deduplicate by session ID, and the global reveal survives navigation — keeps natural completion, confirmation and refresh recovery consistent across study entry points.
- Artwork reveal uses supplied PNG faces and one continuous CSS Y-axis rotation for opening and clicking — preserves physical two-sided rendering without resetting the angle after the reveal.
- MuseumScene renders user artwork as a proportional image in the home layout with container-relative exhibit hit areas; MuseumHome retains all panel/session state and custom artwork controls — keeps visual composition independent of viewport positioning and existing behavior.
- SubjectSelect shares a browser-persisted subject registry through subjects-store; custom subject IDs are display names while built-in IDs stay stable — preserves existing saved tests/rewards and readable custom labels without storage-order dependencies.
- Deleted built-in subjects persist as excluded IDs alongside the existing custom-subject registry; selectors fall back to an available subject and reject empty submissions — preserves saved associations without resurrecting deleted choices.
