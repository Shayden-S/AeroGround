---
name: AeroGround GSE Operations
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#424655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0054d8'
  primary: '#004bc3'
  on-primary: '#ffffff'
  primary-container: '#1d63ed'
  on-primary-container: '#eeefff'
  inverse-primary: '#b3c5ff'
  secondary: '#49607c'
  on-secondary: '#ffffff'
  secondary-container: '#c7dfff'
  on-secondary-container: '#4b637e'
  tertiary: '#006243'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d57'
  on-tertiary-container: '#bdffdc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#00184a'
  on-primary-fixed-variant: '#003fa5'
  secondary-fixed: '#d1e4ff'
  secondary-fixed-dim: '#b0c9e8'
  on-secondary-fixed: '#011d35'
  on-secondary-fixed-variant: '#314863'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  data-mono:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system delivers a high-precision, mission-critical operational cockpit for airport apron supervisors, fleet dispatchers, and maintenance engineers. The visual identity merges the discipline of avionics telemetry with modern enterprise efficiency: robust, highly legible under harsh industrial lighting or rapid glance scenarios, and uncompromising on data integrity.

The design movement combines **Corporate Modern** with **Technical Control Room** aesthetics. High data density is balanced by structured spatial cadence, tactical status indicators, and low-cognitive-load layouts. Interactions are crisp and immediate, projecting dependability, absolute situational awareness, and operational rigor.

## Colors

The palette establishes a dual-tier operational environment: a commanding dark navy navigation structure paired with a clean, high-contrast light slate workspace.

- **Primary (`#1D63ED`)**: Aviation Cobalt Blue. Drives primary interactive paths, selected states, and dispatch triggers.
- **Secondary (`#102A43`)**: Deep Avionics Navy. Anchors navigation shells, fixed telemetry rail backgrounds, and top-level grouping anchors.
- **Success / Available (`#059669`)**: Emerald green for equipment cleared for service, operational charging docks, and completed turnarounds.
- **Warning / Due Soon / Active (`#D97706`)**: Amber ochre for assets currently on stand, approaching preventive maintenance windows, or low-fuel/charge alerts.
- **Critical / Fault / AOG (`#DC2626`)**: High-visibility aviation crimson for mechanical faults, grounding orders (Out of Service), and safety lockouts.
- **Inactive / Standby Neutral (`#64748B`)**: Slate neutral for unassigned assets, metadata stamps, inactive telemetry points, and muted layout scaffolding.
- **Surfaces**: Canvas renders on `#F8FAFC`, card containers on `#FFFFFF` with structural divider lines defined by `#E2E8F0`.

## Typography

Inter serves across all hierarchy tiers to maximize legible data scanning at high density. Numerical fields, gate coordinates, asset registration tails (e.g., `GPU-402`, `BELT-109`), and telemetry streams utilize tabular figures (`font-variant-numeric: tabular-nums`) to prevent layout jitter during real-time apron feeds. 

Uppercase treatments are strictly reserved for `label-sm` badges, status chips, table headers, and operational codes to facilitate rapid tactical differentiation.

## Layout & Spacing

The system runs on an 8px spatial grid (with a 4px baseline sub-unit for dense tabular rows and telemetry badges).

- **Grid Architecture**: 12-column responsive fluid grid with fixed lateral navigation rails (64px collapsed, 260px expanded).
- **Desktop/Console Layout**: High-density multi-pane views (tactile map/apron view paired with split-pane asset rosters and service schedules).
- **Tablet/Ramp Operations**: Fluid 8-column layout with 16px margins, touch-safe hit areas for apron personnel wearing field gloves (minimum 44px targets).
- **Breakpoints**: 
  - Mobile: `< 768px` (single stacked column, tabular data falls back to status cards).
  - Tablet: `768px - 1199px` (8 columns, collapsible fleet list).
  - Desktop / Workstation: `1200px+` (12 columns, fixed command hierarchy).

## Elevation & Depth

Visual separation relies primarily on crisp surface borders (`1px solid #E2E8F0`) augmented by subdued, low-opacity ambient shadows to preserve a clean industrial aesthetic without visual clutter.

- **Level 0 (Canvas)**: `#F8FAFC`, zero elevation.
- **Level 1 (Cards, Tabular Containers, Control Strips)**: Pure `#FFFFFF`, `box-shadow: 0 1px 3px 0 rgba(16, 42, 67, 0.05), 0 1px 2px -1px rgba(16, 42, 67, 0.03)`, border `1px solid #E2E8F0`.
- **Level 2 (Dropdowns, Tactical Popovers, Flyout Panels)**: `#FFFFFF`, `box-shadow: 0 4px 6px -1px rgba(16, 42, 67, 0.08), 0 2px 4px -2px rgba(16, 42, 67, 0.04)`, border `1px solid #CBD5E1`.
- **Level 3 (Modal Dialogs, Emergency Grounding Lockouts)**: `#FFFFFF`, `box-shadow: 0 20px 25px -5px rgba(16, 42, 67, 0.15), 0 8px 10px -6px rgba(16, 42, 67, 0.08)`.
- **Navigation Shell**: Solid `#0B192C` or `#102A43` creating absolute high-contrast separation against the light slate operational field.

## Shapes

The design uses a restrained, semi-sharp corner radius (`roundedness: 1` — 4px standard radius). This imparts a structured, instrumentation-grade feel consistent with aircraft cockpit avionics and rugged field hardware. 

- Data tables, cards, and modal windows employ `4px` to `6px` radii.
- Telemetry badges, status indicators, and quick-filter pills employ a full-pill curvature (`9999px`) to immediately visually differentiate actionable status tags from structural cards and input fields.

## Components

### Buttons & Tactical Triggers
- **Primary Buttons**: Solid `#1D63ED` with white text, 4px corner radius, height 36px (desktop) / 44px (field ramp mode). Active state transitions to `#174FBE`.
- **Secondary Buttons**: Outlined with `1px solid #CBD5E1`, background `#FFFFFF`, text `#102A43`. Hover brings `#F1F5F9`.
- **Destructive/Emergency Action**: `#DC2626` background, dedicated confirmation modal step for AOG (Aircraft on Ground) lockout or asset red-tagging.

### Badges & Telemetry Pills
- Status pills consist of a 6px glowing indicator dot and bold uppercase text:
  - *Available*: Green dot (`#059669`), green tint background (`#ECFDF5`), border `#A7F3D0`.
  - *In Use / Turnaround*: Amber dot (`#D97706`), amber tint background (`#FFFBEB`), border `#FDE68A`.
  - *Out of Service / Critical*: Red dot (`#DC2626`), red tint background (`#FEF2F2`), border `#FECACA`.
  - *Standby*: Slate dot (`#64748B`), slate tint background (`#F1F5F9`), border `#E2E8F0`.

### Data Tables & Asset Rosters
- Dense, flat rows with 40px standard row height.
- Row zebra striping omitted in favor of thin `1px solid #F1F5F9` dividers and a high-contrast `#F8FAFC` row hover state.
- Columns featuring flight numbers, asset IDs, and battery/fuel percentages use monospace numbers (`font-variant-numeric: tabular-nums`).

### Input Fields & Controls
- Form inputs feature a crisp `1px solid #CBD5E1` boundary, `#FFFFFF` interior, and a 2px outer focus ring in `#1D63ED` with zero opacity bleed.
- Interactive segment controls/tabs utilize a solid neutral container (`#E2E8F0`) with white elevated toggle segments.

### Apron Tactical Overview Cards
- High-visibility cards with a 3px vertical accent border on the left edge corresponding to the asset's active operational state (emerald, amber, crimson, or slate).