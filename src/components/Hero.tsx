"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────
const WORDS = ["NOVI", "TATTOO"] as const;
const SUBTEXT = "Pop-Culture · Anime · Dark Art Specialist";
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

// ─── Variants ─────────────────────────────────────────────────────────────────
const headingContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.042,
      delayChildren: 0.22,
    },
  },
};

const charReveal: Variants = {
  hidden: { y: "108%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.78,
      ease: EASE_EXPO,
    },
  },
};

const subtextReveal: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 1.05,
      duration: 0.9,
      ease: EASE_EXPO,
    },
  },
};

const lineReveal: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      delay: 0.95,
      duration: 1.1,
      ease: EASE_EXPO,
    },
  },
};

const scrollDotBounce = {
  animate: {
    y: [0, 9, 0],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Track hero section scroll progress for fade-out effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scrollIndicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.18],
    [1, 0]
  );
  const heroContentY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-ink"
      aria-label="Hero"
    >
      {/* ── Radial spotlight glow ─────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255,255,255,0.03) 0%, transparent 75%)",
        }}
      />

      {/* ── Corner hairlines (decorative grid) ───────────────────────── */}
      <div
        className="pointer-events-none absolute inset-6 md:inset-10"
        aria-hidden="true"
      >
        {[
          "top-0 left-0 border-t border-l",
          "top-0 right-0 border-t border-r",
          "bottom-0 left-0 border-b border-l",
          "bottom-0 right-0 border-b border-r",
        ].map((cls, i) => (
          <motion.div
            key={i}
            className={`absolute h-5 w-5 border-border/40 ${cls}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.6 }}
          />
        ))}
      </div>

      {/* ── Main content (parallax on scroll) ────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        style={
          prefersReducedMotion
            ? {}
            : { y: heroContentY, opacity: heroOpacity }
        }
      >
        {/* Eyebrow label */}
        <motion.span
          className="mb-8 inline-block rounded-full border border-border/60 px-4 py-1.5 font-body text-[10px] tracking-[0.3em] text-ghost uppercase"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE_EXPO }}
        >
          Tattoo Artist · Salzburg
        </motion.span>

        {/* ── Heading: character-split reveal ───────────────────────── */}
        <motion.div
          className="flex flex-wrap justify-center gap-x-[0.22em] w-full"
          variants={headingContainer}
          initial="hidden"
          animate="visible"
          aria-label="NOVI TATTOO"
        >
          {WORDS.map((word) => (
            <div key={word} className="flex shrink-0">
              {word.split("").map((char, ci) => (
                /* overflow-hidden clip container — chars slide UP from behind */
                <span key={ci} className="inline-block overflow-hidden">
                  <motion.span
                    className="inline-block font-display font-black leading-none tracking-[-0.02em] text-white"
                    style={{
                      fontSize: "clamp(2.2rem, 13.5vw, 11.5rem)",
                    }}
                    variants={
                      prefersReducedMotion
                        ? {}
                        : charReveal
                    }
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>

        {/* Thin separator line */}
        <motion.div
          className="my-7 h-px w-24 origin-left bg-white/20"
          variants={lineReveal}
          initial="hidden"
          animate="visible"
        />

        {/* Subtext */}
        <motion.p
          className="font-body text-[clamp(0.7rem,2.2vw,0.9rem)] tracking-[0.28em] text-ghost uppercase"
          variants={subtextReveal}
          initial="hidden"
          animate="visible"
        >
          {SUBTEXT}
        </motion.p>

        {/* Desktop CTA */}
        <motion.div
          className="mt-12 hidden md:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease: EASE_EXPO }}
        >
          <button
            className="group relative overflow-hidden rounded-full border border-white/20 bg-white/5 px-8 py-3.5 font-body text-sm font-medium tracking-[0.12em] text-white uppercase backdrop-blur-sm transition-colors duration-300 hover:border-white/40 hover:bg-white/10 cursor-pointer"
            aria-label="Termin anfragen"
          >
            <span className="relative z-10">Termin anfragen</span>
            {/* Hover fill sweep */}
            <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 ease-out group-hover:translate-x-0" />
          </button>
        </motion.div>
      </motion.div>

      {/* ── Scroll Indicator ─────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ opacity: scrollIndicatorOpacity }}
        aria-hidden="true"
      >
        {/* Animated scrolling line */}
        <div className="relative h-10 w-px overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="absolute top-0 h-1/2 w-full rounded-full bg-white/60"
            animate={{ y: ["-100%", "200%"] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.4,
            }}
          />
        </div>
        {/* Bouncing chevron */}
        <motion.div {...scrollDotBounce}>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-muted"
          >
            <path
              d="M1 1L6 6L11 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>

    </section>
  );
}
