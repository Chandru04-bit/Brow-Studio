# Lash & Brow Studio — Premium Beauty Website

A complete, glamorous, elegant, and fully responsive website for an **Eyelash Extension & Brow Studio**.

Crafted with a luxury beauty editorial aesthetic, refined typography, soft blush & champagne gold color palettes, and smooth vanilla JavaScript interactions.

---

## 1. Project Overview

- **Project Type:** Service-based luxury beauty studio website.
- **Pages Included:**
  - `index.html` (Homepage with 10 sections: Hero, Studio Story, Featured Services, Lash Lookbook Lightbox, 6 Benefits, Before/After Interactive Comparison, 3-Step Process, Testimonials, FAQ Accordion, Booking CTA Banner).
  - `services.html` (Comprehensive Services Menu with 8 sections: Hero, Lash Mapping Methodology, Detailed Extension Sets, Lash Lifts & Tints, Brow Treatments, Aftercare Protocols, Add-ons & Maintenance, Consultation Banner).
  - `pricing.html` (Transparent Pricing & Policies with 8 sections: Hero, Curated Value Bundles, Full Sets & Refill Menu, Natural Lash & Brow Menu, Specialty Add-ons, Studio Booking Policies, VIP Membership Society, CTA Banner).
  - `gallery.html` (Dedicated Artistry Lookbook & Portfolio with dynamic category filtering, 12 high-resolution macro beauty cards, interactive before/after transformation sliders, lash anatomy selection guide, and full-screen lightbox modal).
  - `about.html` (Dedicated Studio Story & Philosophy page with founder & master artist spotlight, studio sanctuary collage, 4 core studio standards, client experiences & reviews, and private consultation CTA).
  - `contact.html` (Interactive Appointment Booking with 7 sections: Hero, Studio Contact Details & Hours, 10-Field Validated Booking Form with URL parameter pre-filling, First Visit Guide, Pre-Appointment Checklist, Location & Parking Directions, Urgent Inquiries Line).
  - `404.html` (Branded Error Page with luxury styling and quick links).
- **Frontend Stack:** HTML5, CSS3, Vanilla JavaScript, and Bootstrap 5 (via CDN).
- **Icons:** Bootstrap Icons (via CDN).
- **Responsive Viewport Coverage:** 320px to 1920px (Mobile-first, small phones, phablets, tablets, laptops, ultra-wide screens).
- **Direct Execution:** Runs instantly by double-clicking `index.html` in any modern web browser without any Node.js, npm, or build tool requirements.

---

## 2. Strict Technology Rules Followed

1. **Zero Frontend Frameworks:** No React, Next.js, Angular, or Vue.js.
2. **Zero Tailwind CSS:** Custom CSS3 with CSS variables and Bootstrap 5 utilities.
3. **Zero TypeScript or JSX:** Pure standard Vanilla JavaScript (ES6+).
4. **Zero jQuery:** Pure DOM APIs.
5. **Separation of Concerns:** HTML, CSS (`style.css`, `components.css`, `responsive.css`), and JavaScript (`main.js`, `gallery.js`, `booking.js`) are kept strictly separated.
6. **No Build Step:** Runs directly via CDN links for Bootstrap 5 and Bootstrap Icons.

---

## 3. Brand Identity & Design System

- **Warm Ivory:** `#FFF9F5` (Base background)
- **Soft Blush Pink:** `#F5E5E5` / `#FAF2F2` (Section contrast & card accents)
- **Dusty Rose:** `#C98291` (Primary beauty tone)
- **Deep Charcoal:** `#30272A` (Rich high-contrast typography)
- **Champagne Gold:** `#C7A66A` (Luxury buttons, borders & badges)
- **Pure White:** `#FFFFFF` (Card surfaces & modal backgrounds)
- **Muted Text:** `#82767A` (Readable, accessible body copy)
- **Typography:**
  - Headings: `Cormorant Garamond` (Classic luxury editorial serif)
  - Body Text: `Plus Jakarta Sans` (Crisp, clean geometric sans-serif)

---

## 4. Directory & File Structure

```text
Brow Studio/
│
├── index.html                  # Main landing page (10 sections)
├── services.html               # Service catalog & mapping (8 sections)
├── pricing.html                # Pricing menu, bundles & policies (8 sections)
├── gallery.html                # Dedicated Lookbook & before/after portfolio (5 sections)
├── about.html                  # Dedicated studio story & master artist profile (6 sections)
├── contact.html                # Interactive booking form & contact details (7 sections)
├── 404.html                    # Custom branded error page
├── README.md                   # Complete documentation
│
├── assets/
│   ├── images/
│   │   ├── hero/               # High-resolution hero treatment photography
│   │   ├── services/           # Classic, hybrid, volume, lash lift, brow photos
│   │   ├── lash-styles/        # Lookbook gallery styles (Natural, Wispy, Cat-eye, etc.)
│   │   ├── before-after/       # Paired before & after transformation sets
│   │   ├── testimonials/       # Authentic customer avatar photos
│   │   └── about/              # Studio sanctuary and lash artist photos
│   └── icons/                  # Bootstrap Icons CDN integration
│
├── css/
│   ├── style.css               # Design tokens, typography, navbar, footer, reset
│   ├── components.css          # Cards, buttons, modals, lightbox, form styles, sliders
│   └── responsive.css          # Breakpoints (320px to 1920px), mobile menu drawer
│
└── js/
    ├── main.js                 # Sticky nav, active page state, smooth scroll, back-to-top
    ├── gallery.js              # Lightbox modal, arrow navigation, before/after slider
    └── booking.js              # URL parameter reading, date checks, validation, summary
```

---

## 5. Key Interactive Features

