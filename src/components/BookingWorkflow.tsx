"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import SectionTitle from "./SectionTitle";
import AnatomyMap, { type ZoneId } from "./AnatomyMap";

// ─── Types ────────────────────────────────────────────────────────────────────
interface InquiryData {
  style:            string;
  concept:          string;
  placement:        string;    // comma-joined labels, e.g. "Unterarm links, Schulter rechts"
  placementId:      ZoneId[];  // all selected zone ids
  size:             number;
  referenceImages:  File[];
  skinPhoto:        File | null;
  name:             string;
  email:            string;
  instagram:        string;
  ageConfirmed:     boolean;
}

type FormStatus = "idle" | "submitting" | "success";

// ─── Constants ────────────────────────────────────────────────────────────────
const STYLES = [
  "Anime & Gaming",
  "Blackwork",
  "Fine Line",
  "Dark Art / Horror",
  "Cover-Up",
  "Sonstig",
] as const;

const STEP_META = [
  { label: "Konzept",  short: "01" },
  { label: "Anatomy",  short: "02" },
  { label: "Bilder",   short: "03" },
  { label: "Kontakt",  short: "04" },
] as const;

const EMPTY_FORM: InquiryData = {
  style: "", concept: "", placement: "", placementId: [], size: 15,
  referenceImages: [], skinPhoto: null,
  name: "", email: "", instagram: "", ageConfirmed: false,
};

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

// ─── Slide variants ───────────────────────────────────────────────────────────
const slide: Variants = {
  enter: (dir: number) => ({
    x:       dir > 0 ? "55%" : "-55%",
    opacity: 0,
    scale:   0.96,
  }),
  center: {
    x: 0, opacity: 1, scale: 1,
    transition: { duration: 0.42, ease: EASE_EXPO },
  },
  exit: (dir: number) => ({
    x:       dir > 0 ? "-38%" : "38%",
    opacity: 0,
    scale:   0.97,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  }),
};

