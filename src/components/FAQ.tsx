"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "./SectionTitle";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FAQItem {
  id:       string;
  question: string;
  answer:   string;
}

// ─── Content ──────────────────────────────────────────────────────────────────
const FAQ_ITEMS: FAQItem[] = [
  {
    id: "preparation",
    question: "Wie bereite ich mich auf meinen Termin vor?",
    answer:
      "Schlaf die Nacht vorher gut und iss mindestens 2 Stunden vor dem Termin eine ordentliche Mahlzeit — ein niedriger Blutzucker ist der häufigste Grund für Kreislaufprobleme auf dem Stuhl. Verzichte 24 Stunden vorher auf Alkohol und Blutverdünner (Aspirin, Ibuprofen). Komm mit frisch geduscht und rasierter Haut, trage bequeme Kleidung mit leichtem Zugang zur Stelle — niemand will eine Skinny Jeans über eine frische Wade zerren.",
  },
  {
    id: "deposit",
    question: "Wie funktioniert die Anzahlungspolitik?",
    answer:
      "Nach meiner Zusage wird eine Anzahlung von 50–150 € fällig (je nach Projektgröße). Sie wird beim Termin vollständig vom Endpreis abgezogen. Bei Absage oder Terminverschiebung mit weniger als 48 Stunden Vorankündigung verfällt die Anzahlung — ohne Ausnahme. Das schützt meine Zeit und deinen Slot. Umbuchungen mit ausreichend Vorlauf sind kein Problem, solange sie nicht zur Gewohnheit werden.",
  },
  {
    id: "aftercare",
    question: "Wie pflege ich mein frisches Tattoo?",
    answer:
      "Nach 2–4 Stunden Folie abziehen, die Stelle vorsichtig mit lauwarmem Wasser und einem pH-neutralen, parfümfreien Seife waschen, leicht abtupfen (nicht reiben). Danach dünn mit Bepanthen oder Hustle Butter eincremen — wirklich dünn, kein Schmierfilm. Die ersten 2 Wochen: keine direkte Sonne, kein Schwimmbad, keine Sauna und auf keinen Fall kratzen oder Krusten abpulen. Nach 3 Wochen high-SPF Sonnenschutz, so oft die Sonne scheint, für mindestens 6 Monate.",
  },
  {
    id: "pricing",
    question: "Was kostet ein Tattoo bei Novi?",
    answer:
      "Der Preis richtet sich nach Größe, Komplexität, Placement und Arbeitszeit. Kleine, eigenständige Pieces starten bei 150 €. Größere Arbeiten und Sleeves werden nach Stundensatz berechnet (80–120 €/h). Nach deiner Anfrage und dem Briefing-Gespräch bekommst du einen konkreten Kostenrahmen — keine vagen \"Komm einfach vorbei\"-Antworten.",
  },
  {
    id: "coverup",
    question: "Können alte Tattoos übertätowiert werden (Cover-Up)?",
    answer:
      "Ja — Cover-Ups gehören zu meinen Spezialgebieten. Wichtig ist ein unbearbeitetes Foto des bestehenden Tattoos bei deiner Anfrage, idealerweise bei Tageslicht ohne Filter. Cover-Ups erfordern meist ein größeres und kontrastreicheres Design als das Original. Wie viel möglich ist, hängt von Alter, Tiefe und Farbe der alten Tinte ab — ich bin da ehrlich, auch wenn's nicht das ist, was man hören will.",
  },
  {
    id: "age",
    question: "Ab welchem Alter werde ich tätowiert?",
    answer:
      "Das Mindestalter ist 18 Jahre — ohne Ausnahmen und ohne elterliche Einwilligung. Das ist eine gesetzliche Anforderung und eine persönliche Grundsatzentscheidung. Wer sich nicht ausweisen kann, wird nicht tätowiert. Kein Drama, einfach warten und in der Zwischenzeit das Motiv noch 100x überdenken.",
  },
  {
    id: "hygiene",
    question: "Welche Hygienestandards gelten im Studio?",
    answer:
      "Jede Nadel, jede Tinte, jede Flasche wird genau einmal verwendet und danach entsorgt. Alle wiederverwendbaren Teile werden autoklaviert. Arbeitsflächen werden vor jedem Kunden desinfiziert und foliert. Wenn irgendetwas nicht steril wirkt, stop — sag es sofort. Mein Ruf hängt davon ab, dass jeder Kunde gesund nach Hause geht.",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

// ─── AccordionItem ────────────────────────────────────────────────────────────
function AccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item:     FAQItem;
  isOpen:   boolean;
  onToggle: () => void;
  index:    number;
}) {
  return (
    <motion.div
      className="border-b border-border/60 last:border-b-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: 0.05 * index, duration: 0.55, ease: EASE_EXPO }}
    >
      {/* ── Trigger ─────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-start justify-between gap-6 py-6 text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        {/* Question text */}
        <span
          className={`font-body text-[15px] font-semibold leading-snug transition-colors duration-200 ${
            isOpen ? "text-white" : "text-ghost group-hover:text-white"
          }`}
        >
          {item.question}
        </span>

        {/* Animated icon — plus rotates 45° → becomes × */}
        <motion.span
          className="shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-border/60 text-muted group-hover:border-white/20 group-hover:text-ghost transition-colors duration-200"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.28, ease: EASE_EXPO }}
          aria-hidden="true"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Horizontal bar */}
            <line
              x1="1"
              y1="5.5"
              x2="10"
              y2="5.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Vertical bar */}
            <motion.line
              x1="5.5"
              y1="1"
              x2="5.5"
              y2="10"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              animate={{ opacity: isOpen ? 0.3 : 1 }}
              transition={{ duration: 0.2 }}
            />
          </svg>
        </motion.span>
      </button>

      {/* ── Answer ──────────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height:  { duration: 0.38, ease: EASE_EXPO },
                opacity: { duration: 0.25, delay: 0.08 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height:  { duration: 0.28, ease: [0.4, 0, 1, 1] },
                opacity: { duration: 0.15 },
              },
            }}
            style={{ overflow: "hidden" }}
          >
            <p className="pb-7 font-body text-[14px] leading-[1.85] text-ghost">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <section
      id="faq"
      className="relative bg-ink py-24 md:py-32 px-4 md:px-8 lg:px-16"
      aria-label="Häufige Fragen"
    >
      {/* Subtle top fade from previous section */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, rgba(18,18,18,0.6) 0%, transparent 100%)",
        }}
      />

      <div className="relative max-w-screen-xl mx-auto">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="max-w-2xl mb-14 md:mb-18">
          <motion.span
            className="block text-[9px] font-semibold tracking-[0.35em] text-ghost uppercase mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          >
            Alles was du wissen musst
          </motion.span>

          <SectionTitle
            className="font-display font-black text-white leading-none tracking-tight mb-5"
            style={{ fontSize: "clamp(2.8rem,9vw,7rem)" }}
          >
            FAQ
          </SectionTitle>

          <motion.p
            className="font-body text-ghost text-sm leading-relaxed"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.65, ease: EASE_EXPO }}
          >
            Die Fragen, die ich jeden Tag bekomme — direkt beantwortet.
          </motion.p>
        </div>

        {/* ── Accordion ───────────────────────────────────────────────── */}
        <div className="max-w-3xl">
          {/* Decorative top rule */}
          <motion.div
            className="h-px bg-border/60 mb-0 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE_EXPO }}
          />

          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
              index={i}
            />
          ))}
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────────────── */}
        <motion.div
          className="mt-14 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.65, ease: EASE_EXPO }}
        >
          <p className="font-body text-[13px] text-muted">
            Noch eine offene Frage?
          </p>
          <a
            href="https://instagram.com/novi._.tattoo"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-body text-[12px] font-semibold tracking-[0.12em] text-white uppercase border-b border-white/20 pb-0.5 hover:border-white/60 transition-colors duration-200"
          >
            Auf Instagram fragen
            <svg
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path
                d="M7 1l4 4m0 0L7 9M11 5H1"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
