"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.032, delayChildren: 0.05 },
  },
};

const charAnim: Variants = {
  hidden: { y: "108%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.7, ease: EASE_EXPO },
  },
};

interface SectionTitleProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  /** delay the whileInView trigger (seconds) */
  delay?: number;
}

export default function SectionTitle({
  children,
  className = "",
  style,
  delay = 0,
}: SectionTitleProps) {
  return (
    <motion.div
      className={`flex flex-wrap gap-x-[0.22em] ${className}`}
      style={style}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.032, delayChildren: delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      aria-label={children}
    >
      {children.split(" ").map((word, wi) => (
        /*
         * Each word is a non-breaking flex container.
         * The outer flex-wrap only ever wraps at WORD boundaries —
         * never mid-word. Framer Motion variant propagation passes
         * through this non-motion span to reach the motion.spans inside.
         */
        <span key={wi} className="flex">
          {word.split("").map((char, ci) => (
            <span key={ci} className="inline-block overflow-hidden">
              <motion.span className="inline-block" variants={charAnim}>
                {char}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </motion.div>
  );
}
