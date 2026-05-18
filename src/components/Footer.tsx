"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
/**
 * Shape intentionally mirrors Instagram Graph API fields so swapping
 * placeholders for real data is a one-liner in the fetch call:
 *
 *   const posts = data.map(({ id, media_url, permalink, caption }) => ({
 *     id, imageUrl: media_url, permalink, caption,
 *   }));
 */
interface InstagramPost {
  id:        string;
  imageUrl:  string;
  permalink: string;
  caption:   string;
  alt:       string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
// TODO: Replace with live Instagram Graph API fetch
// Endpoint: GET https://graph.instagram.com/me/media
//   ?fields=id,caption,media_url,permalink,thumbnail_url,media_type
//   &access_token={INSTAGRAM_ACCESS_TOKEN}
// Then map to InstagramPost[] as shown above.
// ─────────────────────────────────────────────────────────────────────────────
const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id:       "mock_01",
    imageUrl: "https://images.unsplash.com/photo-1590246815117-83e4ebb6dcb2?w=600&h=600&fit=crop&q=80",
    permalink:"https://instagram.com/novi._.tattoo",
    caption:  "Full sleeve session — anime characters on dark skin 🖤",
    alt:      "Dark sleeve tattoo",
  },
  {
    id:       "mock_02",
    imageUrl: "https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=600&h=600&fit=crop&q=80",
    permalink:"https://instagram.com/novi._.tattoo",
    caption:  "Blackwork elbow spider web. Healed shot 🕷️",
    alt:      "Blackwork elbow tattoo",
  },
  {
    id:       "mock_03",
    imageUrl: "https://images.unsplash.com/photo-1541512416146-3cf58d6b27cc?w=600&h=600&fit=crop&q=80",
    permalink:"https://instagram.com/novi._.tattoo",
    caption:  "Pikachu fine line — always a vibe ⚡",
    alt:      "Anime fine line tattoo",
  },
  {
    id:       "mock_04",
    imageUrl: "https://images.unsplash.com/photo-1573966897543-8ded11971bf0?w=600&h=600&fit=crop&q=80",
    permalink:"https://instagram.com/novi._.tattoo",
    caption:  "Dark art — ribcage piece, 6h session 🩸",
    alt:      "Dark art ribcage tattoo",
  },
  {
    id:       "mock_05",
    imageUrl: "https://images.unsplash.com/photo-1578301978069-3c2e7fc2a360?w=600&h=600&fit=crop&q=80",
    permalink:"https://instagram.com/novi._.tattoo",
    caption:  "Yu-Gi-Oh Exodia back piece — freshly done",
    alt:      "Anime back piece tattoo",
  },
  {
    id:       "mock_06",
    imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&h=600&fit=crop&q=80",
    permalink:"https://instagram.com/novi._.tattoo",
    caption:  "Cover-up transformation — before & after this week",
    alt:      "Tattoo cover-up",
  },
];

// ─── Nav links ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Portfolio",   href: "#portfolio" },
  { label: "Anfragen",    href: "#booking"   },
  { label: "FAQ",         href: "#faq"        },
] as const;

const LEGAL_LINKS = [
  { label: "Impressum",   href: "/impressum"   },
  { label: "Datenschutz", href: "/datenschutz" },
] as const;

// ─── Constants ────────────────────────────────────────────────────────────────
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
const INSTAGRAM_URL = "https://instagram.com/novi._.tattoo";

// ─── Instagram icon (inline SVG) ─────────────────────────────────────────────
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

