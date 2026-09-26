"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export default function WiveliWishEnvelope() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const flapTransition = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.72, ease: [0.22, 1, 0.36, 1] };

  const letterTransition = reduceMotion
    ? { duration: 0.01 }
    : {
        type: "spring",
        stiffness: 105,
        damping: 18,
        delay: open ? 0.38 : 0,
      };

  return (
    <div className={`wishEnvelopeExperience ${open ? "isOpen" : ""}`}>
      <div className="wishEnvelopeStage">
        <motion.div
          className="wishEnvelopeAura"
          animate={{
            scale: open ? 1.12 : 1,
            opacity: open ? 0.8 : 0.45,
          }}
          transition={{ duration: 0.8 }}
        />

        <div className="wishEnvelopeObject">
          {/* BACK */}
          <div className="wishEnvelopeBack" />

          {/* LETTER — COMPLETELY HIDDEN WHEN CLOSED */}
         <motion.div
  className="wishEnvelopeLetter"
  initial={false}
  animate={{
    y: open ? "-58%" : "35%",
    scale: open ? 1 : 0.94,
    opacity: open ? 1 : 0,
  }}
  transition={
    open
      ? {
          type: "spring",
          stiffness: 95,
          damping: 18,
          delay: 0.42,
        }
      : {
          duration: 0.22,
        }
  }
>
            <p className="wishLetterEyebrow">WISH NOTE ♡</p>

            <h3>
              365 days
              <br />
              of happiness.
            </h3>

            <span>a little world made for you</span>

            <div className="wishLetterSignature">
              made with love
            </div>
          </motion.div>

          {/* INSIDE SHADOW */}
          <div className="wishEnvelopeInside" />

          {/* FRONT POCKET */}
          <div className="wishEnvelopeFront">
            <div className="wishEnvelopeLeftFold" />
            <div className="wishEnvelopeRightFold" />
            <div className="wishEnvelopeBottomFold" />
          </div>

          {/* TOP FLAP */}
          <motion.div
            className="wishEnvelopeFlap"
            initial={false}
            animate={{
              rotateX: open ? -178 : 0,
            }}
            transition={flapTransition}
            style={{
              zIndex: open ? 4 : 30,
            }}
          >
            <div className="wishEnvelopeFlapShape" />
          </motion.div>

          {/* SEAL */}
          <AnimatePresence>
            {!open && (
              <motion.button
                type="button"
                className="wishWaxButton"
                aria-label="Open Wish Note"
                onClick={() => setOpen(true)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={
                  reduceMotion
                    ? { opacity: 1, scale: 1 }
                    : {
                        opacity: 1,
                        scale: [1, 1.055, 1],
                      }
                }
                exit={{
                  opacity: 0,
                  scale: 0.6,
                }}
                transition={
                  reduceMotion
                    ? { duration: 0.01 }
                    : {
                        opacity: { duration: 0.25 },
                        scale: {
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }
                }
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
              >
                <span className="wishWaxSeal">
                  <span>♡</span>
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* PARTICLES */}
          <AnimatePresence>
            {open &&
              !reduceMotion &&
              [
                { x: -82, y: -118, delay: 0.55, size: 16 },
                { x: 12, y: -145, delay: 0.68, size: 12 },
                { x: 88, y: -104, delay: 0.78, size: 18 },
              ].map((heart, index) => (
                <motion.span
                  key={index}
                  className="wishEnvelopeParticle"
                  style={{ fontSize: heart.size }}
                  initial={{
                    opacity: 0,
                    x: 0,
                    y: 0,
                    scale: 0.4,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: heart.x,
                    y: heart.y,
                    scale: [0.4, 1, 0.85],
                  }}
                  transition={{
                    duration: 1.55,
                    delay: heart.delay,
                    ease: "easeOut",
                  }}
                >
                  ♡
                </motion.span>
              ))}
          </AnimatePresence>
        </div>
      </div>

      <button
        type="button"
        className="wishEnvelopeControl"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{open ? "↺" : "♡"}</span>
        {open ? "Seal it again" : "Tap the seal to open"}
      </button>
    </div>
  );
}
