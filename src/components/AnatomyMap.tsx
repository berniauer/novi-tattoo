"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ZoneId =
  // ── Front ──────────────────────────────────────────────────────────────────
  | "head"               | "neck"
  | "chest"              | "abdomen"            | "pelvis"
  | "right_shoulder"     | "right_upper_arm"    | "right_forearm"    | "right_hand"
  | "left_shoulder"      | "left_upper_arm"     | "left_forearm"     | "left_hand"
  | "right_thigh"        | "right_calf"         | "right_foot"
  | "left_thigh"         | "left_calf"          | "left_foot"
  // ── Back ───────────────────────────────────────────────────────────────────
  | "head_back"          | "neck_back"
  | "shoulder_blade_r"   | "upper_back"         | "shoulder_blade_l"
  | "mid_back"           | "lower_back"
  | "glute_right"        | "glute_left"
  | "right_shoulder_b"   | "right_upper_arm_b"  | "right_forearm_b"
  | "left_shoulder_b"    | "left_upper_arm_b"   | "left_forearm_b"
  | "right_thigh_b"      | "right_calf_b"
  | "left_thigh_b"       | "left_calf_b";

type Side = "front" | "back";

interface Zone {
  id:    ZoneId;
  label: string;
  d:     string;
}

// ── Multi-select API: parent always receives the full updated arrays ──────────
interface Props {
  value:    ZoneId[];
  onChange: (ids: ZoneId[], labels: string[]) => void;
}

// ─── Accent ───────────────────────────────────────────────────────────────────
const ACCENT     = "#deff9a";
const ACCENT_DIM = "rgba(222,255,154,0.12)";
const EASE_EXPO  = [0.16, 1, 0.3, 1] as const;

// ─── Zone definitions ─────────────────────────────────────────────────────────
const FRONT_ZONES: Zone[] = [
  { id: "head",            label: "Kopf",                 d: "M180,30 L220,30 L230,65 L215,100 L185,100 L170,65 Z" },
  { id: "neck",            label: "Hals / Nacken",        d: "M187,102 L213,102 L220,125 L180,125 Z" },
  { id: "chest",           label: "Brust / Dekolleté",    d: "M180,127 L220,127 L260,150 L245,230 L155,230 L140,150 Z" },
  { id: "abdomen",         label: "Bauch / Rippen",       d: "M157,232 L243,232 L230,320 L170,320 Z" },
  { id: "pelvis",          label: "Hüfte / Becken",       d: "M170,322 L230,322 L250,370 L200,400 L150,370 Z" },
  { id: "right_shoulder",  label: "Schulter rechts",      d: "M138,150 L100,165 L90,210 L130,205 Z" },
  { id: "right_upper_arm", label: "Oberarm rechts",       d: "M130,207 L90,212 L80,300 L115,295 Z" },
  { id: "right_forearm",   label: "Unterarm rechts",      d: "M115,297 L80,302 L65,400 L95,395 Z" },
  { id: "right_hand",      label: "Hand rechts",          d: "M95,397 L65,402 L55,445 L75,455 L90,430 Z" },
  { id: "left_shoulder",   label: "Schulter links",       d: "M262,150 L300,165 L310,210 L270,205 Z" },
  { id: "left_upper_arm",  label: "Oberarm links",        d: "M270,207 L310,212 L320,300 L285,295 Z" },
  { id: "left_forearm",    label: "Unterarm links",       d: "M285,297 L320,302 L335,400 L305,395 Z" },
  { id: "left_hand",       label: "Hand links",           d: "M305,397 L335,402 L345,445 L325,455 L310,430 Z" },
  { id: "right_thigh",     label: "Oberschenkel rechts",  d: "M150,372 L198,398 L185,530 L135,520 Z" },
  { id: "right_calf",      label: "Unterschenkel rechts", d: "M135,522 L185,532 L170,690 L130,680 Z" },
  { id: "right_foot",      label: "Fuß rechts",           d: "M130,682 L170,692 L180,740 L110,740 Z" },
  { id: "left_thigh",      label: "Oberschenkel links",   d: "M250,372 L202,398 L215,530 L265,520 Z" },
  { id: "left_calf",       label: "Unterschenkel links",  d: "M265,522 L215,532 L230,690 L270,680 Z" },
  { id: "left_foot",       label: "Fuß links",            d: "M270,682 L230,692 L220,740 L290,740 Z" },
];

