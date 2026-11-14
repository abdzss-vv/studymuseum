# Study Museum

# Study Museum — Initial Prototype

Build the initial prototype of a browser-based study and museum management game called **Study Museum**.

## 1. Core concept

Users complete focused study sessions to earn collectible art, sculptures, vehicles, animals, and historical artifacts. Every collectible is permanently associated with the subject the user studied when earning it.

Users can display their collections in a customizable museum, generate virtual visitor revenue, and eventually receive feedback from fictional critics representing upcoming tests.

The central philosophy is that studying is the exclusive way to obtain collectibles. The game should make focused studying feel rewarding without distracting users from their actual work.

## 2. Visual identity and art direction

Create a polished, cozy, sophisticated 2D aesthetic inspired by the atmosphere and visual charm of *Witchbrook*, while maintaining an original visual identity rather than copying its specific assets or interface.

Combine the atmosphere of a beautiful historical museum with the comfort of a relaxing study application.

Visual characteristics:
- Warm, muted colours, natural wood, cream backgrounds, elegant frames, and subtle gold accents.
- Tasteful serif headings paired with highly readable body text.
- Beautifully illustrated museum spaces, display cases, framed paintings, and collectible cards.
- Subtle borders, restrained shadows, and consistent spacing.
- A calm, inviting interface that feels like a thoughtfully designed management game rather than a generic productivity dashboard.
- Responsive layouts that work well on desktop and mobile.

Avoid excessive gradients, neon colours, generic corporate dashboard styling, unnecessary animations, and visually cluttered screens.

## 3. Collectible artwork

The intended catalogue will feature real public-domain artworks and historical artifacts, animals, and vehicles without manufacturer branding or identifying logos.

For the initial prototype:
- Use a small set of representative placeholder items.
- Where appropriate, use real public-domain artwork as visual references, ensuring that the underlying artwork and the specific image reproduction are legally reusable.
- Use generic, unbranded vehicles and animal illustrations.
- Do not generate a large catalogue or implement a reward system yet.
- Keep collectible images and metadata easy to replace or expand later.

Each collectible should eventually support a name, category, rarity, image, estimated in-game value, and associated study subject. For now, these can be represented using sample data.

## 4. Main application structure

Create four primary sections with consistent navigation:

**Study**
- Subject selection.
- Study-session duration selector.
- Prominent timer area.
- Clear start, pause, resume, and reset controls in the interface.
- A short explanation that completed study sessions will eventually award collectibles.

**Museum**
- An illustrated gallery with display spaces, framed artwork, and sculptures.
- A preview of how collected items might appear when displayed.
- Placeholder virtual currency and visitor statistics.
- Visual indications of possible expansion or renovation features.

**Collection**
- A grid of collectible cards.
- Filters for category, rarity, and associated study subject.
- A clean empty-state design for a new player's collection.
- Sample items for demonstrating the layout, clearly treated as demonstration data rather than earned rewards.

**Tests**
- A list of upcoming tests with subjects, dates, and time remaining.
- A functional form or modal that allows users to add a test by entering its name, subject, and deadline.
- Ability to edit or remove sample test entries where practical.
- Clear visual hierarchy for upcoming deadlines.

## 5. Dashboard

Create a home dashboard that provides an overview of:
- Virtual currency.
- Total study time.
- Completed study sessions.
- Upcoming tests.
- A convenient entry point into the next study session.
- A small preview of the museum and collection.

Use sample data for the dashboard, with no implication that the user has actually completed study sessions.

## 6. Technical requirements

- Build a browser-based web application, not a native mobile app.
- Use a simple, maintainable component structure suitable for a beginner learning to develop an application with AI assistance.
- Use reusable components for navigation, cards, buttons, filters, forms, and statistics.
- Keep sample data separate from presentation components wherever practical.
- Use a consistent data structure for subjects, tests, and collectible items.
- Implement functional navigation and basic interface interactions wherever practical.
- Do not implement real study-session rewards, collection progression, critic events, or the museum economy yet.
- Do not add authentication, multiplayer, payments, advertising, 3D graphics, or complex backend infrastructure.
- Avoid unnecessary libraries and paid integrations.
- Ensure the layout is responsive and accessible, with readable text and clear interaction states.

## 7. Implementation process

Before making changes, explain the proposed component structure, data organization, and implementation approach in beginner-friendly language.

Then build the initial interface without expanding beyond the requested scope.

After implementation, provide a concise report covering:
1. Which screens and interactions work.
2. Which features still use placeholder data.
3. Any known limitations or issues.
4. The single most appropriate next implementation step.

Prioritize a visually cohesive, functional foundation over a large number of incomplete features.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://study-curio-museum.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f3cfe047-2cc9-410f-9f88-71c5e32c9b97).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
