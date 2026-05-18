"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import SectionTitle from "./SectionTitle";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const SendIcon: Step["icon"] = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);

const IdeaIcon: Step["icon"] = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18h6M10 22h4M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17h8v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7z" />
  </svg>
);

const CalendarIcon: Step["icon"] = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
  </svg>
);

const NeedleIcon: Step["icon"] = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2v10M12 12l-4 8M12 12l4 8M6 7h12M5 4h14" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const SparkleIcon: Step["icon"] = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
  </svg>
);

// ─── Steps Data ───────────────────────────────────────────────────────────────
const STEPS: Step[] = [
  {
    number: "01",
    title: "Anfrage stellen",
    description: "Fülle das Booking-Formular aus: Stil, Größe, Placement & Referenzbilder. Kein DM-Chaos mehr.",
    icon: SendIcon,
  },
  {
    number: "02",
    title: "Konzept & Feedback",
    description: "Ich melde mich innerhalb von 48 h mit einem ersten Konzept-Entwurf oder gezielten Rückfragen.",
    icon: IdeaIcon,
  },
  {
    number: "03",
    title: "Termin & Anzahlung",
    description: "Wir fixieren Datum und Uhrzeit. Eine kleine Anzahlung sichert deinen Slot verbindlich.",
    icon: CalendarIcon,
  },
  {
    number: "04",
    title: "Die Session",
    description: "Komm ausgeschlafen & gut gegessen. Ich sorge für Musik, Atmosphäre und ein sauberes Ergebnis.",
    icon: NeedleIcon,
  },
  {
    number: "05",
    title: "Healed & Happy",
    description: "Schick mir nach dem Heilen ein Foto. Das beste Ergebnis — und der erste Blick auf deine neue Haut.",
    icon: SparkleIcon,
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const stepCard: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.1 + i * 0.12,
      duration: 0.65,
      ease: EASE_EXPO,
    },
  }),
};

const iconAnim: Variants = {
  hidden: { scale: 0.5, opacity: 0, rotate: -15 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      delay: 0.3 + i * 0.12,
      type: "spring",
      damping: 14,
      stiffness: 220,
    },
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="relative bg-surface py-24 md:py-32 px-4 md:px-8 lg:px-16 overflow-hidden"
      id="process"
      aria-label="The Process"
    >
      {/* Subtle dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-screen-xl mx-auto">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.span
          className="block text-[9px] font-semibold tracking-[0.35em] text-ghost uppercase mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_EXPO }}
        >
          Von der Idee zur Haut
        </motion.span>

        <SectionTitle
          className="font-display font-black text-white leading-none tracking-tight mb-5"
          style={{ fontSize: "clamp(2.8rem,9vw,7rem)" }}
        >
          The Process
        </SectionTitle>

        <motion.p
          className="max-w-lg font-body text-ghost text-sm leading-relaxed mb-16 md:mb-20"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.7, ease: EASE_EXPO }}
        >
          Fünf klare Schritte — vom ersten Gedanken bis zum stolzen Healed-Foto.
          Transparent, persönlich, professionell.
        </motion.p>

        {/* ── Desktop timeline connector line ──────────────────────── */}
        <div className="hidden md:block relative mb-0">
          <div className="absolute top-[52px] left-[calc(10%+24px)] right-[calc(10%+24px)] h-px bg-border" />
          <motion.div
            className="absolute top-[52px] left-[calc(10%+24px)] right-[calc(10%+24px)] h-px bg-white/30 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: inView ? 1 : 0 }}
            transition={{ delay: 0.6, duration: 1.2, ease: EASE_EXPO }}
          />
        </div>

        {/* ── Steps grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className="relative flex flex-col"
                variants={stepCard}
                custom={i}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                {/* Mobile: vertical connector line */}
                {i < STEPS.length - 1 && (
                  <div className="md:hidden absolute left-[27px] top-[60px] w-px h-[calc(100%+24px)] bg-border" aria-hidden="true" />
                )}

                {/* Mobile layout: row; Desktop: column */}
                <div className="flex md:flex-col items-start md:items-start gap-4 md:gap-0">
                  {/* Icon circle */}
                  <motion.div
                    className="relative z-10 shrink-0 w-14 h-14 rounded-full border border-border bg-surface-2 flex items-center justify-center"
                    variants={iconAnim}
                    custom={i}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  >
                    <Icon className="w-5 h-5 text-white/80" />
                  </motion.div>

                  {/* Number + text */}
                  <div className="md:mt-6 flex-1">
                    <span className="block font-display font-black text-[10px] tracking-[0.3em] text-muted uppercase mb-2">
                      {step.number}
                    </span>
                    <h3 className="font-display font-bold text-white text-[15px] leading-snug mb-2">
                      {step.title}
                    </h3>
                    <p className="font-body text-ghost text-[12px] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────── */}
        <motion.div
          className="mt-16 md:mt-20 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7, ease: EASE_EXPO }}
        >
          <a
            href="#booking"
            className="inline-flex items-center gap-3 bg-white text-ink font-display font-bold text-[12px] tracking-[0.14em] uppercase px-8 py-4 rounded-full hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer shadow-[0_4px_30px_rgba(255,255,255,0.1)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Jetzt Termin anfragen
          </a>
          <span className="text-muted text-[11px] tracking-wider">
            Kostenlos · Unverbindlich · 48 h Response
          </span>
        </motion.div>
      </div>
    </section>
  );
}