const BACK_ZONES: Zone[] = [
  { id: "head_back",        label: "Kopf (h.)",                d: "M180,30 L220,30 L230,65 L215,100 L185,100 L170,65 Z" },
  { id: "neck_back",        label: "Nacken",                   d: "M187,102 L213,102 L220,125 L180,125 Z" },
  { id: "shoulder_blade_r", label: "Schulterblatt rechts",     d: "M140,150 L182,127 L165,228 L140,228 L112,212 L108,168 Z" },
  { id: "upper_back",       label: "Oberer Rücken / Traps",    d: "M184,127 L216,127 L236,178 L230,228 L170,228 L164,178 Z" },
  { id: "shoulder_blade_l", label: "Schulterblatt links",      d: "M260,150 L218,127 L235,228 L260,228 L292,212 L292,168 Z" },
  { id: "mid_back",         label: "Mittlerer Rücken",         d: "M157,230 L243,230 L232,318 L168,318 Z" },
  { id: "lower_back",       label: "Lendenbereich",            d: "M168,320 L232,320 L240,355 L160,355 Z" },
  { id: "glute_right",      label: "Gesäß rechts",             d: "M158,357 L200,392 L186,430 L143,420 L138,378 Z" },
  { id: "glute_left",       label: "Gesäß links",              d: "M242,357 L200,392 L214,430 L257,420 L262,378 Z" },
  { id: "right_shoulder_b", label: "Schulter rechts (h.)",     d: "M138,150 L100,165 L90,210 L130,205 Z" },
  { id: "right_upper_arm_b",label: "Oberarm rechts (h.)",      d: "M130,207 L90,212 L80,300 L115,295 Z" },
  { id: "right_forearm_b",  label: "Unterarm rechts (h.)",     d: "M115,297 L80,302 L65,400 L95,395 Z" },
  { id: "left_shoulder_b",  label: "Schulter links (h.)",      d: "M262,150 L300,165 L310,210 L270,205 Z" },
  { id: "left_upper_arm_b", label: "Oberarm links (h.)",       d: "M270,207 L310,212 L320,300 L285,295 Z" },
  { id: "left_forearm_b",   label: "Unterarm links (h.)",      d: "M285,297 L320,302 L335,400 L305,395 Z" },
  { id: "right_thigh_b",    label: "Oberschenkel rechts (h.)", d: "M143,422 L200,394 L184,532 L133,522 Z" },
  { id: "right_calf_b",     label: "Wade rechts",              d: "M131,524 L184,534 L168,690 L128,680 Z" },
  { id: "left_thigh_b",     label: "Oberschenkel links (h.)",  d: "M257,422 L200,394 L216,532 L267,522 Z" },
  { id: "left_calf_b",      label: "Wade links",               d: "M269,524 L216,534 L232,690 L272,680 Z" },
];

const ALL_ZONES = [...FRONT_ZONES, ...BACK_ZONES];

// ─── ZoneShape ────────────────────────────────────────────────────────────────
function ZoneShape({
  zone,
  isHovered,
  isSelected,
  isDimmed,
  onHover,
  onLeave,
  onClick,
}: {
  zone:       Zone;
  isHovered:  boolean;
  isSelected: boolean;
  isDimmed:   boolean;
  onHover:    () => void;
  onLeave:    () => void;
  onClick:    () => void;
}) {
  const active = isHovered || isSelected;

  return (
    <g>
      {/* Glow layer */}
      <motion.path
        d={zone.d}
        fill={ACCENT}
        style={{ filter: "blur(12px)", pointerEvents: "none" }}
        animate={{ opacity: active ? (isSelected ? 0.7 : 0.38) : 0 }}
        transition={{ duration: 0.22 }}
        aria-hidden="true"
      />
      {/* Interactive fill */}
      <motion.path
        d={zone.d}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onTouchStart={onHover}
        onTouchEnd={onLeave}
        onClick={onClick}
        className="cursor-crosshair"
        style={{ originX: "200px", originY: "400px" }}
        initial={false}
        animate={{
          fill:        isSelected ? ACCENT                    : isHovered ? ACCENT_DIM              : "rgba(255,255,255,0.10)",
          stroke:      isSelected ? "#ffffff"               : isHovered ? ACCENT                 : "rgba(255,255,255,0.55)",
          strokeWidth: isSelected ? 2.5                     : isHovered ? 2                      : 1.2,
          opacity:     isDimmed   ? 0.4                     : 1,
          filter:      isSelected
            ? "drop-shadow(0 0 10px rgba(222,255,154,0.85))"
            : isHovered
              ? "drop-shadow(0 0 5px rgba(222,255,154,0.45))"
              : "none",
        }}
        transition={{ duration: 0.25 }}
        whileTap={{ scale: 0.97 }}
      />
    </g>
  );
}