// ─── Shared input class ───────────────────────────────────────────────────────
const inputCls = (hasError?: boolean) =>
  `w-full bg-surface-2 border ${
    hasError ? "border-red-500/70" : "border-border focus:border-white/40"
  } rounded-lg px-4 py-3.5 text-white placeholder:text-muted text-sm font-body
  outline-none transition-colors duration-200 min-h-[48px]`;

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated step-dot progress bar */
function ProgressHeader({
  step,
  total,
}: {
  step: number;
  total: number;
}) {
  return (
    <div className="mb-10 md:mb-12">
      {/* Step labels row */}
      <div className="flex items-center justify-between mb-4">
        {STEP_META.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
            <motion.div
              className="w-8 h-8 rounded-full border flex items-center justify-center text-[11px] font-bold font-display"
              animate={{
                borderColor:     i <= step ? "rgba(255,255,255,0.9)" : "#2a2a2a",
                backgroundColor: i <  step ? "#ffffff"               : "transparent",
                color:           i <  step ? "#0b0b0b"               : i === step ? "#ffffff" : "#555555",
              }}
              transition={{ duration: 0.35, ease: EASE_EXPO }}
            >
              {i < step ? (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                  <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                s.short
              )}
            </motion.div>
            <span
              className={`hidden sm:block text-[9px] font-semibold tracking-[0.2em] uppercase transition-colors duration-300 ${
                i === step ? "text-white" : "text-muted"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress track */}
      <div className="relative h-[2px] bg-border rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-white rounded-full"
          animate={{ width: `${((step + 1) / total) * 100}%` }}
          transition={{ duration: 0.5, ease: EASE_EXPO }}
        />
      </div>
    </div>
  );
}

/** Drag-and-drop upload zone */
function DragZone({
  label,
  hint,
  accept,
  maxFiles,
  files,
  previews,
  onAdd,
  onRemove,
}: {
  label:    string;
  hint:     string;
  accept:   string;
  maxFiles: number;
  files:    File[];
  previews: string[];
  onAdd:    (f: File[]) => void;
  onRemove: (i: number) => void;
}) {
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const canAdd = files.length < maxFiles;

  const processFiles = useCallback(
    (raw: FileList | null) => {
      if (!raw) return;
      const valid = Array.from(raw)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, maxFiles - files.length);
      onAdd(valid);
    },
    [files.length, maxFiles, onAdd]
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    processFiles(e.dataTransfer.files);
  };

  const fmtSize = (b: number) =>
    b < 1_000_000 ? `${(b / 1000).toFixed(0)} KB` : `${(b / 1e6).toFixed(1)} MB`;

  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.18em] text-ghost uppercase mb-2">
        {label}
        <span className="ml-2 text-muted normal-case tracking-normal font-normal">
          {hint}
        </span>
      </p>

      {/* Drop zone */}
      {canAdd && (
        <div
          role="button"
          tabIndex={0}
          aria-label={`${label} hochladen`}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
            drag
              ? "border-white/50 bg-white/5 scale-[1.01]"
              : "border-border hover:border-white/25 hover:bg-white/[0.02]"
          }`}
          onClick={() => ref.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && ref.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
        >
          <input
            ref={ref}
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            className="sr-only"
            onChange={(e: ChangeEvent<HTMLInputElement>) => processFiles(e.target.files)}
          />
          {/* Upload icon */}
          <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ghost" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
          </div>
          <div>
            <p className="text-sm text-white/70 font-medium">
              Drag & Drop <span className="text-muted">oder klicken</span>
            </p>
            <p className="text-[11px] text-muted mt-0.5">
              JPG, PNG, WEBP · max {maxFiles} {maxFiles === 1 ? "Bild" : "Bilder"}
            </p>
          </div>
        </div>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <div className={`grid gap-2 mt-2 ${maxFiles === 1 ? "grid-cols-1" : "grid-cols-3 sm:grid-cols-4"}`}>
          {previews.map((src, i) => (
            <motion.div
              key={i}
              className="relative rounded-md overflow-hidden bg-surface-2"
              style={{ aspectRatio: "1" }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 18, stiffness: 300 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
              {/* File size badge */}
              <span className="absolute bottom-1 left-1 bg-black/70 text-white/60 text-[9px] px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
                {fmtSize(files[i]?.size ?? 0)}
              </span>
              {/* Remove */}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 border border-white/20 text-white/80 hover:text-white text-[11px] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Entfernen"
              >
                ×
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step Components ──────────────────────────────────────────────────────────
function StepConcept({
  data,
  errors,
  update,
}: {
  data: InquiryData;
  errors: Record<string, string>;
  update: (k: keyof InquiryData, v: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ghost uppercase mb-3">
          Stil auswählen <span className="text-red-400">*</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STYLES.map((s) => (
            <motion.button
              key={s}
              type="button"
              onClick={() => update("style", s)}
              className={`relative rounded-lg border px-3 py-3 text-left text-[12px] font-semibold font-body transition-colors cursor-pointer ${
                data.style === s
                  ? "border-white/60 text-white"
                  : "border-border text-ghost hover:border-white/25 hover:text-white"
              }`}
              whileTap={{ scale: 0.97 }}
            >
              {data.style === s && (
                <motion.span
                  layoutId="style-bg"
                  className="absolute inset-0 rounded-lg bg-white/8"
                  transition={{ type: "spring", damping: 26, stiffness: 340 }}
                />
              )}
              <span className="relative z-10">{s}</span>
            </motion.button>
          ))}
        </div>
        {errors.style && (
          <p className="text-red-400 text-[11px] mt-1.5">{errors.style}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="concept"
          className="block text-[11px] font-semibold tracking-[0.18em] text-ghost uppercase mb-2"
        >
          Deine Idee <span className="text-red-400">*</span>
        </label>
        <textarea
          id="concept"
          rows={4}
          placeholder="Beschreib mir deine Idee so detailliert wie möglich — Stil, Motive, Stimmung, Referenzen..."
          value={data.concept}
          onChange={(e) => update("concept", e.target.value)}
          className={`${inputCls(!!errors.concept)} resize-none leading-relaxed`}
          aria-describedby={errors.concept ? "concept-err" : undefined}
        />
        <div className="flex justify-between items-center mt-1.5">
          {errors.concept ? (
            <p id="concept-err" className="text-red-400 text-[11px]">{errors.concept}</p>
          ) : (
            <span />
          )}
          <span className={`text-[10px] ml-auto ${data.concept.length < 20 ? "text-muted" : "text-ghost"}`}>
            {data.concept.length} / min. 20
          </span>
        </div>
      </div>
    </div>
  );
}

function StepAnatomy({
  data,
  errors,
  update,
}: {
  data: InquiryData;
  errors: Record<string, string>;
  update: (k: keyof InquiryData, v: unknown) => void;
}) {
  const pct = ((data.size - 5) / 35) * 100;

  return (
    <div className="space-y-7">
      {/* ── Anatomy map ───────────────────────────────────────────── */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ghost uppercase mb-4">
          Körperstelle auswählen <span className="text-red-400">*</span>
        </p>
        <AnatomyMap
          value={data.placementId}
          onChange={(ids, labels) => {
            update("placementId", ids);
            update("placement",   labels.join(", "));
          }}
        />
        {errors.placement && (
          <p className="text-red-400 text-[11px] mt-3 text-center">
            {errors.placement}
          </p>
        )}
      </div>

      <div>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-ghost uppercase mb-5">
          Ungefähre Größe
        </p>
        {/* Slider value display */}
        <div className="flex justify-between text-sm mb-4">
          <span className="text-muted text-[11px]">5 cm</span>
          <motion.span
            className="font-display font-black text-white text-xl tabular-nums"
            key={data.size}
            initial={{ y: -4, opacity: 0.6 }}
            animate={{ y: 0,  opacity: 1   }}
            transition={{ duration: 0.2 }}
          >
            {data.size}
            <span className="text-xs text-ghost font-body font-normal ml-1">
              {data.size >= 40 ? "cm +" : "cm"}
            </span>
          </motion.span>
          <span className="text-muted text-[11px]">40+ cm</span>
        </div>

        <input
          type="range"
          min={5}
          max={40}
          step={1}
          value={data.size}
          onChange={(e) => update("size", parseInt(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, #ffffff ${pct}%, #2a2a2a ${pct}%)`,
          }}
          aria-label="Größe in Zentimeter"
        />

        {/* Size guide hints */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {[
            { range: "5–10 cm", eg: "Handgelenk, Fußknöchel" },
            { range: "10–20 cm", eg: "Unterarm, Schulter"  },
            { range: "20+ cm", eg: "Rücken, Oberschenkel" },
          ].map(({ range, eg }) => (
            <div
              key={range}
              className="rounded-md border border-border bg-surface-2 p-2.5 text-center"
            >
              <p className="text-white text-[11px] font-semibold">{range}</p>
              <p className="text-muted text-[9px] mt-0.5 leading-snug">{eg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepImages({
  data,
  refPreviews,
  skinPreview,
  onRefAdd,
  onRefRemove,
  onSkinAdd,
  onSkinRemove,
}: {
  data: InquiryData;
  refPreviews: string[];
  skinPreview: string | null;
  onRefAdd:    (f: File[]) => void;
  onRefRemove: (i: number) => void;
  onSkinAdd:   (f: File[]) => void;
  onSkinRemove: () => void;
}) {
  return (
    <div className="space-y-7">
      <DragZone
        label="Referenzbilder"
        hint="(bis zu 5 Bilder)"
        accept="image/*"
        maxFiles={5}
        files={data.referenceImages}
        previews={refPreviews}
        onAdd={onRefAdd}
        onRemove={onRefRemove}
      />
      <DragZone
        label="Hautstelle"
        hint="(Pflicht — klares Foto der Stelle)"
        accept="image/*"
        maxFiles={1}
        files={data.skinPhoto ? [data.skinPhoto] : []}
        previews={skinPreview ? [skinPreview] : []}
        onAdd={(f) => onSkinAdd(f)}
        onRemove={() => onSkinRemove()}
      />
    </div>
  );
}

function StepContact({
  data,
  errors,
  update,
}: {
  data: InquiryData;
  errors: Record<string, string>;
  update: (k: keyof InquiryData, v: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      {(
        [
          { id: "name",      label: "Name",           type: "text",  placeholder: "Dein Vor- und Nachname" },
          { id: "email",     label: "E-Mail",          type: "email", placeholder: "deine@email.de"         },
        ] as const
      ).map(({ id, label, type, placeholder }) => (
        <div key={id}>
          <label
            htmlFor={id}
            className="block text-[11px] font-semibold tracking-[0.18em] text-ghost uppercase mb-2"
          >
            {label} <span className="text-red-400">*</span>
          </label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={data[id as "name" | "email"]}
            onChange={(e) => update(id as keyof InquiryData, e.target.value)}
            className={inputCls(!!errors[id])}
            autoComplete={id === "email" ? "email" : "name"}
          />
          {errors[id] && (
            <p className="text-red-400 text-[11px] mt-1.5">{errors[id]}</p>
          )}
        </div>
      ))}

      {/* Instagram */}
      <div>
        <label
          htmlFor="instagram"
          className="block text-[11px] font-semibold tracking-[0.18em] text-ghost uppercase mb-2"
        >
          Instagram <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-medium select-none pointer-events-none">
            @
          </span>
          <input
            id="instagram"
            type="text"
            placeholder="dein_handle"
            value={data.instagram.replace(/^@/, "")}
            onChange={(e) =>
              update("instagram", e.target.value.replace(/^@/, ""))
            }
            className={`${inputCls(!!errors.instagram)} pl-8`}
            autoComplete="username"
          />
        </div>
        {errors.instagram ? (
          <p className="text-red-400 text-[11px] mt-1.5">{errors.instagram}</p>
        ) : (
          <p className="text-muted text-[11px] mt-1.5">
            Novi schickt dir dort die Terminbestätigung.
          </p>
        )}
      </div>

      {/* Age confirmation */}
      <label className="flex items-start gap-3 cursor-pointer group mt-2 select-none">
        <button
          type="button"
          role="checkbox"
          aria-checked={data.ageConfirmed}
          onClick={() => update("ageConfirmed", !data.ageConfirmed)}
          className={`shrink-0 mt-0.5 w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all cursor-pointer ${
            data.ageConfirmed
              ? "bg-white border-white"
              : "border-border group-hover:border-white/30"
          }`}
        >
          <AnimatePresence>
            {data.ageConfirmed && (
              <motion.svg
                width="11"
                height="9"
                viewBox="0 0 11 9"
                fill="none"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", damping: 14, stiffness: 350 }}
                aria-hidden="true"
              >
                <path
                  d="M1 4.5l3 3L10 1"
                  stroke="#0b0b0b"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </button>
        <span className="text-[12px] text-ghost leading-relaxed">
          Ich bestätige, dass ich mindestens{" "}
          <strong className="text-white font-semibold">18 Jahre alt</strong> bin.{" "}
          <span className="text-red-400">*</span>
        </span>
      </label>
      {errors.ageConfirmed && (
        <p className="text-red-400 text-[11px] mt-1">{errors.ageConfirmed}</p>
      )}
    </div>
  );
}

/** Animated success screen */
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-8 py-12 text-center"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 22, stiffness: 260 }}
    >
      {/* Checkmark circle */}
      <motion.div
        className="relative w-20 h-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", damping: 14, stiffness: 220 }}
      >
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <motion.circle
            cx="40" cy="40" r="37"
            stroke="#22c55e"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.7, ease: EASE_EXPO }}
          />
          <motion.path
            d="M22 40l12 12 24-24"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 0.5, ease: EASE_EXPO }}
          />
        </svg>
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: EASE_EXPO }}
      >
        <h3 className="font-display font-black text-white text-2xl md:text-3xl leading-tight">
          Anfrage eingegangen! 🎉
        </h3>
        <p className="text-ghost text-sm leading-relaxed mt-3 max-w-sm mx-auto">
          Novi hat deine Anfrage erhalten. Check deine Instagram DMs —{" "}
          <strong className="text-white">Antwort innerhalb von 48 h</strong>.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5, ease: EASE_EXPO }}
      >
        <a
          href="https://instagram.com/novi._.tattoo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-ink font-display font-bold text-[12px] tracking-[0.12em] uppercase px-6 py-3 rounded-full hover:bg-white/90 transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          @novi._.tattoo folgen
        </a>
        <button
          onClick={onReset}
          className="text-muted text-[12px] font-medium hover:text-ghost transition-colors cursor-pointer px-4 py-3"
        >
          Neue Anfrage stellen
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookingWorkflow() {
  const TOTAL = 4;
  const [step,      setStep]      = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [status,    setStatus]    = useState<FormStatus>("idle");
  const [errors,    setErrors]    = useState<Record<string, string>>({});
  const [form,      setForm]      = useState<InquiryData>(EMPTY_FORM);
  const [refPrev,   setRefPrev]   = useState<string[]>([]);
  const [skinPrev,  setSkinPrev]  = useState<string | null>(null);

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      refPrev.forEach(URL.revokeObjectURL);
      if (skinPrev) URL.revokeObjectURL(skinPrev);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback((key: keyof InquiryData, val: unknown) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => { const n = { ...prev }; delete n[key as string]; return n; });
  }, []);

  // ── Ref image handlers ────────────────────────────────────────────────────
  const addRefImages = useCallback((files: File[]) => {
    const urls = files.map(URL.createObjectURL);
    setRefPrev((p) => [...p, ...urls]);
    setForm((p) => ({ ...p, referenceImages: [...p.referenceImages, ...files] }));
  }, []);

  const removeRefImage = useCallback((i: number) => {
    URL.revokeObjectURL(refPrev[i]);
    setRefPrev((p) => p.filter((_, idx) => idx !== i));
    setForm((p) => ({
      ...p,
      referenceImages: p.referenceImages.filter((_, idx) => idx !== i),
    }));
  }, [refPrev]);

  // ── Skin photo handlers ───────────────────────────────────────────────────
  const addSkinPhoto = useCallback((files: File[]) => {
    if (!files[0]) return;
    if (skinPrev) URL.revokeObjectURL(skinPrev);
    const url = URL.createObjectURL(files[0]);
    setSkinPrev(url);
    setForm((p) => ({ ...p, skinPhoto: files[0] }));
  }, [skinPrev]);

  const removeSkinPhoto = useCallback(() => {
    if (skinPrev) URL.revokeObjectURL(skinPrev);
    setSkinPrev(null);
    setForm((p) => ({ ...p, skinPhoto: null }));
  }, [skinPrev]);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.style) e.style = "Bitte wähle einen Stil aus.";
      if (form.concept.trim().length < 20)
        e.concept = "Beschreib deine Idee mit mindestens 20 Zeichen.";
    }
    if (step === 1) {
      if (form.placementId.length === 0)
        e.placement = "Bitte wähle mindestens eine Körperstelle auf der Karte aus.";
    }
    // Step 2 (images) — optional, no hard block
    if (step === 3) {
      if (!form.name.trim()) e.name = "Dein Name fehlt.";
      if (!form.email.includes("@") || !form.email.includes("."))
        e.email = "Bitte gib eine gültige E-Mail ein.";
      if (!form.instagram.trim())
        e.instagram = "Dein Instagram-Handle fehlt.";
      if (!form.ageConfirmed)
        e.ageConfirmed = "Du musst mindestens 18 Jahre alt sein.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [step, form]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    if (!validate()) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL - 1));
  }, [validate]);

  const goBack = useCallback(() => {
    setErrors({});
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setStatus("submitting");

    try {
      const body = new FormData();
      body.append("name",           form.name);
      body.append("email",          form.email);
      body.append("instagram",      form.instagram.replace(/^@/, ""));
      body.append("age_confirmed",  String(form.ageConfirmed));
      body.append("style",          form.style);
      body.append("placement",      form.placement);
      body.append("placement_ids",  JSON.stringify(form.placementId));
      body.append("size_cm",        String(form.size));
      body.append("concept",        form.concept);

      for (const file of form.referenceImages) {
        body.append("reference_images", file);
      }
      if (form.skinPhoto) {
        body.append("skin_photo", form.skinPhoto);
      }

      const res = await fetch("/api/booking", { method: "POST", body });
      if (!res.ok) throw new Error("Server error");

      setStatus("success");
    } catch {
      setStatus("idle");
      alert("Etwas ist schiefgelaufen. Bitte versuche es nochmal.");
    }
  }, [form, validate]);

  const handleReset = useCallback(() => {
    refPrev.forEach(URL.revokeObjectURL);
    if (skinPrev) URL.revokeObjectURL(skinPrev);
    setRefPrev([]);
    setSkinPrev(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setStatus("idle");
    setStep(0);
    setDirection(1);
  }, [refPrev, skinPrev]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      id="booking"
      className="relative bg-ink py-24 md:py-32 px-4 md:px-8 lg:px-16"
      aria-label="Termin anfragen"
    >
      {/* Radial backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,255,255,0.025) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-screen-xl mx-auto">
        {/* ── Section header ──────────────────────────────────────── */}
        {status !== "success" && (
          <>
            <motion.span
              className="block text-[9px] font-semibold tracking-[0.35em] text-ghost uppercase mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
            >
              Kein DM-Chaos mehr
            </motion.span>
            <SectionTitle
              className="font-display font-black text-white leading-none tracking-tight mb-5"
              style={{ fontSize: "clamp(2.8rem,9vw,7rem)" }}
            >
              Anfrage stellen
            </SectionTitle>
            <motion.p
              className="max-w-md font-body text-ghost text-sm leading-relaxed mb-14 md:mb-16"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7, ease: EASE_EXPO }}
            >
              Füll das Formular in 4 kurzen Schritten aus — ich melde mich
              innerhalb von 48 h mit einem persönlichen Konzept.
            </motion.p>
          </>
        )}

        {/* ── Form card ───────────────────────────────────────────── */}
        <div className="max-w-[580px] mx-auto">
          <motion.div
            className="rounded-2xl border border-border bg-surface p-6 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE_EXPO }}
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div key="success">
                  <SuccessScreen onReset={handleReset} />
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                  <ProgressHeader step={step} total={TOTAL} />

                  {/* Step slider */}
                  <div className="relative overflow-hidden" style={{ minHeight: "360px" }}>
                    <AnimatePresence custom={direction} mode="popLayout">
                      <motion.div
                        key={step}
                        custom={direction}
                        variants={slide}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        {step === 0 && (
                          <StepConcept data={form} errors={errors} update={update} />
                        )}
                        {step === 1 && (
                          <StepAnatomy data={form} errors={errors} update={update} />
                        )}
                        {step === 2 && (
                          <StepImages
                            data={form}
                            refPreviews={refPrev}
                            skinPreview={skinPrev}
                            onRefAdd={addRefImages}
                            onRefRemove={removeRefImage}
                            onSkinAdd={addSkinPhoto}
                            onSkinRemove={removeSkinPhoto}
                          />
                        )}
                        {step === 3 && (
                          <StepContact data={form} errors={errors} update={update} />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                    <motion.button
                      type="button"
                      onClick={goBack}
                      className={`flex items-center gap-2 text-[12px] font-semibold tracking-[0.1em] uppercase transition-all cursor-pointer ${
                        step === 0 ? "invisible" : "text-ghost hover:text-white"
                      }`}
                      whileTap={{ scale: 0.96 }}
                    >
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                        <path d="M5 1L1 5m0 0l4 4M1 5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Zurück
                    </motion.button>

                    {step < TOTAL - 1 ? (
                      <motion.button
                        type="button"
                        onClick={goNext}
                        className="flex items-center gap-2.5 bg-white text-ink font-display font-bold text-[12px] tracking-[0.14em] uppercase px-7 py-3.5 rounded-full hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer"
                        whileTap={{ scale: 0.97 }}
                      >
                        Weiter
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                          <path d="M9 1l4 4m0 0l-4 4M13 5H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.button>
                    ) : (
                      <motion.button
                        type="button"
                        onClick={handleSubmit}
                        disabled={status === "submitting"}
                        className="flex items-center gap-2.5 bg-white text-ink font-display font-bold text-[12px] tracking-[0.14em] uppercase px-7 py-3.5 rounded-full hover:bg-white/90 disabled:opacity-70 active:scale-[0.97] transition-all cursor-pointer min-w-[140px] justify-center"
                        whileTap={{ scale: 0.97 }}
                      >
                        {status === "submitting" ? (
                          <span className="flex gap-1.5 items-center">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-ink inline-block"
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.65,
                                  delay: i * 0.13,
                                  ease: "easeInOut",
                                }}
                              />
                            ))}
                          </span>
                        ) : (
                          <>
                            Absenden
                            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                              <path d="M9 1l4 4m0 0l-4 4M13 5H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Trust signals below card */}
          {status !== "success" && (
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 mt-8 text-[10px] text-muted tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {["🔒 Daten nur für Novi", "📬 48 h Antwortzeit", "💶 Kostenlos & unverbindlich"].map(
                (t) => (
                  <span key={t} className="flex items-center gap-1.5">{t}</span>
                )
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
