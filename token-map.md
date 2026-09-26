# Token Map

Mapping between legacy/source tokens and the new token system.

## Naming Convention

Use slash `/` for Figma variable hierarchy.

Examples:
- color/action/primary/bg/default
- color/action/primary/bg/hover
- color/text/default
- color/border/default
- space/control/x-md
- radius/control/default

Use dash `-` only inside a single name segment.

Examples:
- color/text/on-primary
- space/control/x-md
- font/size/body-sm

Do not use:
- color-action-primary-bg-default
- primaryBlue
- buttonBlue
- gray1
- new-gray

## Token Philosophy

Use existing semantic tokens first.

Only create component-specific tokens when the value is unique to that component or state.

Do not create new tokens for one-off values.

Do not tokenize every unique value automatically.

Flag unclear values as "Needs Review" instead of creating new tokens.

Primitive tokens describe raw values.
Semantic tokens describe usage.
Component tokens describe component-specific decisions.

## Token Layers

### 1. Primitive Tokens

Primitive tokens are raw values. They should not describe usage.

Examples:
- color/blue/600
- color/gray/900
- color/white
- space/16
- radius/8

### 2. Semantic Tokens

Semantic tokens describe purpose and usage.

Examples:
- color/bg/default
- color/text/default
- color/border/default
- color/action/primary/bg/default

### 3. Component Tokens

Component tokens are only used when a component has unique behavior.

Examples:
- color/button/primary/bg/default
- color/button/primary/bg/hover
- space/button/padding/x-md

## Conventions

- **Old Token**: name as it exists in the source (Figma styles, old variables, hardcoded values).
- **New Token**: target token name in the new system.
- **Type**: color, spacing, typography, radius, shadow, etc.
- **Status**: `todo` | `in-progress` | `done` | `deprecated`.

## Color

| Old Token | New Token | Value | Status | Notes |
| --- | --- | --- | --- | --- |
|  |  |  | todo |  |

## Typography

| Old Token | New Token | Value | Status | Notes |
| --- | --- | --- | --- | --- |
|  |  |  | todo |  |

## Spacing

| Old Token | New Token | Value | Status | Notes |
| --- | --- | --- | --- | --- |
|  |  |  | todo |  |

## Radius

| Old Token | New Token | Value | Status | Notes |
| --- | --- | --- | --- | --- |
|  |  |  | todo |  |

## Shadow / Effects

| Old Token | New Token | Value | Status | Notes |
| --- | --- | --- | --- | --- |
|  |  |  | todo |  |

## Deprecated / Removed

Tokens intentionally dropped during migration.

| Old Token | Reason | Replacement |
| --- | --- | --- |
|  |  |  |

## Approved Color Tokens

### Background

| Token | Purpose | Notes |
|---|---|---|
| color/bg/default | Main page or surface background | Usually white/light background |
| color/bg/subtle | Secondary background | Used for quiet sections |
| color/bg/elevated | Cards, popovers, modals | Surface above base page |
| color/bg/inverse | Dark background | Used for inverse sections |

### Text

| Token | Purpose | Notes |
|---|---|---|
| color/text/default | Primary readable text | Main body text |
| color/text/subtle | Secondary text | Helper text, metadata |
| color/text/disabled | Disabled text | Disabled UI |
| color/text/inverse | Text on dark background | Inverse usage |
| color/text/on-primary | Text on primary action background | Usually white |

### Border

| Token | Purpose | Notes |
|---|---|---|
| color/border/default | Standard border | Inputs, cards, dividers |
| color/border/subtle | Low-emphasis border | Light dividers |
| color/border/focus | Focus border | Keyboard/input focus |
| color/border/error | Error border | Validation states |

### Action

| Token | Purpose | Notes |
|---|---|---|
| color/action/primary/bg/default | Primary button default background | Main CTA |
| color/action/primary/bg/hover | Primary button hover background | Hover state |
| color/action/primary/bg/pressed | Primary button pressed background | Pressed state |
| color/action/primary/bg/disabled | Primary button disabled background | Disabled state |
| color/action/primary/text/default | Primary button text | Text/icon on primary button |
