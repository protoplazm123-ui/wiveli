"use client";

import { motion } from "motion/react";
import { useState } from "react";

export default function WishNoteCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="wishFlipExperience">
      <motion.button
        type="button"
        className="wishFlipCard"
        onClick={() => setFlipped((value) => !value)}
        animate={{
          rotateY: flipped ? 180 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 85,
          damping: 15,
        }}
        whileHover={{
          y: -8,
        }}
        aria-label="Flip Wish Note"
      >
        <div className="wishFlipFace wishFlipFront">
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

        <div className="wishFlipFace wishFlipBack">
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
        onClick={() => setFlipped((value) => !value)}
      >
        <span>↻</span>
        {flipped ? "Flip back" : "Tap to flip"}
      </button>
    </div>
  );
}
