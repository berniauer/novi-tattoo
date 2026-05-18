# CLAUDE.md — Projektkontext für KI-Assistenten

Dieses File beschreibt den Codebase-Kontext, Konventionen und Architektur-Entscheidungen für das Novi Tattoo Projekt. Lies es vollständig bevor du Code schreibst oder änderst.

---

## 1. Projekt-Überblick

**Was:** Premium Portfolio- und Buchungs-Website für Tattoo-Artist "Novi" ([@novi._.tattoo](https://instagram.com/novi._.tattoo)) aus Salzburg.

**Ziel:** Instagram-DM-Chaos durch einen strukturierten Buchungsworkflow ersetzen, Kunstwerk hochwertig präsentieren.

**Zielgruppe:** Anime/Gaming-Fans, Pop-Culture-Enthusiasten, Dark-Art-Collectors. ~90% Mobile-Traffic.

---

## 2. Tech Stack

| Technologie | Version | Zweck |
|-------------|---------|-------|
| Next.js | 16.x | Framework (App Router, TypeScript) |
| Tailwind CSS | v4 | Styling (CSS-basierte Config, kein tailwind.config.ts) |
| Framer Motion | v12 | Alle Animationen |
| Lenis | v1.3 | Smooth Scroll |
| next/font/google | — | Syne (display) + Manrope (body) |

**Kein** GSAP, kein Prisma, kein tRPC.

---

## 3. Verzeichnisstruktur

```
src/
├── app/
│   ├── layout.tsx          # Root layout: Fonts, LenisProvider, <body relative>
│   ├── page.tsx            # Seitenkomposition (Server Component)
│   └── globals.css         # Design Tokens (@theme), Resets, Film-Grain
├── components/
│   ├── Hero.tsx            # Char-Split Heading, Parallax, Scroll-Indicator
│   ├── Portfolio.tsx       # Masonry Grid, Filter-Tabs, Lightbox
│   ├── Process.tsx         # 5-Step Timeline mit SVG-Icons
│   ├── BookingWorkflow.tsx # 4-Step Buchungsformular (Multi-Step)
│   ├── AnatomyMap.tsx      # SVG Body-Map, Multi-Select, Vorder-/Rückansicht
│   ├── FAQ.tsx             # Accordion
│   ├── Footer.tsx          # Instagram-Grid (Mock → Directus), Nav, Copyright
│   ├── SectionTitle.tsx    # Wiederverwendbarer Char-Split Heading
│   └── LenisProvider.tsx   # Smooth Scroll Wrapper (Client Component)
└── lib/
    └── directus.ts         # (TODO) Directus SDK Client
```

**`humanbody/`** — Referenz-Vite-Projekt für SVG-Paths, kein produktiver Code. Von TypeScript via `tsconfig.json exclude` ausgeschlossen.

---

## 4. Design System

### Farben (`globals.css` → `@theme`)

```css
--color-ink:       #0b0b0b   /* Hintergrund (tiefschwarze Basis) */
--color-surface:   #121212   /* Cards, Panels */
--color-surface-2: #1a1a1a   /* Inputs, sekundäre Flächen */
--color-border:    #2a2a2a   /* Alle Trennlinien */
--color-muted:     #555555   /* Placeholder-Text, Deaktiviert */
--color-ghost:     #a0a0a0   /* Sekundärer Text */
--color-accent:    #deff9a   /* Lime Green — NUR für AnatomyMap Glow */
```

### Typografie

```css
--font-display: var(--font-syne)    /* Headlines, CTAs, Nummern */
--font-body:    var(--font-manrope) /* Fließtext, Labels, Inputs */
```

**Schriftgrößen immer via `clamp()`** für mobile Responsivität:
```css
/* Section Titles */
font-size: clamp(2.8rem, 9vw, 7rem)

/* Hero Heading */
font-size: clamp(2.2rem, 13.5vw, 11.5rem)
```

### Easing

```css
--ease-expo: cubic-bezier(0.16, 1, 0.3, 1)  /* Standard für alle Animationen */
```

In TypeScript:
```typescript
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
```

---

## 5. Animations-Konventionen

- **Alle Animationen** via Framer Motion — kein raw CSS `@keyframes` für UI-Animationen
- **Char-Split Pattern:** `overflow-hidden` Clip-Container + `motion.span` mit `y: "108%" → 0%`
- **Wort-Grouping in SectionTitle:** Chars immer nach Wort gruppiert (`<span className="flex">`) um Line-Break auf Wortebene zu erzwingen
- **`whileInView`** mit `viewport={{ once: true }}` für alle Section-Entrances
- **`useReducedMotion()`** immer abfragen — bei `true` Varianten als `{}` übergeben
- **`AnimatePresence mode="wait"`** für Filter/Step-Transitionen
- **Spring-Physics** für Toggle-Elemente (Pills, Checkboxen, Modals)

---

## 6. Schlüssel-Komponenten im Detail

### `SectionTitle.tsx`
Wiederverwendbar. Pflicht-Prop: `children: string` (kein JSX). Chars per Wort gruppiert. Props: `className`, `style`, `delay`.

### `AnatomyMap.tsx`
- **API:** `value: ZoneId[]`, `onChange: (ids: ZoneId[], labels: string[]) => void`
- Multi-Select: beliebig viele Zonen wählbar
- Vorder-/Rückansicht via `side: "front" | "back"` State (interner Toggle)
- ViewBox: `0 0 400 800`
- Akzentfarbe `#deff9a` nur hier verwenden
- Alle 38 Zonen-IDs in `ZoneId` Type definiert

### `BookingWorkflow.tsx`
- `InquiryData.placementId: ZoneId[]` — Array aus AnatomyMap
- `InquiryData.placement: string` — kommagetrennte Labels
- 4 Steps: Konzept → Placement (AnatomyMap) → Bilder → Kontakt
- Submit schreibt aktuell nur `console.log` → TODO: Directus `createItem`

### `Footer.tsx`
- `INSTAGRAM_POSTS` Array ist Mock-Daten
- Interface `InstagramPost` spiegelt Instagram Graph API Felder 1:1
- TODO: `posts` Prop von `page.tsx` (Server Component) befüllen lassen

---

## 7. Tailwind v4 — Wichtige Unterschiede

```
❌ tailwind.config.ts existiert NICHT
✅ Tokens via @theme {} in globals.css

❌ theme('colors.ink') in JS
✅ bg-ink, text-ghost, border-border (direkte CSS-Klassen)

❌ @apply in Component-Styles
✅ Utility-Klassen inline

Opacity-Modifier: bg-white/20 = rgba(255,255,255,0.2)
```

---

## 8. Bekannte Fixes & Fallstricke

| Problem | Ursache | Fix |
|---------|---------|-----|
| Framer Motion "non-static container" Warning | `useScroll` braucht positioned parent | `<body>` hat `relative` Klasse in `layout.tsx` |
| String literal TS-Error in Framer Motion | Typ-Inferenz bei externen Objekt-Konstanten | `as const` auf String-Literale wie `"spring"`, `"easeInOut"` |
| Char-split bricht mitten im Wort | Flex-Items sind einzelne Chars | Chars nach Wort in `<span className="flex">` gruppieren |
| Hero-Text seitlich abgeschnitten | `items-center` shrinks Container, kein `w-full` | `w-full` + `shrink-0` auf Word-Divs |
| humanbody/ bricht TypeScript | Vite-Projekt hat andere TS-Config | In `tsconfig.json` unter `exclude` eingetragen |

---

## 9. CI/CD & Deployment

```
GitHub Push (main)
  → GitHub Actions (.github/workflows/deploy.yml)
  → Docker Build → GHCR (ghcr.io/berniauer/novi-tattoo)
  → Tailscale SSH → VPS
  → docker compose pull + up
```

**Lokal:** `docker compose up -d` startet Directus auf Port 8055. Next.js separat mit `npm run dev`.

**Infra-Files:**
- `Dockerfile` — Multi-stage, Next.js standalone output
- `docker-compose.yml` — Lokal (Directus only)
- `docker-compose.prod.yml` — VPS (Next.js + Directus + Caddy)
- `scripts/vps-first-setup.sh` — Einmaliges VPS-Setup

---

## 10. TODO / Offene Punkte

- [ ] `src/lib/directus.ts` anlegen (SDK Client)
- [ ] `BookingWorkflow.tsx` Submit → Directus `createItem("booking_inquiries")`
- [ ] `Footer.tsx` Instagram-Posts von Directus laden (Server Component in page.tsx)
- [ ] Directus Flow für Instagram-Sync einrichten (stündlicher Cron)
- [ ] Instagram Graph API Token in Directus-Env eintragen
- [ ] `.env.prod` + `.env.directus` auf VPS befüllen
- [ ] Domain in `Caddyfile` eintragen

---

## 11. Was du NICHT tun sollst

- **Keine `tailwind.config.ts` anlegen** — v4 braucht das nicht
- **Keine neuen Fonts** — nur Syne und Manrope
- **`#deff9a` (accent) nur in AnatomyMap** — nicht als generelle Brand-Farbe
- **Kein `overflow-hidden` auf der Hero-Section entfernen** — das ist gewollt
- **Kein FAB** — wurde bewusst entfernt (Phase 3)
- **`humanbody/` nicht anfassen** — nur Referenz-Material
- **Keine `.env*` Dateien committen** — nur `.env.example` ist im Repo
