"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import {
  getPasswordRequirements,
  type PasswordRequirement,
} from "@/lib/password-validation";

interface PasswordRequirementsProps {
  password: string;
  visible: boolean;
}

function RequirementRow({
  requirement,
  index,
  reducedMotion,
}: {
  requirement: PasswordRequirement;
  index: number;
  reducedMotion: boolean | null;
}) {
  const { met, label } = requirement;

  return (
    <motion.li
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.22,
        delay: reducedMotion ? 0 : index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex items-center gap-2.5"
    >
      <span
        className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-[border-color,background-color,box-shadow] duration-300 ${
          met
            ? "border-secondary/40 bg-secondary/[0.12] shadow-[0_0_0_3px_rgba(0,102,136,0.08)]"
            : "border-outline-variant/80 bg-surface-container-low"
        }`}
        aria-hidden
      >
        <AnimatePresence mode="wait" initial={false}>
          {met ? (
            <motion.span
              key="check"
              initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reducedMotion ? undefined : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center"
            >
              <MaterialSymbol
                icon="check"
                className="text-[13px] font-medium text-secondary"
              />
            </motion.span>
          ) : (
            <motion.span
              key="dot"
              initial={reducedMotion ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reducedMotion ? undefined : { scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-1.5 w-1.5 rounded-full bg-outline-variant/70"
            />
          )}
        </AnimatePresence>
      </span>
      <span
        className={`text-body-sm transition-colors duration-300 ${
          met ? "text-on-surface" : "text-on-surface-variant"
        }`}
      >
        {label}
      </span>
    </motion.li>
  );
}

export default function PasswordRequirements({
  password,
  visible,
}: PasswordRequirementsProps) {
  const reducedMotion = useReducedMotion();
  const requirements = getPasswordRequirements(password);
  const metCount = requirements.filter((requirement) => requirement.met).length;
  const progress = metCount / requirements.length;
  const allMet = metCount === requirements.length;

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          key="password-requirements"
          id="password-requirements"
          role="status"
          aria-live="polite"
          initial={reducedMotion ? false : { opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={
            reducedMotion
              ? { opacity: 0 }
              : { opacity: 0, height: 0, y: -4 }
          }
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="rounded-xl border border-surface-variant/70 bg-surface-container-low/80 px-3.5 py-3 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                Password strength
              </p>
              <span
                className={`text-label-sm font-label-sm tabular-nums transition-colors duration-300 ${
                  allMet ? "text-secondary" : "text-outline"
                }`}
              >
                {metCount}/{requirements.length}
              </span>
            </div>

            <div
              className="mb-3 h-1 overflow-hidden rounded-full bg-surface-variant/80"
              aria-hidden
            >
              <motion.div
                className={`h-full rounded-full ${
                  allMet
                    ? "bg-secondary"
                    : progress >= 0.4
                      ? "bg-secondary/70"
                      : "bg-outline-variant"
                }`}
                initial={false}
                animate={{ width: `${progress * 100}%` }}
                transition={{
                  duration: reducedMotion ? 0 : 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>

            <ul className="flex flex-col gap-2">
              {requirements.map((requirement, index) => (
                <RequirementRow
                  key={requirement.id}
                  requirement={requirement}
                  index={index}
                  reducedMotion={reducedMotion}
                />
              ))}
            </ul>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
