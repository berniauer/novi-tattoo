# Novi Tattoo — Projekt-Dokumentation

**Stand:** Mai 2026  
**Kunde:** Novi ([@novi._.tattoo](https://instagram.com/novi._.tattoo)), Tattoo Artist · Salzburg  
**Repo:** [github.com/berniauer/novi-tattoo](https://github.com/berniauer/novi-tattoo)

---

## Was ist das?

Eine Premium One-Page Portfolio- und Buchungs-Website für Tattoo-Artist Novi. Ziel war es, den gesamten Buchungsprozess aus Instagram-DMs herauszuholen und in einen strukturierten, hochwertigen Workflow zu überführen — gleichzeitig die Kunst angemessen zu präsentieren.

Die Site ist bewusst als **dunkles, minimalistisches Design** mit Bewegung auf hohem Niveau gebaut: keine Templates, kein WordPress, kein Page-Builder.

---

## Sektionen (von oben nach unten)

### 1. Hero
Erster Eindruck. Animierter Heading "NOVI TATTOO" mit Charakter-für-Charakter Reveal (Chars sliden aus einem unsichtbaren Clip nach oben). Parallax-Effekt beim Scrollen, animierter Scroll-Indicator.

**Desktop:** CTA-Button "Termin anfragen" innerhalb des Hero-Blocks.  
**Mobile:** Kein FAB — bewusst entfernt für cleaner UX.

---

### 2. Portfolio Gallery
Masonry-Grid (CSS Columns) mit 12 Arbeiten. Filterleiste mit 5 Kategorien:

| Filter | Inhalt |
|--------|--------|
| All | Alle Werke |
| Anime & Gaming | Pikachu, Yu-Gi-Oh etc. |
| Blackwork | Linework, Elbow-Web etc. |
| Healed | Abgeheilte Tattoos (Qualitätsbeweis) |
| Wannados | Verfügbare Flash-Designs |

Klick auf ein Bild öffnet ein Vollbild-Lightbox-Modal mit technischen Details (Stunden, Placement, Healed-Status). Keyboard-Navigation (←/→/Escape). SOLD-Stamp-Overlay für bereits vergobene Flash-Designs.

**Interaktion:** Filter-Transition mit `AnimatePresence` (ganzes Grid fadeout, gefilterte Items staggered rein). Filter-Pill bewegt sich per `layoutId` smooth zwischen den Tabs.

---

### 3. The Process
5-Schritt Timeline die den Buchungsablauf erklärt:

1. **Anfrage stellen** — Formular ausfüllen
2. **Idee verfeinern** — Konzeptgespräch
3. **Termin sichern** — Anzahlung + Datum
4. **Session** — Der eigentliche Tattoo-Termin
5. **Healed Result** — Foto nach Abheilung

Desktop: horizontale Timeline mit animierten Verbindungslinien.  
Mobile: vertikale Liste.

---

### 4. Buchungsworkflow (Smart Booking Engine)

Das Herzstück. 4-stufiges Formular das Instagram-DMs vollständig ersetzt:

#### Step 1 — Konzept
- Stil-Auswahl (6 Optionen: Anime & Gaming, Blackwork, Fine Line, Dark Art, Cover-Up, Sonstiges)
- Freitext-Beschreibung der Idee (min. 20 Zeichen)

#### Step 2 — Placement (AnatomyMap)
Interaktive 2D SVG-Körperkarte. Vorder- und Rückansicht umschaltbar. **Multi-Select:** Mehrere Körperstellen gleichzeitig wählbar (z.B. für Sessions mit mehreren Tattoos). 38 klickbare Zonen mit Lime-Green Glow-Effekt (`#deff9a`) bei Hover/Auswahl.

Darunter: Größen-Slider (5–40+ cm) mit Orientierungshilfen.

#### Step 3 — Bilder
- Drag & Drop Referenzbilder (bis zu 5)
- Pflichtfoto der Hautstelle (saubere Fläche)
- Dateivorschau mit Größenanzeige, einzeln entfernbar

#### Step 4 — Kontakt
- Name, E-Mail, Instagram-Handle (@-Prefix automatisch)
- Altersbestätigung (18+, Pflicht)

**Success State:** Animierter grüner Checkmark-Kreis, Instagram-Link, "Neue Anfrage"-Button.

**Aktuell:** Formulardaten gehen an `console.log`. **Geplant:** Directus `booking_inquiries` Collection.

---

### 5. FAQ Accordion
7 häufig gestellte Fragen mit ausführlichen deutschen Antworten. Smooth Height-Animation (AnimatePresence). Plus-Icon rotiert 45° → wird zum ×. Immer nur eine Frage gleichzeitig offen (Radio-Verhalten).

Themen: Vorbereitung, Anzahlungspolitik, Aftercare, Kosten, Cover-Up, Mindestalter, Hygiene.

---

### 6. Footer
- **Instagram-Grid:** 3×2 Raster mit den letzten 6 Posts. Aktuell Mock-Daten (Unsplash). Hover: Skalierung + Overlay + Instagram-Icon.
- **Navigation:** Portfolio, Anfragen, FAQ, @Instagram, Impressum, Datenschutz
- **Riesige Ghost-Wordmark** "NOVI" (6% Opacity, Parallax beim Scrollen)
- **Copyright** mit dynamischem Jahr

**Automatisierung geplant:** Directus Flow holt stündlich neue Posts von der Instagram Graph API und speichert sie. Footer liest dann von Directus statt Mock-Array.

---

## Globale Design-Entscheidungen

### Warum kein FAB?
Der ursprünglich geplante fixierte "Termin anfragen"-Button (Floating Action Button) am unteren Bildschirmrand wurde bewusst entfernt. Er störte die Immersion der Premium-Ästhetik. Der Booking-Workflow ist über die Section-Navigation direkt erreichbar.

### Animationsphilosophie
- Alle Animationen via Framer Motion (kein CSS Keyframes für UI)
- `useReducedMotion()` wird überall respektiert
- Char-Split-Animationen (Buchstaben sliden nach oben) nur für Haupt-Headings
- Easing durchgehend: `cubic-bezier(0.16, 1, 0.3, 1)` (Expo-Out)
- Film-Grain-Overlay (SVG fractal noise, 2.8% opacity) über der gesamten Seite

### Mobile-First
90% der Besucher kommen via Mobile. Entscheidungen:
- Filterleiste horizontal scrollbar mit versteckter Scrollbar
- Masonry-Grid: 2 Spalten mobil, 3 Spalten desktop
- Section-Title immer via `clamp()` — nie fixe px-Größen
- Wort-Wrapping: Buchstaben wrappen immer als ganzes Wort (nicht mid-word)

---

## Backend / CMS — Directus

**Status: In Planung / lokale Entwicklung**

### Warum Directus?
- Open Source, selbst gehostet → keine monatlichen SaaS-Kosten
- Admin-UI für Novi: Buchungsanfragen einsehen, Status setzen
- Flows (Automation) für Instagram-Sync — kein externer Cron-Dienst nötig
- REST + GraphQL API → einfache Next.js Integration via `@directus/sdk`

### Collections (geplant)

**`booking_inquiries`** — Eingehende Buchungsanfragen vom Formular  
**`instagram_posts`** — Automatisch von Instagram Graph API synchronisiert

### Instagram-Sync Flow
```
Directus Flow (stündlich, Cron: 0 * * * *)
  → HTTP Request: Instagram Graph API /me/media
  → Script: Posts normalisieren
  → Upsert: instagram_posts Collection
```

Der Long-Lived Token (60 Tage) wird automatisch monatlich von einem zweiten Flow refresht.

---

## Deployment

### Architektur (VPS)
```
Internet → Caddy (HTTPS, Reverse Proxy)
              ├── novi-tattoo:3000  (Next.js Docker Container)
              └── cms.*:8055        (Directus Docker Container)

VPS Netzwerk-Zugang: Tailscale (kein öffentlicher SSH-Port)
```

### CI/CD Pipeline
```
git push origin main
  → GitHub Actions
  → Docker Build (Multi-Stage, Next.js standalone)
  → Push zu GHCR (ghcr.io/berniauer/novi-tattoo:latest)
  → Tailscale OAuth → SSH in VPS
  → docker compose pull + up --force-recreate
  → docker image prune
```

### Infra-Dateien
| Datei | Zweck |
|-------|-------|
| `Dockerfile` | Multi-Stage Build, standalone output |
| `docker-compose.yml` | Lokal: Directus (SQLite) |
| `docker-compose.prod.yml` | VPS: Next.js + Directus + Caddy |
| `.github/workflows/deploy.yml` | CI/CD Pipeline |
| `scripts/vps-first-setup.sh` | Einmaliges VPS-Setup |
| `.env.example` | Vorlage für alle Env-Dateien |

---

## Offene Punkte / Roadmap

### Kurzfristig (nächste Session)
- [ ] Directus lokal starten (`docker compose up -d`) + Collections anlegen
- [ ] `src/lib/directus.ts` — SDK Client
- [ ] Buchungsformular Submit → Directus schreiben
- [ ] Instagram Graph API Token bei Meta beantragen

### Mittelfristig
- [ ] Instagram-Sync Flow in Directus konfigurieren
- [ ] Footer-Posts von Directus laden (Server Component)
- [ ] E-Mail-Benachrichtigung bei neuer Buchung (Directus Notifications Flow)
- [ ] `.env.prod` + VPS-Stack deployen

### Langfristig
- [ ] Echte Portfolio-Bilder (WebP/AVIF) von Novi einpflegen
- [ ] Impressum + Datenschutz Seiten anlegen (`/impressum`, `/datenschutz`)
- [ ] Lighthouse Score > 90 auf Mobile verifizieren
- [ ] Instagram Feed Live-Daten statt Mock
