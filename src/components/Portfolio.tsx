"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import SectionTitle from "./SectionTitle";

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterKey = "all" | "anime" | "blackwork" | "healed" | "wannados";

interface WorkItem {
  id: string;
  title: string;
  category: Exclude<FilterKey, "all">;
  /** CSS aspect-ratio value, e.g. "3/4" */
  ratio: string;
  /** Fallback gradient shown while image loads */
  bg: string;
  /** Path relative to /public, e.g. "/portfolio/images/foo.jpg" */
  img?: string;
  details: {
    style: string;
    placement: string;
    duration?: string;
    healed?: boolean;
    available?: boolean;
    price?: string;
  };
}

// ─── Filter Config ────────────────────────────────────────────────────────────
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",       label: "Alle"           },
  { key: "anime",     label: "Anime & Gaming"  },
  { key: "blackwork", label: "Blackwork"       },
  { key: "healed",    label: "Healed"          },
  { key: "wannados",  label: "Wannados"        },
];

// ─── Portfolio Data ───────────────────────────────────────────────────────────
const WORKS: WorkItem[] = [
  {
    id: "p1", title: "Pikachu x Naruto", category: "anime", ratio: "1/1",
    bg: "linear-gradient(160deg,#1a1a1a 0%,#0b0b0b 100%)",
    img: "/portfolio/images/instagram_DPbgXQdDGy5.jpg",
    details: { style: "Fine Line Blackwork", placement: "Ankle", duration: "3 h" },
  },
  {
    id: "p2", title: "Sea Turtle", category: "blackwork", ratio: "3/4",
    bg: "linear-gradient(160deg,#1c1c1e 0%,#0b0b0b 100%)",
    img: "/portfolio/images/instagram_DPMpZu0je6f.jpg",
    details: { style: "Fine Line Colour", placement: "Calf", duration: "2.5 h" },
  },
  {
    id: "p3", title: "Dark Warrior", category: "blackwork", ratio: "2/3",
    bg: "linear-gradient(160deg,#1a0707 0%,#0b0b0b 100%)",
    img: "/portfolio/images/instagram_DRIBjuJjcLu.jpg",
    details: { style: "Blackwork & Colour Splash", placement: "Shin", duration: "5 h" },
  },
  {
    id: "p4", title: "To Infinity & Beyond", category: "blackwork", ratio: "4/3",
    bg: "linear-gradient(160deg,#1c1c1e 0%,#0b0b0b 100%)",
    img: "/portfolio/images/instagram_DSMzUdDDcP7.jpg",
    details: { style: "Fine Line", placement: "Forearm", duration: "2 × 1.5 h" },
  },
  {
    id: "p5", title: "Streetwear Goofy", category: "anime", ratio: "2/3",
    bg: "linear-gradient(160deg,#1a1a1a 0%,#0b0b0b 100%)",
    img: "/portfolio/images/instagram_DULY40WDFjf.jpg",
    details: { style: "Cartoon Blackwork", placement: "Calf", duration: "3 h" },
  },
  {
    id: "p6", title: "Elbow Web & Eye", category: "blackwork", ratio: "3/4",
    bg: "linear-gradient(160deg,#1c1c1e 0%,#0b0b0b 100%)",
    img: "/portfolio/images/626469548_17993369042918190_7098819892745678448_n.jpg",
    details: { style: "Geometric Blackwork", placement: "Elbow / Forearm", duration: "3 h" },
  },
  {
    id: "p7", title: "Sleeve Build-Up", category: "blackwork", ratio: "9/16",
    bg: "linear-gradient(160deg,#1a1a1a 0%,#0b0b0b 100%)",
    img: "/portfolio/images/626506982_17993369051918190_281928875297933195_n.jpg",
    details: { style: "Mixed Blackwork", placement: "Full Sleeve", duration: "12 h total" },
  },
  {
    id: "p8", title: "Pot of Greed (Yu-Gi-Oh)", category: "anime", ratio: "3/4",
    bg: "linear-gradient(160deg,#1a1a1a 0%,#0b0b0b 100%)",
    img: "/portfolio/images/653400522_17998586258918190_8720868515094678221_n.jpg",
    details: { style: "Fine Line Blackwork", placement: "Arm", duration: "2 h" },
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const gridWrap: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12 },
  },
};

const cardAnim: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.55,
      ease: EASE_EXPO,
    },
  }),
};

const lightboxOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit:   { opacity: 0, transition: { duration: 0.2  } },
};

const lightboxPanel: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", damping: 26, stiffness: 320 },
  },
  exit: {
    opacity: 0, scale: 0.94, y: 12,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

// ─── Subcomponents ────────────────────────────────────────────────────────────
function GridPattern({ id }: { id: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={`g-${id}`}
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 22 0 L 0 0 0 22"
            fill="none"
            stroke="white"
            strokeWidth="0.4"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#g-${id})`} opacity="0.06" />
    </svg>
  );
}

function WorkCard({
  work,
  index,
  onOpen,
}: {
  work: WorkItem;
  index: number;
  onOpen: (w: WorkItem) => void;
}) {
  return (
    <motion.div
      className="break-inside-avoid mb-2 md:mb-2.5"
      variants={cardAnim}
      custom={index}
    >
      <motion.button
        className="relative w-full overflow-hidden rounded-[3px] cursor-pointer group block text-left"
        style={{ aspectRatio: work.ratio }}
        onClick={() => onOpen(work)}
        whileHover={{ scale: 1.016 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        aria-label={`${work.title} öffnen`}
      >
        {/* Background: real photo or gradient fallback */}
        <div className="absolute inset-0" style={{ background: work.bg }} />
        {work.img ? (
          <Image
            src={work.img}
            alt={work.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <GridPattern id={work.id} />
        )}

        {/* Wannados badge */}
        {work.category === "wannados" && (
          work.details.available ? (
            <span className="absolute top-3 right-3 z-10 bg-black/60 border border-emerald-500/60 text-emerald-400 px-2.5 py-[3px] text-[8px] font-bold tracking-[0.22em] uppercase rounded-full backdrop-blur-sm">
              Available
            </span>
          ) : (
            <motion.span
              className="absolute top-4 right-3 z-10 border border-red-500/80 text-red-400 px-2 py-[2px] text-[8px] font-black tracking-[0.2em] uppercase"
              style={{ rotate: -12 }}
              initial={{ scale: 0, rotate: -25 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{ type: "spring", damping: 12, stiffness: 260, delay: 0.4 }}
            >
              SOLD
            </motion.span>
          )
        )}

        {/* Healed badge */}
        {work.details.healed && (
          <span className="absolute top-3 left-3 z-10 bg-black/50 border border-white/25 text-white/60 px-2.5 py-[3px] text-[8px] font-medium tracking-[0.18em] uppercase rounded-full backdrop-blur-sm">
            Healed ✓
          </span>
        )}

        {/* Mobile: always-visible bottom strip (no hover on touch) */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-3 py-2.5">
          <p className="font-display font-bold text-white text-[11px] leading-tight truncate">
            {work.title}
          </p>
          {work.details.duration && (
            <p className="text-white/45 text-[9px] mt-0.5">{work.details.duration}</p>
          )}
          {work.details.price && (
            <p className="text-white/70 text-[9px] mt-0.5 font-semibold">{work.details.price}</p>
          )}
        </div>

        {/* Desktop: hover overlay slides in from bottom */}
        <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex-col justify-end p-4">
          <p className="font-display font-bold text-white text-[13px] leading-snug">
            {work.title}
          </p>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-white/50 text-[10px] tracking-wider uppercase">
              {work.details.style}
            </span>
            <span className="text-white/70 text-[10px]">
              {work.details.duration ?? work.details.price}
            </span>
          </div>
          <p className="text-white/40 text-[10px] mt-0.5 tracking-wide">
            {work.details.placement}
          </p>
        </div>
      </motion.button>
    </motion.div>
  );
}

function Lightbox({
  work,
  allWorks,
  onClose,
}: {
  work: WorkItem;
  allWorks: WorkItem[];
  onClose: () => void;
}) {
  const currentIndex = allWorks.findIndex((w) => w.id === work.id);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      const next = allWorks[(currentIndex + dir + allWorks.length) % allWorks.length];
      // Trigger parent to change selected work — we use a ref trick via onClose + reopen
      // Instead, lift state to parent. See Portfolio component for nav handler.
      void next; // handled by parent
    },
    [currentIndex, allWorks]
  );

  // Suppress unused warning — navigation handled by parent via keyboard
  void navigate;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md"
      variants={lightboxOverlay}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
    >
      <motion.div
        className="relative w-full max-w-3xl bg-surface rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl"
        variants={lightboxPanel}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors cursor-pointer"
          aria-label="Schließen"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Image area */}
        <div
          className="relative w-full md:w-[45%] shrink-0 overflow-hidden"
          style={{
            aspectRatio: work.ratio,
            background: work.bg,
            minHeight: "260px",
            maxHeight: "520px",
          }}
        >
          {work.img ? (
            <Image
              src={work.img}
              alt={work.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority
            />
          ) : (
            <GridPattern id={`lb-${work.id}`} />
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between p-7 md:p-8 gap-6">
          <div>
            <span className="text-[9px] font-bold tracking-[0.28em] text-ghost uppercase">
              {work.category.replace("wannados","Wannado")}
            </span>
            <h2 className="font-display font-black text-white text-2xl md:text-3xl mt-2 leading-tight">
              {work.title}
            </h2>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: "Style",       value: work.details.style      },
              { label: "Placement",   value: work.details.placement   },
              ...(work.details.duration ? [{ label: "Duration", value: work.details.duration }] : []),
              ...(work.details.price    ? [{ label: "Preis",    value: work.details.price    }] : []),
              ...(work.details.healed   ? [{ label: "Status",   value: "✓ Healed"            }] : []),
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-[9px] font-semibold tracking-[0.22em] text-muted uppercase mb-1">
                  {label}
                </dt>
                <dd className="text-white/85 text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          {/* CTA */}
          {work.category === "wannados" && work.details.available && (
            <button className="w-full rounded-full bg-white text-ink font-display font-bold text-[12px] tracking-[0.14em] uppercase py-3.5 hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer">
              Diesen Flash buchen
            </button>
          )}
          {work.category !== "wannados" && (
            <button className="w-full rounded-full border border-white/20 text-white font-display font-bold text-[12px] tracking-[0.14em] uppercase py-3.5 hover:bg-white/8 active:scale-[0.98] transition-all cursor-pointer">
              Ähnliches anfragen
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);

  const filteredWorks =
    activeFilter === "all"
      ? WORKS
      : WORKS.filter((w) => w.category === activeFilter);

  // Keyboard navigation inside lightbox
  useEffect(() => {
    if (!selectedWork) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedWork(null);
      } else if (e.key === "ArrowRight") {
        const i = filteredWorks.findIndex((w) => w.id === selectedWork.id);
        setSelectedWork(filteredWorks[(i + 1) % filteredWorks.length]);
      } else if (e.key === "ArrowLeft") {
        const i = filteredWorks.findIndex((w) => w.id === selectedWork.id);
        setSelectedWork(
          filteredWorks[(i - 1 + filteredWorks.length) % filteredWorks.length]
        );
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedWork, filteredWorks]);

  return (
    <section
      className="relative bg-ink py-24 md:py-32 px-4 md:px-8 lg:px-16"
      id="portfolio"
      aria-label="Portfolio"
    >
      {/* ── Section header ─────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto mb-12 md:mb-16">
        <motion.span
          className="block text-[9px] font-semibold tracking-[0.35em] text-ghost uppercase mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Ausgewählte Arbeiten
        </motion.span>

        <SectionTitle className="font-display font-black text-white leading-none tracking-tight" style={{ fontSize: "clamp(2.8rem,9vw,7rem)" }}>
          Portfolio
        </SectionTitle>

        {/* ── Filter bar — horizontal scroll on mobile ─────────────── */}
        <motion.div
          className="flex overflow-x-auto no-scrollbar gap-2 mt-10 pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {FILTERS.map((f) => (
            <motion.button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`relative shrink-0 px-5 py-2.5 rounded-full text-[11px] font-bold tracking-[0.12em] uppercase transition-colors duration-200 cursor-pointer ${
                activeFilter === f.key
                  ? "text-ink"
                  : "text-ghost hover:text-white border border-border hover:border-white/30"
              }`}
              whileTap={{ scale: 0.96 }}
              aria-pressed={activeFilter === f.key}
            >
              {activeFilter === f.key && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", damping: 22, stiffness: 320 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* ── Masonry grid ───────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="columns-2 md:columns-3 gap-2 md:gap-2.5"
            variants={gridWrap}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {filteredWorks.map((work, i) => (
              <WorkCard
                key={work.id}
                work={work}
                index={i}
                onOpen={setSelectedWork}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Lightbox ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedWork && (
          <Lightbox
            work={selectedWork}
            allWorks={filteredWorks}
            onClose={() => setSelectedWork(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