// ─── SelectionTag — removable chip per selected zone ─────────────────────────
function SelectionTag({
  label,
  onRemove,
}: {
  label:    string;
  onRemove: () => void;
}) {
  return (
    <motion.span
      className="inline-flex items-center gap-1.5 rounded-full border pl-2.5 pr-1.5 py-0.5 font-body text-[9px] tracking-[0.16em] uppercase"
      style={{
        borderColor:     "rgba(222,255,154,0.3)",
        color:           ACCENT,
        backgroundColor: "rgba(222,255,154,0.07)",
      }}
      initial={{ opacity: 0, scale: 0.82, y: 6 }}
      animate={{ opacity: 1, scale: 1,    y: 0 }}
      exit={{    opacity: 0, scale: 0.82, y: 4 }}
      transition={{ type: "spring", damping: 20, stiffness: 320 }}
      layout
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="flex items-center justify-center w-3.5 h-3.5 rounded-full transition-colors duration-150 cursor-pointer"
        style={{ color: "rgba(222,255,154,0.55)" }}
        aria-label={`${label} entfernen`}
      >
        <svg width="7" height="7" viewBox="0 0 7 7" fill="none" aria-hidden="true">
          <path d="M1 1l5 5M6 1L1 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </button>
    </motion.span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AnatomyMap({ value, onChange }: Props) {
  const [side,      setSide]      = useState<Side>("front");
  const [hoveredId, setHoveredId] = useState<ZoneId | null>(null);

  const zones            = side === "front" ? FRONT_ZONES : BACK_ZONES;
  const hoveredZone      = hoveredId ? zones.find((z) => z.id === hoveredId) : null;
  const selectedOnThisSide = zones.filter((z) => value.includes(z.id));
  const selectedOtherSide  = ALL_ZONES.filter(
    (z) => value.includes(z.id) && !zones.some((fz) => fz.id === z.id)
  );

  // Toggle a zone in/out of the selection
  const toggle = (zone: Zone) => {
    const next = value.includes(zone.id)
      ? value.filter((id) => id !== zone.id)
      : [...value, zone.id];

    const labels = next.map(
      (id) => ALL_ZONES.find((z) => z.id === id)?.label ?? id
    );
    onChange(next, labels);
  };

  // Remove a specific zone by id
  const remove = (id: ZoneId) => {
    const next   = value.filter((v) => v !== id);
    const labels = next.map((i) => ALL_ZONES.find((z) => z.id === i)?.label ?? i);
    onChange(next, labels);
  };

  // Clear all
  const clearAll = () => onChange([], []);

  return (
    <div className="flex flex-col items-center gap-4 select-none">

      {/* ── Side toggle ────────────────────────────────────────────────── */}
      <div className="relative flex rounded-full border border-border/60 p-0.5 text-[10px]">
        {(["front", "back"] as Side[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            className="relative z-10 px-5 py-1.5 font-body font-semibold tracking-[0.18em] uppercase transition-colors duration-200 cursor-pointer"
            style={{ color: side === s ? "#0b0b0b" : "rgba(160,160,160,0.7)" }}
          >
            {s === "front" ? "Vorne" : "Hinten"}
          </button>
        ))}
        <motion.span
          className="absolute top-0.5 bottom-0.5 rounded-full bg-white"
          animate={{ left: side === "front" ? "2px" : "50%", right: side === "front" ? "50%" : "2px" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          aria-hidden="true"
        />
      </div>

      {/* ── Hover / count chip ─────────────────────────────────────────── */}
      <div className="h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {hoveredZone ? (
            /* Show hovered zone name while hovering */
            <motion.span
              key={`hover-${hoveredZone.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 font-body text-[10px] tracking-[0.18em] uppercase"
              style={{ borderColor: "rgba(222,255,154,0.3)", color: ACCENT, backgroundColor: "rgba(222,255,154,0.07)" }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y: -3 }}
              transition={{ duration: 0.15 }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
              {hoveredZone.label}
            </motion.span>
          ) : value.length > 0 ? (
            /* Show count summary when not hovering */
            <motion.span
              key="count"
              className="font-body text-[10px] tracking-[0.18em] uppercase"
              style={{ color: ACCENT }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0, y: -3 }}
              transition={{ duration: 0.15 }}
            >
              {value.length} {value.length === 1 ? "Stelle" : "Stellen"} ausgewählt
            </motion.span>
          ) : (
            <motion.span
              key="hint"
              className="font-body text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "rgba(160,160,160,0.4)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              Mehrere Stellen wählbar
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── SVG ────────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
        <AnimatePresence mode="wait">
          <motion.svg
            key={side}
            viewBox="0 0 400 800"
            className="w-full h-auto relative z-10"
            aria-label={`Körper ${side === "front" ? "Vorderansicht" : "Rückansicht"} — Mehrere Stellen wählbar`}
            role="img"
            style={{ filter: "drop-shadow(0 0 20px rgba(0,0,0,0.9))" }}
            initial={{ opacity: 0, x: side === "front" ? -24 : 24, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{    opacity: 0, x: side === "front" ? 24 : -24, scale: 0.97 }}
            transition={{ duration: 0.38, ease: EASE_EXPO }}
          >
            <defs>
              <pattern id="amap-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="400" height="800" fill="url(#amap-grid)" />

            {zones.map((zone) => (
              <ZoneShape
                key={zone.id}
                zone={zone}
                isHovered={hoveredId === zone.id}
                isSelected={value.includes(zone.id)}
                isDimmed={
                  selectedOnThisSide.length > 0 &&
                  !value.includes(zone.id) &&
                  hoveredId === null
                }
                onHover={() => setHoveredId(zone.id)}
                onLeave={() => setHoveredId(null)}
                onClick={() => toggle(zone)}
              />
            ))}

            {/* Pulse rings on all selected zones visible in this view */}
            {selectedOnThisSide.map((zone) => (
              <motion.path
                key={`pulse-${zone.id}`}
                d={zone.d}
                fill="none"
                stroke={ACCENT}
                strokeWidth="2"
                style={{ pointerEvents: "none" }}
                animate={{ opacity: [0.5, 0], strokeWidth: [2, 7] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", repeatDelay: 0.4 }}
              />
            ))}
          </motion.svg>
        </AnimatePresence>
      </div>

      {/* ── Selected tags ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {value.length > 0 && (
          <motion.div
            className="flex flex-col items-center gap-3 w-full"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: 4 }}
            transition={{ duration: 0.22 }}
          >
            {/* Chips row — all selected zones */}
            <motion.div
              className="flex flex-wrap justify-center gap-1.5 max-w-[320px]"
              layout
            >
              <AnimatePresence>
                {value.map((id) => {
                  const zone = ALL_ZONES.find((z) => z.id === id);
                  return zone ? (
                    <SelectionTag
                      key={id}
                      label={zone.label}
                      onRemove={() => remove(id)}
                    />
                  ) : null;
                })}
              </AnimatePresence>
            </motion.div>

            {/* Other-side indicator */}
            {selectedOtherSide.length > 0 && (
              <p className="font-body text-[9px] tracking-[0.14em] text-muted uppercase">
                + {selectedOtherSide.length} auf {side === "front" ? "Rückseite" : "Vorderseite"} →
                <button
                  type="button"
                  className="ml-1.5 underline underline-offset-2 cursor-pointer hover:text-ghost transition-colors"
                  onClick={() => setSide(side === "front" ? "back" : "front")}
                >
                  anzeigen
                </button>
              </p>
            )}

            {/* Clear all */}
            {value.length > 1 && (
              <button
                type="button"
                className="font-body text-[10px] tracking-[0.16em] uppercase underline underline-offset-2 cursor-pointer transition-colors duration-150"
                style={{ color: "rgba(160,160,160,0.4)" }}
                onClick={clearAll}
              >
                Alle aufheben
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
