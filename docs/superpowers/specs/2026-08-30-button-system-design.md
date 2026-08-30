# ScholarHub Button System Design

**Status:** Approved direction; awaiting written-spec review

## Job and audience

ScholarHub serves students scanning, comparing, saving, and applying to scholarships. Visitors range from first-time explorers on the landing page to returning users managing a shortlist. Buttons must make the next action obvious without making every control feel like a marketing CTA.

## Outcome and product truth

The product should have one recognizable ScholarHub action language across landing pages, authentication, scholarship detail, match quiz, filters, shortlist, and application tracking. The primary outcome is faster recognition of the next useful action: discover a match, view a guide, save a scholarship, or continue an application.

## Selected direction

Use a hybrid Kumo-based system:

- Kumo `Button` and `LinkButton` provide the accessible interaction foundation, loading/disabled behavior, and consistent component API.
- A local ScholarHub wrapper owns product-specific semantics, color tokens, pill treatment, responsive sizing, and migration compatibility with existing call sites.
- Full pills are reserved for text actions and CTAs. Compact controls remain rounded but not fully pill-shaped. Icon-only controls remain circular or square.
- Preserve the existing ScholarHub editorial palette: warm off-white surfaces, navy primary actions, cream/white secondary actions, indigo accent, and red destructive state.

## Button taxonomy

| Semantic role | Visual treatment | Examples |
|---|---|---|
| `primary` | Navy filled pill, high contrast, subtle depth | Find Your Match, View Application Guide, Continue |
| `secondary` | White/cream pill with dark border, fills navy on hover | Browse all scholarships, Back, Compare |
| `ghost` | No capsule by default, quiet text/icon affordance | Cancel, close, low-emphasis navigation |
| `danger` | Red-tinted or red-outline pill; solid red only for confirmed destructive action | Remove from shortlist, delete |
| `control` | Compact rounded rectangle, stable width and dense spacing | Filters, sorting, pagination, calendar controls |
| `icon` | Circle/square hit area, visible focus ring, tooltip/label where needed | Menu, close, carousel arrows, save icon |
| `segmented` | Shared rounded container with one active navy segment | Application status and view toggles |

## Interaction and states

- Text buttons target at least 40px height on desktop and 44px touch area on mobile.
- Primary and secondary actions use the existing tactile press feedback at `scale(0.96)`; reduced-motion users receive no transform animation.
- Hover changes color/border emphasis, not layout. Transitions name exact properties rather than using `transition-all`.
- Focus-visible remains clearly visible for keyboard users. Mouse focus should not introduce a harsh outline.
- Loading buttons retain their width, expose a disabled state, and show a spinner without changing layout.
- Disabled buttons reduce emphasis and do not accept pointer interaction.
- Long labels wrap only where the surrounding layout requires it; primary CTA labels remain readable and do not truncate silently.

## Migration scope

Refactor the shared button primitive first, then migrate action surfaces in this order:

1. Navbar and authentication actions.
2. Hero, compare CTA, curated picks, trending, and newsletter actions.
3. Scholarship cards, scholarship detail, save/remove actions, and application guide actions.
4. Match quiz controls and result CTA.
5. Filters, date picker, calendar, shortlist dashboard, tracker, modal, and remaining icon controls.

Raw buttons that represent a specialized interaction (calendar day, segmented status, dropdown trigger, or carousel arrow) keep their behavior but adopt the taxonomy and shared tokens. No server action, URL, form submission, shortlist behavior, or navigation behavior changes.

## Responsive and accessibility boundaries

- Desktop CTA pills may use compact horizontal padding; mobile controls expand to a comfortable hit area and may become full width when the current layout already expects it.
- Icon-only actions must have an accessible name through visible text, `aria-label`, or tooltip content.
- Color is never the only state indicator; selected, disabled, danger, and focus states also use contrast, border, position, or text treatment.
- Existing motion preferences and page-transition behavior remain intact.

## Anti-goals

- Do not turn filters, tabs, pagination, and calendar cells into oversized marketing pills.
- Do not introduce a second competing button library or duplicate component API.
- Do not rewrite button copy or change application behavior as part of the visual migration.
- Do not remove keyboard focus indicators to make the pill treatment look cleaner.

## Verification

- Inspect representative desktop and mobile states for landing page, login, scholarship detail, match quiz, filters, and shortlist.
- Verify primary, secondary, ghost, danger, control, icon, loading, disabled, hover, focus-visible, and reduced-motion states.
- Run `npm run lint`, `npx tsc --noEmit`, and `npm run build` after implementation.
