# Button System Rework Implementation Plan

> **For Codex execution:** Follow this plan task-by-task. Preserve unrelated user changes in the working tree.

**Goal:** Replace the current mixed button styling with one ScholarHub button system built on Kumo conventions: pill-shaped CTAs and actions, compact controls for dense UI, and consistent keyboard, loading, disabled, and responsive states.

**Architecture:** Keep `src/components/ui/button.tsx` as the app-level semantic boundary so existing callers do not depend directly on Kumo internals. Use Kumo Button/LinkButton behavior and class conventions where compatible, while centralizing ScholarHub variants, sizes, focus treatment, press feedback, and responsive hit-area rules in the local primitive. Migrate callers by semantic role rather than applying `rounded-full` indiscriminately.

**Validation:** `npx tsc --noEmit`, `npm run build`, and the repository lint command. Also inspect the final diff for unintended changes and run a focused search to confirm old one-off button classes are not left on migrated action surfaces.

## Task 1: Establish the shared button contract

**Files:**
- `src/components/ui/button.tsx`
- `src/app/globals.css`
- Any small supporting UI primitive needed for link buttons, only if the current component cannot safely cover both button and link semantics.

1. Inspect the current Base UI/shadcn-compatible API and preserve compatibility for existing `variant`, `size`, `asChild`/render, ref, and event-handler usage where it is still needed by dialogs, sheets, menus, and navigation.
2. Define the semantic visual roles: `primary`, `secondary`, `ghost`, `danger`, `control`, and `icon`; retain aliases for existing callers only where migration cannot be done in the same pass.
3. Define the shape contract: `pill` for action/CTA surfaces, compact rounded rectangle for controls, and circle/square hit areas for icon-only controls. Keep segmented controls as a parent/child composition rather than individual oversized pills.
4. Consolidate dimensions and interaction states: 40px desktop action height, 44px minimum mobile touch target, disabled/loading treatment, visible `:focus-visible`, and the existing press feedback with reduced-motion support.
5. Remove broad `transition-all` and any global rule that suppresses keyboard focus. Keep transitions limited to color, border, shadow, and transform properties.
6. Add or normalize shared tokens/utilities only where they reduce duplication; do not introduce a second styling system or change unrelated typography/color tokens.

## Task 2: Migrate global navigation and landing-page actions

**Files:**
- `src/components/Navbar.tsx`
- `src/components/Hero.tsx`
- `src/components/Footer.tsx`
- `src/components/NewsletterFooter.tsx`
- `src/components/Inspiration.tsx`
- `src/components/CuratedPicks.tsx`
- `src/components/Trending.tsx`
- `src/components/CompareCTA.tsx`

1. Convert text CTAs and navigation actions to the shared semantic primitive or its link equivalent so links remain real links and buttons remain real buttons.
2. Use primary navy pills for the main conversion action, secondary light pills for inverse/low-emphasis actions, and ghost styling for utility navigation.
3. Preserve existing destinations, analytics hooks, auth behavior, responsive layout, and copy. Do not force every navbar utility or footer link into a large pill.
4. Remove local `rounded-full`, padding, shadow, and hover-class combinations that duplicate the shared contract.

## Task 3: Migrate scholarship cards, detail actions, and save/compare flows

**Files:**
- `src/components/ScholarshipCard.tsx`
- `src/components/CountryScholarshipCard.tsx`
- `src/components/SaveScholarshipButton.tsx`
- `src/components/RemoveShortlistButton.tsx`
- `src/components/ScholarshipCompareModal.tsx`
- `src/components/ShortlistDashboard.tsx`
- `src/components/ScholarshipTrackDetailView.tsx`
- `src/components/ApplicationTracker.tsx`

1. Map card/detail primary actions to the primary pill role and outline/light actions to the secondary role.
2. Keep save, remove, close, expand, and other icon-only actions as compact icon controls with accessible names and visible focus states.
3. Normalize loading, optimistic state, disabled state, and destructive confirmation styling without changing business logic or API calls.
4. Ensure card layouts do not overflow when labels wrap; allow action groups to stack or stretch at narrow breakpoints while retaining minimum touch targets.

## Task 4: Migrate quiz, filtering, calendar, and dense controls

**Files:**
- `src/components/ScholarMatchQuiz.tsx`
- `src/components/ScholarshipsFilter.tsx`
- `src/components/DatePicker.tsx`
- `src/components/DeadlineCalendar.tsx`
- `src/components/ScholarshipTrackDetailView.tsx`
- Related `src/components/ui/dialog.tsx`, `src/components/ui/sheet.tsx`, `src/components/ui/input-group.tsx`, and any file found by the focused button search.

1. Use primary/secondary pills for quiz progression, submit, reset, and other clear actions.
2. Keep filter toggles, tabs, sort controls, calendar cells, pagination, and segmented choices compact and information-dense; use the shared control role instead of CTA styling.
3. Use icon role for previous/next/close/menu actions and verify tooltip/aria-label coverage where the icon is the only visible content.
4. Preserve keyboard navigation and selected/pressed semantics for filters, tabs, calendar dates, and quiz choices. Do not replace semantic state attributes with color alone.
5. Check mobile wrapping and modal/sheet footer layouts after migration.

## Task 5: Verification and review

1. Run `npx tsc --noEmit` and fix type errors introduced by the migration.
2. Run the project build and confirm the new primitive works in the production bundle.
3. Run the repository lint command; distinguish pre-existing findings from regressions and fix all new findings in touched files.
4. Search for remaining button-like one-off styling (`<button>`, button variants, and links carrying button classes), then review each result for an intentional control exception.
5. Inspect the final diff and verify that only the approved button-system rework and its plan/spec documentation are included; preserve unrelated dirty-worktree changes.
6. Report the touched areas, validation evidence, and any pre-existing lint debt separately from the completed migration.
