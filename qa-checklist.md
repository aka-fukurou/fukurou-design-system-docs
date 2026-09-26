# QA Checklist

Verification steps to run before considering the migration complete.

## Tokens

- [ ] Every token in `token-map.md` has a `done` status.
- [ ] No deprecated tokens remain referenced in code or design.
- [ ] Token names follow the agreed naming convention.
- [ ] Light and dark (and any other) modes resolve correctly.

## Components

- [ ] All components in `component-audit.md` are `migrated`.
- [ ] No hardcoded color / spacing / typography values remain.
- [ ] All variants and states (hover, focus, disabled, error) use tokens.
- [ ] Visual regression check passes against baseline.

## Code

- [ ] Build passes with no token-related errors or warnings.
- [ ] Linting / type checks pass.
- [ ] No unused legacy token files or imports remain.

## Design Parity

- [ ] Figma and implementation match for spot-checked screens.
- [ ] Accessibility: color contrast meets WCAG AA.
- [ ] Responsive breakpoints render correctly.

## Sign-off

- [ ] Engineering review
- [ ] Design review
- [ ] Migration log updated with final entry
