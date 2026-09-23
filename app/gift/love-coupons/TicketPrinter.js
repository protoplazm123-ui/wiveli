"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export default function TicketPrinter({
  coupons = [],
  senderName = "",
  recipientName = "",
  onFinished,
}) {
  const [printed, setPrinted] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] =
    useState(false);

  const audioContextRef = useRef(null);
  const soundEnabledRef = useRef(false);

  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;

    if (!audioContextRef.current) {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) return null;

      audioContextRef.current =
        new AudioContext();
    }

    return audioContextRef.current;
  }, []);

  /*
    REALISTIC TICKET MACHINE SOUND

    Instead of one constant motor hum,
    every ticket gets its own short burst:

    motor + rapid mechanical chatter +
    paper friction + final click.
  */

  const playTicketPrintSound =
    useCallback(() => {
      if (!soundEnabledRef.current) return;

      const ctx = getAudioContext();

      if (!ctx || ctx.state !== "running") {
        return;
      }

      const now = ctx.currentTime;
      const duration = 0.56;

      const master = ctx.createGain();

      master.gain.setValueAtTime(
        0.0001,
        now
      );

      master.gain.exponentialRampToValueAtTime(
        0.72,
        now + 0.018
      );

      master.gain.setValueAtTime(
        0.72,
        now + duration - 0.05
      );

      master.gain.exponentialRampToValueAtTime(
        0.0001,
        now + duration
      );

      master.connect(ctx.destination);

      /*
        MOTOR
      */

      const motor = ctx.createOscillator();
      const motorFilter =
        ctx.createBiquadFilter();
      const motorGain = ctx.createGain();

      motor.type = "sawtooth";

      motor.frequency.setValueAtTime(
        92,
        now
      );

      motor.frequency.linearRampToValueAtTime(
        116,
        now + 0.08
      );

      motor.frequency.setValueAtTime(
        108,
        now + duration - 0.08
      );

      motorFilter.type = "lowpass";
      motorFilter.frequency.value = 520;

      motorGain.gain.value = 0.035;

      motor.connect(motorFilter);
      motorFilter.connect(motorGain);
      motorGain.connect(master);

      /*
        RAPID TICKET / GEAR CHATTER
      */

      const sampleLength = Math.floor(
        ctx.sampleRate * duration
      );

      const buffer = ctx.createBuffer(
        1,
        sampleLength,
        ctx.sampleRate
      );

      const data = buffer.getChannelData(0);

      const chatterSpeed = 34;

      const samplesPerHit =
        ctx.sampleRate / chatterSpeed;

      for (
        let i = 0;
        i < sampleLength;
        i += 1
      ) {
        const phase =
          (i % samplesPerHit) /
          samplesPerHit;

        let hit = 0.12;

        if (phase < 0.17) {
          hit = 1;
        } else if (phase < 0.34) {
          hit = 0.48;
        }

        const random =
          Math.random() * 2 - 1;

        data[i] =
          random *
          hit *
          (0.72 +
            Math.random() * 0.28);
      }

      const chatter =
        ctx.createBufferSource();

      const chatterFilter =
        ctx.createBiquadFilter();

      const chatterGain =
        ctx.createGain();

      chatter.buffer = buffer;

      chatterFilter.type = "bandpass";
      chatterFilter.frequency.value = 1750;
      chatterFilter.Q.value = 0.75;

      chatterGain.gain.value = 0.095;

      chatter.connect(chatterFilter);

      chatterFilter.connect(
        chatterGain
      );

      chatterGain.connect(master);

      /*
        HIGHER MECHANICAL RATTLE
      */

      const rattle =
        ctx.createOscillator();

      const rattleFilter =
        ctx.createBiquadFilter();

      const rattleGain =
        ctx.createGain();

      rattle.type = "square";
      rattle.frequency.value = 68;

      rattleFilter.type = "highpass";
      rattleFilter.frequency.value = 340;

      rattleGain.gain.value = 0.018;

      rattle.connect(rattleFilter);

      rattleFilter.connect(
        rattleGain
      );

      rattleGain.connect(master);

      /*
        START EVERYTHING
      */

      motor.start(now);
      chatter.start(now);
      rattle.start(now);

      motor.stop(now + duration);
      chatter.stop(now + duration);
      rattle.stop(now + duration);

      /*
        LITTLE MECHANICAL CLICK
        AT THE END OF EACH TICKET
      */

      const click =
        ctx.createOscillator();

      const clickGain =
        ctx.createGain();

      const clickTime =
        now + duration - 0.025;

      click.type = "square";

      click.frequency.setValueAtTime(
        190,
        clickTime
      );

      click.frequency.exponentialRampToValueAtTime(
        58,
        clickTime + 0.045
      );

      clickGain.gain.setValueAtTime(
        0.0001,
        clickTime
      );

      clickGain.gain.exponentialRampToValueAtTime(
        0.11,
        clickTime + 0.004
      );

      clickGain.gain.exponentialRampToValueAtTime(
        0.0001,
        clickTime + 0.055
      );

      click.connect(clickGain);
      clickGain.connect(ctx.destination);

      click.start(clickTime);
      click.stop(clickTime + 0.06);
    }, [getAudioContext]);

  /*
    SOUND BUTTON
  */

  const toggleSound =
    useCallback(async () => {
      const ctx = getAudioContext();

      if (!ctx) return;

      if (ctx.state === "suspended") {
        try {
          await ctx.resume();
        } catch {
          return;
        }
      }

      if (soundEnabledRef.current) {
        soundEnabledRef.current = false;
        setSoundEnabled(false);
        return;
      }

      soundEnabledRef.current = true;
      setSoundEnabled(true);

      /*
        tiny physical button click
      */

      const now = ctx.currentTime;

      const click =
        ctx.createOscillator();

      const gain = ctx.createGain();

      click.type = "square";

      click.frequency.setValueAtTime(
        150,
        now
      );

      click.frequency.exponentialRampToValueAtTime(
        65,
        now + 0.05
      );

      gain.gain.setValueAtTime(
        0.0001,
        now
      );

      gain.gain.exponentialRampToValueAtTime(
        0.055,
        now + 0.004
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.055
      );

      click.connect(gain);
      gain.connect(ctx.destination);

      click.start(now);
      click.stop(now + 0.06);
    }, [getAudioContext]);

  /*
    PRINT ONE TICKET AT A TIME
  */

  useEffect(() => {
    if (
      !started ||
      finished ||
      coupons.length === 0
    ) {
      return;
    }

    if (printed >= coupons.length) {
      const doneTimer = setTimeout(() => {
        setFinished(true);
      }, 700);

      return () =>
        clearTimeout(doneTimer);
    }

    const delay =
      printed === 0 ? 180 : 760;

    const timer = setTimeout(() => {
      playTicketPrintSound();

      setPrinted(
        (value) => value + 1
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [
    started,
    finished,
    printed,
    coupons.length,
    playTicketPrintSound,
  ]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current
          .close()
          .catch(() => {});
      }
    };
  }, []);

  function startPrinting() {
    if (coupons.length === 0) return;

    setPrinted(0);
    setFinished(false);
    setStarted(true);
  }

  function finishPrinting() {
    if (onFinished) {
      onFinished();
    }
  }

  /*
    Newest ticket goes at the top.

    This means every new ticket physically
    pushes all previous tickets downward.
  */

  const printedCoupons = coupons
    .slice(0, printed)
    .map((coupon, index) => ({
      ...coupon,
      originalNumber: index + 1,
    }))
    .reverse();

  /*
    Approximate physical length of
    the printed strip.

    This gives the page room to grow
    while 12 tickets come out.
  */

  const stripExtra =
    printed * 260;

  return (
    <section
      className="printerScene"
      style={{
        "--strip-extra":
          `${stripExtra}px`,
      }}
    >
      <button
        type="button"
        className={`soundSign ${
          soundEnabled ? "soundOn" : ""
        }`}
        onClick={toggleSound}
        aria-pressed={soundEnabled}
      >
        <span className="soundIcon">
          {soundEnabled ? "♫" : "♪"}
        </span>

        <span>
          {soundEnabled
            ? "SOUND ON"
            : "TURN SOUND ON"}
        </span>

        <i className="soundDot" />
      </button>

      <div className="ambient ambientOne">
        ♡
      </div>

      <div className="ambient ambientTwo">
        ✦
      </div>

      <div className="ambient ambientThree">
        ♥
      </div>

      <div className="sceneCopy">
        <p>WIVELI · LOVE COUPONS</p>

        {!started ? (
          <>
            <h1>
              SOMETHING
              <br />
              <em>JUST FOR YOU.</em>
            </h1>

            <span>
              {senderName} made a little
              collection
              <br />
              especially for{" "}
              {recipientName}.
            </span>
          </>
        ) : !finished ? (
          <>
            <h1>
              PRINTING
              <br />
              <em>YOUR LOVE.</em>
            </h1>

            <span>
              One little promise after
              another,
              <br />
              all made for you ♡
            </span>
          </>
        ) : (
          <>
            <h1>
              ALL
              <br />
              <em>YOURS.</em>
            </h1>

            <span>
              {coupons.length} little
              reasons to
              <br />
              make a memory together.
            </span>
          </>
        )}
      </div>

      <div className="printerArea">
        <div
          className={`machine ${
            started && !finished
              ? "working"
              : ""
          }`}
        >
          <div className="machineTop">
            <div className="machineLogo">
              <span>WI♡ELI</span>

              <small>
                LOVE COUPON MACHINE
              </small>
            </div>

            <div className="machineLight">
              <i />

              {finished
                ? "READY"
                : started
                ? "PRINTING"
                : "WAITING"}
            </div>
          </div>

          <div className="machineFace">
            <div className="decorHeart leftHeart">
              ♡
            </div>

            <div className="decorHeart rightHeart">
              ♡
            </div>

            <div className="machineMessage">
              <small>
                MADE WITH LOVE FOR
              </small>

              <strong>
                {recipientName || "YOU"}
              </strong>
            </div>

            <div className="machineBottom">
              <div className="counter">
                <small>COUPONS</small>

                <strong>
                  {String(
                    Math.min(
                      printed,
                      coupons.length
                    )
                  ).padStart(2, "0")}

                  <span>
                    /
                    {String(
                      coupons.length
                    ).padStart(2, "0")}
                  </span>
                </strong>
              </div>

              {!started ? (
                <button
                  type="button"
                  onClick={startPrinting}
                >
                  <span>♥</span>
                  PRINT MY COUPONS
                </button>
              ) : !finished ? (
                <div className="printingStatus">
                  <i />
                  <span>
                    PRINTING...
                  </span>
                </div>
              ) : (
                <div className="printingStatus readyStatus">
                  <i />
                  <span>
                    COMPLETE
                  </span>
                </div>
              )}
            </div>

            <div className="printerOutput">
              <div className="slotShadow" />

              <div className="slot">
                <div className="slotInner" />
              </div>

              {started &&
                printedCoupons.length >
                  0 && (
                  <div className="paperViewport">
                    <div
                      key={printed}
                      className="continuousStrip"
                    >
                      {printedCoupons.map(
                        (coupon) => (
                          <div
                            className={`couponSegment ${
                              coupon.special
                                ? "specialCoupon"
                                : ""
                            }`}
                            key={`${coupon.id}-${coupon.originalNumber}`}
                          >
                            <div className="ticketBody">
                              <small>
                                WIVELI · LOVE
                                COUPON
                              </small>

                              <div className="ticketNumberTop">
                                NO.{" "}
                                {String(
                                  coupon.originalNumber
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </div>

                              <strong>
                                {coupon.title}
                              </strong>

                              <p>
                                {
                                  coupon.subtitle
                                }
                              </p>

                              <span className="ticketHeart">
                                ♡
                              </span>
                            </div>

                            <div className="ticketStub">
                              <span className="scissors">
                                ✂
                              </span>

                              <div>
                                <small>
                                  LOVE COUPON
                                </small>

                                <b>
                                  {String(
                                    coupon.originalNumber
                                  ).padStart(
                                    2,
                                    "0"
                                  )}
                                </b>
                              </div>

                              <div className="barcode">
                                <i />
                                <i />
                                <i />
                                <i />
                                <i />
                                <i />
                                <i />
                                <i />
                                <i />
                                <i />
                                <i />
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>

          <div className="machineFeet">
            <i />
            <i />
          </div>
        </div>

        {started && (
          <div className="rollEnd">
            <span>
              ONE CONTINUOUS LOVE COUPON
              ROLL ♡
            </span>

            {finished && (
              <button
                type="button"
                className="seeCouponsButton"
                onClick={finishPrinting}
              >
                SEE MY COUPONS →
              </button>
            )}
          </div>
        )}
      </div>

      {started && !finished && (
        <div className="paperBits">
          <i className="bit1">♡</i>
          <i className="bit2">♥</i>
          <i className="bit3">✦</i>
          <i className="bit4">♡</i>
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .printerScene {
          min-height: 100svh;

          position: relative;

          overflow-x: hidden;
          overflow-y: visible;

          background:
            radial-gradient(
              circle at 50% 18%,
              #f8e2de 0%,
              #efc9c6 48%,
              #dca9ab 100%
            );

          color: #4b0710;

          display: grid;

          grid-template-columns:
            minmax(280px, 0.8fr)
            minmax(430px, 1.2fr);

          align-items: start;

          gap: 6vw;

          padding:
            130px 8vw 90px;
        }

        /*
          SOUND SIGN
        */

        .soundSign {
          position: absolute;

          z-index: 100;

          top: 28px;
          left: 50%;

          transform:
            translateX(-50%)
            rotate(-1.5deg);

          min-width: 178px;

          border:
            1px solid
            rgba(83, 8, 18, 0.4);

          border-radius: 3px;

          padding: 11px 15px;

          background: #f5d8d3;
          color: #5b0a15;

          box-shadow:
            0 7px 18px
              rgba(79, 7, 16, 0.12),
            inset 0 0 0 3px
              rgba(
                255,
                255,
                255,
                0.22
              );

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 8px;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 0.14em;

          cursor: pointer;

          transition:
            0.2s ease;
        }

        .soundSign::before,
        .soundSign::after {
          content: "";

          position: absolute;

          top: -16px;

          width: 1px;
          height: 17px;

          background:
            rgba(
              83,
              8,
              18,
              0.35
            );
        }

        .soundSign::before {
          left: 28px;

          transform: rotate(12deg);
        }

        .soundSign::after {
          right: 28px;

          transform: rotate(-12deg);
        }

        .soundSign:hover {
          transform:
            translateX(-50%)
            translateY(-2px);
        }

        .soundSign.soundOn {
          background: #650c18;
          color: #f7d9d4;
        }

        .soundIcon {
          font-family: Georgia, serif;
          font-size: 15px;
        }

        .soundDot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: currentColor;

          opacity: 0.35;
        }

        .soundOn .soundDot {
          opacity: 1;

          box-shadow:
            0 0 9px
            rgba(
              255,
              221,
              215,
              0.8
            );

          animation:
            soundPulse
            1.1s
            ease-in-out
            infinite;
        }

        /*
          COPY
        */

        .sceneCopy {
          position: sticky;

          top: 150px;

          z-index: 3;

          padding-top: 70px;
        }

        .sceneCopy > p {
          margin: 0 0 20px;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.22em;
        }

        .sceneCopy h1 {
          margin: 0;

          font-family: Georgia, serif;

          font-size:
            clamp(
              55px,
              6.2vw,
              96px
            );

          line-height: 0.79;

          letter-spacing: -0.065em;
        }

        .sceneCopy h1 em {
          font-weight: 400;
        }

        .sceneCopy > span {
          display: block;

          margin-top: 30px;

          font-family: Georgia, serif;

          font-size: 15px;

          line-height: 1.6;
        }

        /*
          MACHINE
        */

        .printerArea {
          width: min(100%, 590px);

          justify-self: center;

          position: relative;

          z-index: 4;
        }

        .machine {
          width: 100%;

          position: relative;

          filter:
            drop-shadow(
              0 35px 35px
              rgba(
                71,
                5,
                14,
                0.22
              )
            );
        }

        .machineTop {
          min-height: 78px;

          border-radius:
            28px 28px 8px 8px;

          background: #5b0915;
          color: #f6d4cf;

          padding: 20px 25px;

          display: flex;

          justify-content:
            space-between;

          align-items: center;

          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              0.13
            );
        }

        .machineLogo {
          display: flex;

          flex-direction: column;

          gap: 4px;
        }

        .machineLogo span {
          font-family: Georgia, serif;

          font-size: 23px;
          font-weight: 700;
        }

        .machineLogo small {
          font-size: 6px;

          letter-spacing: 0.2em;

          opacity: 0.7;
        }

        .machineLight {
          display: flex;

          align-items: center;

          gap: 7px;

          font-size: 7px;

          letter-spacing: 0.15em;
        }

        .machineLight i {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          background: #f4b9b7;

          box-shadow:
            0 0 14px
            #f4b9b7;
        }

        .working
          .machineLight
          i {
          animation:
            blink
            0.45s
            infinite;
        }

        .machineFace {
          position: relative;

          min-height: 350px;

          border-radius:
            8px 8px 24px 24px;

          padding:
            42px 45px 55px;

          background:
            linear-gradient(
              145deg,
              #69101c,
              #4b0711
            );

          border:
            1px solid
            rgba(
              44,
              0,
              6,
              0.35
            );

          box-shadow:
            inset 0 1px 0
              rgba(
                255,
                255,
                255,
                0.13
              ),
            inset 0 -20px 35px
              rgba(
                30,
                0,
                5,
                0.18
              );
        }

        .machineMessage {
          text-align: center;

          color: #f5d1cd;
        }

        .machineMessage small {
          display: block;

          font-size: 7px;

          letter-spacing: 0.22em;
        }

        .machineMessage strong {
          display: block;

          margin-top: 6px;

          font-family: Georgia, serif;

          font-size: 31px;

          font-style: italic;

          font-weight: 400;
        }

        .decorHeart {
          position: absolute;

          color:
            rgba(
              247,
              213,
              208,
              0.15
            );

          font-family: Georgia, serif;

          font-size: 48px;
        }

        .leftHeart {
          left: 22px;
          top: 33px;

          transform: rotate(-15deg);
        }

        .rightHeart {
          right: 22px;
          top: 39px;

          transform: rotate(13deg);
        }

        /*
          MACHINE CONTROLS
        */

        .machineBottom {
          margin-top: 72px;

          min-height: 75px;

          border-top:
            1px solid
            rgba(
              247,
              213,
              208,
              0.18
            );

          padding-top: 20px;

          display: flex;

          justify-content:
            space-between;

          align-items: center;

          color: #f5d1cd;
        }

        .counter small {
          display: block;

          font-size: 6px;

          letter-spacing: 0.18em;
        }

        .counter strong {
          font-family: Georgia, serif;

          font-size: 27px;
        }

        .counter strong span {
          opacity: 0.45;

          font-size: 13px;
        }

        .machineBottom button {
          border: none;

          min-width: 190px;

          height: 47px;

          border-radius: 100px;

          background: #f2c7c4;
          color: #4d0711;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 0.1em;

          cursor: pointer;

          padding: 0 20px;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .machineBottom button:hover {
          transform: scale(1.03);

          box-shadow:
            0 8px 20px
            rgba(
              0,
              0,
              0,
              0.12
            );
        }

        .machineBottom button span {
          margin-right: 7px;
        }

        .printingStatus {
          display: flex;

          align-items: center;

          gap: 9px;

          font-size: 7px;

          letter-spacing: 0.16em;
        }

        .printingStatus i {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          background: #f2c7c4;

          animation:
            blink
            0.45s
            infinite;
        }

        .readyStatus i {
          animation: none;
        }

        /*
          OUTPUT SLOT
        */

        .printerOutput {
          position: absolute;

          z-index: 25;

          left: 0;
          right: 0;

          bottom: -13px;

          height: 35px;

          overflow: visible;
        }

        .slotShadow {
          position: absolute;

          z-index: 30;

          left: 14%;
          top: 9px;

          width: 72%;
          height: 25px;

          border-radius: 50%;

          background:
            rgba(
              0,
              0,
              0,
              0.48
            );

          filter: blur(8px);
        }

        .slot {
          position: absolute;

          z-index: 40;

          left: 13%;
          top: 0;

          width: 74%;
          height: 25px;

          border-radius: 30px;

          background: #2b0208;

          border:
            5px solid #35040b;

          box-shadow:
            inset 0 5px 7px
              rgba(
                0,
                0,
                0,
                0.85
              ),
            0 2px 0
              rgba(
                255,
                255,
                255,
                0.08
              );
        }

        .slotInner {
          position: absolute;

          left: 4%;
          right: 4%;
          top: 5px;

          height: 4px;

          border-radius: 10px;

          background:
            rgba(
              0,
              0,
              0,
              0.9
            );
        }

        /*
          THE LONG PAPER STRIP
        */

        .paperViewport {
          position: absolute;

          z-index: 35;

          left: 50%;
          top: 17px;

          width: 220px;

          transform:
            translateX(-50%);

          overflow: visible;
        }

        .continuousStrip {
          width: 100%;

          display: flex;

          flex-direction: column;

          filter:
            drop-shadow(
              0 13px 10px
              rgba(
                40,
                0,
                6,
                0.2
              )
            );

          animation:
            feedStrip
            0.64s
            cubic-bezier(
              0.18,
              0.78,
              0.25,
              1
            );
        }

        /*
          VERTICAL / PORTRAIT COUPON
        */

        .couponSegment {
          position: relative;

          width: 220px;
          height: 260px;

          flex:
            0 0 260px;

          display: grid;

          grid-template-rows:
            minmax(0, 1fr)
            60px;

          background:
            linear-gradient(
              145deg,
              #f5d2cf,
              #efbfbd
            );

          color: #520a14;

          border-left:
            1px solid
            rgba(
              91,
              11,
              22,
              0.75
            );

          border-right:
            1px solid
            rgba(
              91,
              11,
              22,
              0.75
            );
        }

        .couponSegment:first-child {
          border-top:
            1px solid
            rgba(
              91,
              11,
              22,
              0.75
            );
        }

        .couponSegment:last-child {
          border-bottom:
            1px solid
            rgba(
              91,
              11,
              22,
              0.75
            );
        }

        .specialCoupon {
          background:
            linear-gradient(
              145deg,
              #6b101c,
              #4b0711
            );

          color: #f5d1cd;
        }

        .ticketBody {
          position: relative;

          padding:
            25px 22px 20px;
        }

        .ticketBody small {
          display: block;

          font-size: 6px;
          font-weight: 800;

          letter-spacing: 0.17em;
        }

        .ticketNumberTop {
          position: absolute;

          top: 25px;
          right: 20px;

          font-size: 6px;
          font-weight: 800;

          letter-spacing: 0.12em;
        }

        .ticketBody strong {
          display: block;

          margin-top: 38px;

          max-width: 175px;

          font-family: Georgia, serif;

          font-size: 27px;

          font-style: italic;

          line-height: 0.94;
        }

        .ticketBody p {
          margin:
            13px 0 0;

          max-width: 165px;

          font-family: Georgia, serif;

          font-size: 8px;

          line-height: 1.4;

          text-transform: uppercase;
        }

        .ticketHeart {
          position: absolute;

          right: 19px;
          bottom: 15px;

          font-family: Georgia, serif;

          font-size: 25px;
        }

        /*
          BOTTOM STUB
        */

        .ticketStub {
          position: relative;

          border-top:
            1px dashed
            currentColor;

          padding: 12px 17px;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 10px;
        }

        .ticketStub::before,
        .ticketStub::after {
          content: "";

          position: absolute;

          top: -7px;

          width: 13px;
          height: 13px;

          border-radius: 50%;

          background: #dca9ab;
        }

        .ticketStub::before {
          left: -7px;
        }

        .ticketStub::after {
          right: -7px;
        }

        .ticketStub > div:first-of-type {
          display: flex;

          flex-direction: column;

          gap: 2px;
        }

        .ticketStub small {
          font-size: 5px;

          letter-spacing: 0.13em;
        }

        .ticketStub b {
          font-family: Georgia, serif;

          font-size: 18px;
        }

        .scissors {
          position: absolute;

          left: 50%;
          top: 0;

          transform:
            translate(
              -50%,
              -50%
            );

          padding: 0 6px;

          background: #f1c6c3;

          font-size: 9px;
        }

        .specialCoupon
          .scissors {
          background: #5c0a16;
        }

        /*
          BARCODE
        */

        .barcode {
          height: 27px;

          display: flex;

          align-items: stretch;

          gap: 2px;
        }

        .barcode i {
          display: block;

          width: 1px;

          background:
            currentColor;
        }

        .barcode i:nth-child(2),
        .barcode i:nth-child(5),
        .barcode i:nth-child(8),
        .barcode i:nth-child(10) {
          width: 2px;
        }

        .barcode i:nth-child(4),
        .barcode i:nth-child(7) {
          height: 72%;
        }

        /*
          MACHINE FEET
        */

        .machineFeet {
          display: flex;

          justify-content:
            space-between;

          padding: 0 55px;
        }

        .machineFeet i {
          width: 45px;
          height: 12px;

          background: #34040b;

          border-radius:
            0 0 10px 10px;
        }

        /*
          END OF THE LONG STRIP

          This moves downward as more
          tickets are printed.
        */

        .rollEnd {
          margin-top:
            calc(
              var(
                  --strip-extra,
                  0px
                ) +
                48px
            );

          text-align: center;

          display: flex;

          flex-direction: column;

          align-items: center;

          gap: 22px;

          color:
            rgba(
              75,
              7,
              16,
              0.66
            );

          font-size: 7px;

          font-weight: 800;

          letter-spacing: 0.18em;

          transition:
            margin-top
            0.6s ease;
        }

        .seeCouponsButton {
          border: none;

          min-width: 230px;

          min-height: 52px;

          padding: 0 28px;

          border-radius: 100px;

          background: #650c18;
          color: #f8dad6;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 0.12em;

          cursor: pointer;

          box-shadow:
            0 14px 28px
            rgba(
              85,
              7,
              18,
              0.18
            );

          transition:
            transform
            0.2s ease;
        }

        .seeCouponsButton:hover {
          transform: scale(1.04);
        }

        /*
          BACKGROUND
        */

        .ambient {
          position: absolute;

          font-family: Georgia, serif;

          color:
            rgba(
              81,
              7,
              16,
              0.13
            );

          pointer-events: none;
        }

        .ambientOne {
          font-size: 100px;

          left: 4%;
          bottom: 5%;

          transform: rotate(-15deg);
        }

        .ambientTwo {
          font-size: 70px;

          right: 3%;
          top: 8%;

          transform: rotate(15deg);
        }

        .ambientThree {
          font-size: 36px;

          left: 46%;
          top: 8%;
        }

        .paperBits i {
          position: absolute;

          z-index: 5;

          color: #6a101c;

          font-style: normal;

          animation:
            floatBit
            2s
            ease-in-out
            infinite alternate;
        }

        .bit1 {
          right: 11%;
          top: 22%;
        }

        .bit2 {
          right: 6%;
          top: 42%;

          animation-delay:
            0.3s !important;
        }

        .bit3 {
          right: 15%;
          top: 70%;

          animation-delay:
            0.5s !important;
        }

        .bit4 {
          left: 48%;
          top: 35%;

          animation-delay:
            0.8s !important;
        }

        /*
          ANIMATIONS
        */

        @keyframes feedStrip {
          0% {
            transform:
              translateY(-260px);
          }

          78% {
            transform:
              translateY(5px);
          }

          100% {
            transform:
              translateY(0);
          }
        }

        @keyframes blink {
          50% {
            opacity: 0.25;
          }
        }

        @keyframes soundPulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.45);
          }
        }

        @keyframes floatBit {
          from {
            transform:
              translateY(0)
              rotate(-8deg);
          }

          to {
            transform:
              translateY(-18px)
              rotate(12deg);
          }
        }

        /*
          TABLET
        */

        @media (max-width: 900px) {
          .printerScene {
            grid-template-columns:
              1fr;

            gap: 45px;

            padding:
              105px 20px 80px;
          }

          .sceneCopy {
            position: relative;

            top: auto;

            padding-top: 20px;

            text-align: center;
          }

          .sceneCopy h1 {
            font-size: 62px;
          }

          .printerArea {
            max-width: 540px;
          }
        }

        /*
          PHONE
        */

        @media (max-width: 520px) {
          .printerScene {
            padding:
              95px 14px 65px;
          }

          .soundSign {
            top: 24px;

            min-width: 165px;

            padding:
              10px 13px;
          }

          .sceneCopy h1 {
            font-size: 50px;
          }

          .sceneCopy > span {
            font-size: 13px;
          }

          .machineTop {
            min-height: 70px;

            padding:
              18px 17px;
          }

          .machineLogo span {
            font-size: 20px;
          }

          .machineFace {
            min-height: 330px;

            padding:
              35px 18px 48px;
          }

          .machineMessage strong {
            font-size: 25px;
          }

          .machineBottom {
            margin-top: 62px;
          }

          .machineBottom button {
            min-width: 150px;

            padding: 0 12px;

            font-size: 7px;
          }

          .decorHeart {
            display: none;
          }

          .paperViewport {
            width: 190px;
          }

          .couponSegment {
            width: 190px;

            height: 240px;

            flex-basis: 240px;

            grid-template-rows:
              minmax(0, 1fr)
              55px;
          }

          .ticketBody {
            padding:
              21px 18px 16px;
          }

          .ticketNumberTop {
            top: 21px;
            right: 16px;
          }

          .ticketBody strong {
            margin-top: 34px;

            font-size: 23px;

            max-width: 150px;
          }

          .ticketBody p {
            max-width: 145px;

            font-size: 7px;
          }

          .ticketHeart {
            right: 15px;
            bottom: 12px;
          }

          .ticketStub {
            padding:
              10px 14px;
          }

          @keyframes feedStrip {
            0% {
              transform:
                translateY(-240px);
            }

            78% {
              transform:
                translateY(5px);
            }

            100% {
              transform:
                translateY(0);
            }
          }
        }
      `}</style>
    </section>
  );
}
