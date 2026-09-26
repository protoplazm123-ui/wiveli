"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export default function WiveliWishEnvelope() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const spring = reduce
    ? { duration: 0.2 }
    : {
        type: "spring",
        stiffness: 120,
        damping: 16,
      };

  return (
    <div className="wiveliEnvelopeExperience">
      <div className="wiveliEnvelopeStage">

        {/* PURPLE HALO */}
        <motion.div
          className="wiveliEnvelopeHalo"
          aria-hidden="true"
          animate={
            reduce
              ? {}
              : {
                  scale: open ? 1.15 : 1,
                  opacity: open ? 1 : 0.55,
                }
          }
          transition={{ duration: 0.9 }}
        />

        <div className="wiveliEnvelopeObject">

          {/* LETTER */}
          <motion.div
            className="wiveliEnvelopeLetter"
            initial={false}
            animate={
              open
                ? { y: "-48%" }
                : { y: "17%" }
            }
            transition={spring}
          >
            <div className="wiveliLetterLine" />

            <AnimatePresence>
              {open && (
                <motion.div
                  className="wiveliLetterContent"
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    delay: reduce ? 0 : 0.28,
                    duration: 0.4,
                  }}
                >
                  <p className="wiveliLetterTiny">
                    WISH NOTE ♡
                  </p>

                  <h3>
                    365 days
                    <br />
                    of happiness.
                  </h3>

                  <span>
                    a little world made for you
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>


          {/* ENVELOPE BACK */}
          <div className="wiveliEnvelopeBack" />


          {/* FRONT POCKET */}
          <div className="wiveliEnvelopePocket">
            <svg
              viewBox="0 0 300 200"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="wiveliPocket"
                  x1="0"
                  y1="1"
                  x2="0"
                  y2="0"
                >
                  <stop
                    offset="0"
                    stopColor="#c9b2e5"
                  />

                  <stop
                    offset="1"
                    stopColor="#eee5f8"
                  />
                </linearGradient>

                <linearGradient
                  id="wiveliFoldLeft"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0"
                    stopColor="#bca0dc"
                  />

                  <stop
                    offset="1"
                    stopColor="#dfd0ef"
                  />
                </linearGradient>

                <linearGradient
                  id="wiveliFoldRight"
                  x1="1"
                  y1="0"
                  x2="0"
                  y2="0"
                >
                  <stop
                    offset="0"
                    stopColor="#b99bd9"
                  />

                  <stop
                    offset="1"
                    stopColor="#e5d8f2"
                  />
                </linearGradient>
              </defs>

              <path
                d="M0 200 V60 L150 150 Z"
                fill="url(#wiveliFoldLeft)"
              />

              <path
                d="M300 200 V60 L150 150 Z"
                fill="url(#wiveliFoldRight)"
              />

              <path
                d="M0 200 V64 L150 150 L300 64 V200 Z"
                fill="url(#wiveliPocket)"
                stroke="rgba(82,44,115,.18)"
                strokeWidth="1.5"
              />

              <path
                d="M2 65 L150 148 L298 65"
                fill="none"
                stroke="rgba(255,255,255,.58)"
                strokeWidth="1.5"
              />
            </svg>
          </div>


          {/* OPENING FLAP */}
          <motion.div
            className="wiveliEnvelopeFlap"
            style={{
              zIndex: open ? 5 : 30,
            }}
            initial={false}
            animate={{
              rotateX: open ? -170 : 0,
            }}
            transition={spring}
          >
            <svg
              viewBox="0 0 300 118"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="wiveliFlap"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0"
                    stopColor="#eee6f7"
                  />

                  <stop
                    offset="1"
                    stopColor="#cbb3e5"
                  />
                </linearGradient>
              </defs>

              <path
                d="M0 0 H300 V6 L150 110 L0 6 Z"
                fill="url(#wiveliFlap)"
                stroke="rgba(82,44,115,.18)"
                strokeWidth="1.5"
              />

              <path
                d="M150 110 L4 8"
                stroke="rgba(76,42,105,.08)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </motion.div>


          {/* WAX SEAL */}
          <AnimatePresence>
            {!open && (
              <motion.button
                type="button"
                className="wiveliWaxButton"
                onClick={() => setOpen(true)}
                aria-label="Open Wish Note"
                initial={{
                  scale: 0,
                  rotate: -25,
                }}
                animate={
                  reduce
                    ? {
                        scale: 1,
                        rotate: 0,
                      }
                    : {
                        scale: [1, 1.06, 1],
                        rotate: 0,
                      }
                }
                exit={{
                  scale: 0,
                  opacity: 0,
                }}
                transition={
                  reduce
                    ? {
                        duration: 0.2,
                      }
                    : {
                        scale: {
                          duration: 2.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },

                        rotate: {
                          duration: 0.5,
                        },
                      }
                }
                whileHover={{
                  scale: 1.12,
                }}
                whileTap={{
                  scale: 0.92,
                }}
              >
                <WaxSeal />
              </motion.button>
            )}
          </AnimatePresence>
        </div>


        {/* HEART PARTICLES */}
        <AnimatePresence>
          {open &&
            !reduce &&
            [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="wiveliEnvelopeHeart"
                initial={{
                  opacity: 0,
                  y: 0,
                  x: 0,
                  scale: 0.6,
                }}
                animate={{
                  opacity: [0, 1, 0],

                  y:
                    -90 -
                    i * 25,

                  x:
                    (i - 1) * 55,

                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 1.6,
                  delay:
                    0.3 +
                    i * 0.12,
                }}
              >
                ♥
              </motion.span>
            ))}
        </AnimatePresence>
      </div>


      {/* REPLAY */}
      <button
        type="button"
        className="wiveliEnvelopeReplay"
        onClick={() =>
          setOpen((value) => !value)
        }
      >
        <span className="wiveliReplayIcon">
          ↻
        </span>

        {open
          ? "Seal it again"
          : "Tap the seal to open"}
      </button>
    </div>
  );
}