1. **Service Pre-Selection via URL Query Parameters:**
   - Any "Book This Service" button across `index.html`, `services.html`, or `pricing.html` passes the service name (e.g., `contact.html?service=Volume%20Lash%20Extensions`).
   - `booking.js` reads the query parameter, selects the corresponding option in the dropdown, highlights the input, and scrolls smoothly to the booking card.
2. **Past Date Prevention:**
   - The booking form's date picker dynamically calculates today's date (`new Date()`) and sets the `min` attribute, preventing past appointment requests.
3. **Interactive Before/After Transformation Slider:**
   - On `index.html`, users can drag the interactive slider handle (supporting both mouse drag and touch swipe) to reveal the natural lash baseline vs. voluminous lash enhancement.
4. **Gallery Modal Lightbox:**
   - Clicking any item in the Lash Lookbook opens an accessible modal with the image, style title, and styling description.
   - Supports keyboard closing (`Escape`), previous/next navigation (`ArrowLeft` / `ArrowRight`), and button navigation.
6. **Centered Navbar Architecture & Theme/Direction Controls:**
   - **Centered Navigation:** Brand logo is aligned to the left, navigation links are horizontally centered on desktop, and controls are aligned to the right.
   - **Theme Controls (`Light Mode` / `Dark Mode`):** Text-based pill controls that toggle between a soft blush/ivory light theme and a luxurious deep obsidian dark theme with CSS custom properties and instant `localStorage` persistence.
   - **Direction Controls (`LTR` / `RTL`):** Text-based controls that dynamically set `document.documentElement.dir = "ltr"` or `"rtl"`, mirroring the layout, navigation, forms, cards, and icons seamlessly.
   - **Responsive Hamburger Menu:** Tested across all mobile and tablet viewports (320px, 360px, 375px, 390px, 414px, 480px, 576px, 768px, 820px) with auto-close on link click, outside click, and Escape key.

---

## 6. How to Run & Test

1. Open File Explorer to `c:\Users\satha\OneDrive\Desktop\Brow Studio`.
2. Double-click `index.html` to open it in Google Chrome, Microsoft Edge, Safari, or Mozilla Firefox.
3. Test navigation between all pages (`services.html`, `pricing.html`, `contact.html`).
4. Click `Dark Mode` / `Light Mode` to verify instant theme switching across all elements, and refresh to verify `localStorage` persistence.
5. Click `RTL` / `LTR` to verify layout mirroring across the navbar, forms, cards, and footer.
6. Click "Book This Service" on any treatment card to test automatic form pre-selection.
7. Resize your browser window or press `F12` (Developer Tools) to test responsiveness at 320px, 360px, 375px, 390px, 414px, 480px, 576px, 768px, 820px, 1024px, 1440px, and 1920px.

---

## 7. Development Log (3-Day Schedule)

### Day 1: Design System & Core Pages
- Analyzed design requirements, color palette, and typography hierarchy.
- Created directory structure (`assets/images/`, `css/`, `js/`).
- Downloaded curated, high-resolution beauty and studio photography.
- Created `css/style.css` with CSS custom properties, font imports, sticky navbar, and footer.
- Built `index.html` featuring 10 full sections.
- Built `services.html` with 8 full sections and lash mapping methodology.

### Day 2: Pricing Menu & Interactive Booking System
- Built `pricing.html` with 8 full sections, value packages, and studio policies.
- Built `contact.html` with 7 full sections, two-column layout, and 10-field booking form.
- Implemented `js/booking.js` for query parameter pre-selection, date constraints, and instant summary preview.
- Implemented `js/gallery.js` for lightbox modal and before/after comparison slider.
- Connected all navigation links, anchor offsets, and booking CTA buttons.

### Day 3: Responsiveness, QA, Theme Switching & Polish
- Built `css/responsive.css` covering all 16 viewport breakpoints (320px to 1920px).
- Implemented centered desktop navbar layout with brand on left and controls on right.
- Added Light Mode and Dark Mode text button controls with persistent theme tokens.
- Added LTR and RTL text button controls with mirrored layout support.
- Tested mobile menu drawer collapse, outside click, Escape close, and touch targets across 320px to 820px.
- Created custom branded `404.html` error page with quick destination navigation.
- Verified zero console errors, semantic HTML5 tags, accessibility contrast, and image fallbacks.
- Completed project documentation in `README.md`.

---

## 8. Quality Assurance Checklist

- [x] Home page completed (`index.html`, 10 sections)
- [x] Services page completed (`services.html`, 8 sections)
- [x] Pricing page completed (`pricing.html`, 8 sections)
- [x] Contact and Booking page completed (`contact.html`, 7 sections)
- [x] Custom 404 page completed (`404.html`)
- [x] Shared navbar and footer work consistently across all pages
- [x] Desktop navbar content is centered with logo on left and controls on right
- [x] Theme controls (`Light Mode` & `Dark Mode`) work and persist in LocalStorage
- [x] Direction controls (`LTR` & `RTL`) switch page direction smoothly and persist
- [x] Mobile navigation hamburger menu works reliably from 320px to 820px
- [x] Every navigation link opens the correct destination
- [x] Gallery lightbox modal functions with keyboard and mouse navigation
- [x] Service buttons pre-select the correct service on `contact.html`
- [x] Booking form validates all required fields with inline feedback
- [x] Past appointment dates are blocked in the date picker
- [x] Submission feedback displays a summary modal with reference code
- [x] Placeholder prices and demo notices are clearly indicated
- [x] All images are stored locally in `assets/images/` with SVG fallback handlers
- [x] Responsive layout works cleanly from 320px to 1920px without horizontal scroll
- [x] No decorative buttons left without working links or actions
- [x] HTML, CSS, and JS are organized in separate files
- [x] Runs directly by opening `index.html` without npm or build tools

