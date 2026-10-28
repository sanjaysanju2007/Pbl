# Chittukurumbakam Play School — "Sunny Beginnings" Re-Theme

## Overview
The web application for **Chittukurumbakam Play School** has been completely re-themed to **"Sunny Beginnings"**. The design is warm, welcoming, cheerful, and trustworthy — specifically tailored for parents of primary school children with a mobile-first focus.

All backend functionality, database schemas, API routes, authentication logic, and form validations were **100% preserved**. Only the presentation and visual design layer was overhauled.

---

## Design System Tokens
All styling is centralized in [`client/src/index.css`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/src/index.css):

### Colors
- **`--color-primary`**: `#1F7AB8` (sky blue: main buttons, links, active states)
- **`--color-primary-light`**: `#DCEFFB` (light blue backgrounds, hover)
- **`--color-accent`**: `#FFC93C` (sunny yellow: highlights, badges, secondary buttons)
- **`--color-accent-soft`**: `#FFF3C4` (soft yellow: section backgrounds, footer, table headers)
- **`--color-bg`**: `#FFFBF0` (warm cream page background)
- **`--color-surface`**: `#FFFFFF` (cards, forms, modals)
- **`--color-text`**: `#1F3A5F` (deep navy: headings, body copy, and text on yellow)
- **`--color-text-muted`**: `#5B6B80` (muted slate navy)
- **`--color-border`**: `#F1E6C8` (warm cream border)
- **`--color-success`**: `#3FB984` (mint green)
- **`--color-warning`**: `#F5A623` (warm amber)
- **`--color-error`**: `#E5484D` (soft crimson red)
- **`--color-info`**: `#4DA8DA` (info blue)

*WCAG AA Rule: Dark navy text (`#1F3A5F`) is strictly used on yellow backgrounds (never white on yellow).*

### Typography
- **Headings**: `"Nunito", sans-serif` (weights 700, 800, 900) via Google Fonts
- **Body & Forms**: `"Inter", sans-serif` (weights 400, 500, 600) via Google Fonts
- **Base Size**: 16px minimum with 1.6 line-height for effortless parent readability

### Shapes & Elevations
- **Border Radius**: 12px for inputs & buttons (min height 48px); 20px for cards & modals
- **Shadow**: `0 4px 16px rgba(31, 58, 95, 0.08)`, soft, gentle elevation
- **Transitions**: 150ms–250ms with `prefers-reduced-motion` compliance

---

## Changed Files Summary
1. [`client/index.html`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/index.html) — Google Fonts preconnect and stylesheets (`Nunito` & `Inter`).
2. [`client/src/index.css`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/src/index.css) — Central design tokens, typography, root variables, buttons, inputs, cards.
3. [`client/src/components/layout/Navbar.jsx`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/src/components/layout/Navbar.jsx) — Sun icon brand badge and "Sunny Beginnings" subtitle.
4. [`client/src/components/layout/Navbar.css`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/src/components/layout/Navbar.css) — Warm cream sticky navbar, active link pill, mobile drawer, CTA buttons.
5. [`client/src/components/layout/Footer.jsx`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/src/components/layout/Footer.jsx) — School contact info, trust badges, and warm welcoming copy.
6. [`client/src/components/layout/Footer.css`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/src/components/layout/Footer.css) — Soft yellow background (`#FFF3C4`), deep navy typography (`#1F3A5F`), social pills.
7. [`client/src/pages/Home.jsx`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/src/pages/Home.jsx) — Hero section with muted rainbow arch graphic and wavy divider.
8. [`client/src/pages/Home.css`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/src/pages/Home.css) — Warm cream background, video scrim, stat strip, and card hover effects.
9. [`client/src/pages/Login.css`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/src/pages/Login.css) — Portal container, dual tab switcher, 48px inputs, card borders.
10. [`client/src/pages/PageStyles.css`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/src/pages/PageStyles.css) — Multi-step admission wizard, sun/dot steps, dropzone, success card.
11. [`client/src/pages/AdmissionForm.jsx`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/src/pages/AdmissionForm.jsx) — Background tokens for multi-step sections and success screen.
12. [`client/src/pages/admin/Admin.css`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/src/pages/admin/Admin.css) — Admin login card, filter bar, search input, status selects, and review drawer.
13. [`client/src/pages/admin/ManageAdmissions.jsx`](file:///c:/Users/Admin/OneDrive/Desktop/Fsd_pbl/FSD%20PBL/client/src/pages/admin/ManageAdmissions.jsx) — Inline colors replaced with design tokens.
