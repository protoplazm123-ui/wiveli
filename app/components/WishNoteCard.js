"use client";

import { motion } from "motion/react";
import { useState } from "react";

export default function WishNoteCard() {
  const [flipped, setFlipped] = useState(false);

  const toggleCard = () => {
    setFlipped((current) => !current);
  };

  return (
    <div className="wishFlipExperience">
      <motion.button
        type="button"
        className="wishFlipCard"
        onClick={toggleCard}
        initial={false}
        animate={{
          rotateY: flipped ? 180 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 17,
          mass: 0.9,
        }}
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
        aria-label={
          flipped
            ? "Flip Wish Note to front"
            : "Flip Wish Note to back"
        }
      >
        {/* FRONT */}
        <div
          className="wishFlipFace wishFlipFront"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <p>WISH NOTE ♡</p>

          <h2>
            365 days
            <br />
            of happiness.
          </h2>

          <span>
            a little world made for you
          </span>

          <i>01 / 02</i>
        </div>

        {/* BACK */}
        <div
          className="wishFlipFace wishFlipBack"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <p>JUST FOR YOU ♡</p>

          <h3>
            Make a wish.
          </h3>

          <div className="wishFlipMessage">
            Something you want to do,
            somewhere you want to go,
            or a little moment you want
            us to share.
          </div>

          <span>
            I&apos;ll be there.
          </span>

          <i>02 / 02</i>
        </div>
      </motion.button>

      <button
        type="button"
        className="wishFlipHint"
        onClick={toggleCard}
      >
        <span>↻</span>

        {flipped ? "Flip back" : "Tap to flip"}
      </button>
    </div>
  );
}