// ─── Post Card ───────────────────────────────────────────────────────────────
function PostCard({ post, index }: { post: InstagramPost; index: number }) {
  return (
    <motion.a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden bg-surface-2"
      style={{ aspectRatio: "1" }}
      aria-label={`Instagram post: ${post.alt}`}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: 0.05 * index, duration: 0.55, ease: EASE_EXPO }}
    >
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.imageUrl}
        alt={post.alt}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/55" />

      {/* Instagram icon — fades in on hover */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <InstagramIcon className="text-white/90 drop-shadow-lg" />
        <span className="font-body text-[9px] tracking-[0.22em] text-white/70 uppercase">
          Ansehen
        </span>
      </div>

      {/* Corner accent line — subtle */}
      <div className="pointer-events-none absolute inset-0 border border-white/0 transition-colors duration-300 group-hover:border-white/10" />
    </motion.a>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  // Subtle parallax on the brand wordmark
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ["24px", "0px"]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  const year = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="relative bg-surface overflow-hidden"
      aria-label="Footer"
    >
      {/* ── Hairline top border ───────────────────────────────────────────── */}
      <div className="h-px bg-border/60" />

      {/* ── Instagram grid section ───────────────────────────────────────── */}
      <section
        className="px-4 pt-16 pb-12 md:px-8 lg:px-16"
        aria-label="Aktuelle Arbeiten auf Instagram"
      >
        <div className="max-w-screen-xl mx-auto">

          {/* Section label */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          >
            <div>
              <p className="font-body text-[9px] tracking-[0.3em] text-muted uppercase mb-1">
                Aktuelle Arbeiten
              </p>
              <h2 className="font-display font-black text-white text-xl md:text-2xl tracking-tight">
                @novi._.tattoo
              </h2>
            </div>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group hidden sm:flex items-center gap-2 border border-border rounded-full px-5 py-2.5 font-body text-[11px] tracking-[0.14em] text-ghost uppercase hover:border-white/30 hover:text-white transition-all duration-200"
              aria-label="Auf Instagram folgen"
            >
              <InstagramIcon />
              Folgen
            </a>
          </motion.div>

          {/* Grid — 3 columns × 2 rows */}
          <div className="grid grid-cols-3 gap-[3px] md:gap-[4px]">
            {INSTAGRAM_POSTS.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>

          {/* Mobile follow CTA */}
          <motion.div
            className="mt-6 flex justify-center sm:hidden"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.55, ease: EASE_EXPO }}
          >
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-border rounded-full px-6 py-2.5 font-body text-[11px] tracking-[0.14em] text-ghost uppercase hover:border-white/30 hover:text-white transition-all duration-200"
            >
              <InstagramIcon />
              Auf Instagram folgen
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Main footer bar ───────────────────────────────────────────────── */}
      <div className="h-px bg-border/40 mx-4 md:mx-8 lg:mx-16" />

      <div className="px-4 py-12 md:px-8 lg:px-16">
        <div className="max-w-screen-xl mx-auto">

          {/* Large wordmark — parallax */}
          <motion.div
            className="mb-12 md:mb-16"
            style={{ y: wordmarkY, opacity: wordmarkOpacity }}
          >
            <p
              className="font-display font-black leading-none tracking-[-0.03em] text-white/[0.06] select-none"
              style={{ fontSize: "clamp(4rem, 18vw, 14rem)" }}
              aria-hidden="true"
            >
              NOVI
            </p>
          </motion.div>

          {/* Bottom bar */}
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

            {/* Left — brand + tagline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
            >
              <p className="font-display font-black text-white text-lg tracking-[-0.01em]">
                NOVI TATTOO
              </p>
              <p className="font-body text-[11px] text-muted mt-1 tracking-[0.08em]">
                Pop-Culture · Anime · Dark Art · Salzburg
              </p>
            </motion.div>

            {/* Right — nav + legal */}
            <motion.div
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: EASE_EXPO }}
            >
              {/* Page nav */}
              <nav aria-label="Footer-Navigation">
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {NAV_LINKS.map(({ label, href }) => (
                    <li key={href}>
                      <a
                        href={href}
                        className="font-body text-[11px] tracking-[0.14em] text-muted uppercase hover:text-white transition-colors duration-200"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-[11px] tracking-[0.14em] text-muted uppercase hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5"
                    >
                      <InstagramIcon className="w-3 h-3" />
                      Instagram
                    </a>
                  </li>
                </ul>
              </nav>

              {/* Divider */}
              <div className="hidden sm:block h-4 w-px bg-border" aria-hidden="true" />

              {/* Legal */}
              <nav aria-label="Rechtliches">
                <ul className="flex gap-5">
                  {LEGAL_LINKS.map(({ label, href }) => (
                    <li key={href}>
                      <a
                        href={href}
                        className="font-body text-[11px] tracking-[0.12em] text-muted/60 uppercase hover:text-muted transition-colors duration-200"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.p
            className="mt-10 font-body text-[10px] text-muted/40 tracking-[0.08em]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.7 }}
          >
            © {year} Novi Tattoo · Salzburg · All rights reserved
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