function WaxSeal() {
  return (
    <span className="wiveliWaxSeal">
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        <defs>
          <radialGradient
            id="wiveliWax"
            cx="38%"
            cy="34%"
            r="75%"
          >
            <stop
              offset="0"
              stopColor="#d8b3ff"
            />

            <stop
              offset="55%"
              stopColor="#a764e8"
            />

            <stop
              offset="100%"
              stopColor="#7040a5"
            />
          </radialGradient>
        </defs>

        <path
          d="M32 5c6 0 9-3 14 0s6 8 9 13 6 8 4 14-6 8-7 14-2 9-8 11-11-1-16-1-11 3-16 0-4-9-6-14-6-9-6-14 4-9 6-14 1-10 6-13 8 3 14 0z"
          fill="url(#wiveliWax)"
          stroke="rgba(74,36,112,.7)"
          strokeWidth="1"
        />

        <path
          d="M20 15c4-3 9-4 13-4"
          fill="none"
          stroke="rgba(255,255,255,.42)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M32 44c-8-5.4-13-9.6-13-15 0-3.4 2.6-6 6-6 2.4 0 4.4 1.3 7 4 2.6-2.7 4.6-4 7-4 3.4 0 6 2.6 6 6 0 5.4-5 9.6-13 15Z"
          fill="rgba(69,31,105,.52)"
        />

        <path
          d="M32 42.5c-7.2-4.9-11.5-8.7-11.5-13.3 0-2.9 2.2-5 5-5 2.1 0 3.9 1.1 6.5 3.8 2.6-2.7 4.4-3.8 6.5-3.8 2.8 0 5 2.1 5 5 0 4.6-4.3 8.4-11.5 13.3Z"
          fill="none"
          stroke="rgba(255,255,255,.42)"
          strokeWidth="1"
        />
      </svg>
    </span>
  );
}
