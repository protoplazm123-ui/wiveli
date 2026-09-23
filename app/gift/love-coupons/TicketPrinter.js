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
  const [soundEnabled, setSoundEnabled] = useState(false);

  const audioContextRef = useRef(null);
  const printerSoundRef = useRef(null);
  const soundEnabledRef = useRef(false);

  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;

    if (!audioContextRef.current) {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) return null;

      audioContextRef.current = new AudioContext();
    }

    return audioContextRef.current;
  }, []);

  const stopPrinterSound = useCallback(() => {
    const active = printerSoundRef.current;

    if (!active) return;

    try {
      active.noise.stop();
    } catch {}

    try {
      active.motor.stop();
    } catch {}

    try {
      active.master.disconnect();
    } catch {}

    printerSoundRef.current = null;
  }, []);

  const playMechanicalClick = useCallback(() => {
    if (!soundEnabledRef.current) return;

    const ctx = getAudioContext();
    if (!ctx || ctx.state !== "running") return;

    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      70,
      now + 0.045
    );

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(
      0.055,
      now + 0.004
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.055
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.06);
  }, [getAudioContext]);

  const playPaperFeed = useCallback(() => {
    if (!soundEnabledRef.current) return;

    const ctx = getAudioContext();
    if (!ctx || ctx.state !== "running") return;

    const duration = 0.13;
    const buffer = ctx.createBuffer(
      1,
      Math.floor(ctx.sampleRate * duration),
      ctx.sampleRate
    );

    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i += 1) {
      const envelope = 1 - i / data.length;
      data[i] =
        (Math.random() * 2 - 1) *
        envelope *
        0.55;
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    source.buffer = buffer;

    filter.type = "bandpass";
    filter.frequency.value = 1450;
    filter.Q.value = 0.8;

    gain.gain.value = 0.035;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
  }, [getAudioContext]);

  const startPrinterSound = useCallback(async () => {
    if (
      !soundEnabledRef.current ||
      printerSoundRef.current
    ) {
      return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        return;
      }
    }

    const noiseBuffer = ctx.createBuffer(
      1,
      ctx.sampleRate * 2,
      ctx.sampleRate
    );

    const noiseData = noiseBuffer.getChannelData(0);

    for (let i = 0; i < noiseData.length; i += 1) {
      noiseData[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    const noiseFilter = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();

    noise.buffer = noiseBuffer;
    noise.loop = true;

    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 1100;
    noiseFilter.Q.value = 0.55;

    noiseGain.gain.value = 0.018;

    const motor = ctx.createOscillator();
    const motorFilter = ctx.createBiquadFilter();
    const motorGain = ctx.createGain();

    motor.type = "sawtooth";
    motor.frequency.value = 86;

    motorFilter.type = "lowpass";
    motorFilter.frequency.value = 310;

    motorGain.gain.value = 0.012;

    const master = ctx.createGain();
    master.gain.value = 0.75;

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);

    motor.connect(motorFilter);
    motorFilter.connect(motorGain);
    motorGain.connect(master);

    master.connect(ctx.destination);

    noise.start();
    motor.start();

    printerSoundRef.current = {
      noise,
      motor,
      master,
    };
  }, [getAudioContext]);

  const toggleSound = useCallback(async () => {
    if (soundEnabledRef.current) {
      soundEnabledRef.current = false;
      setSoundEnabled(false);
      stopPrinterSound();
      return;
    }

    const ctx = getAudioContext();

    if (!ctx) {
      return;
    }

    try {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
    } catch {
      return;
    }

    soundEnabledRef.current = true;
    setSoundEnabled(true);

    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(520, now);
    oscillator.frequency.setValueAtTime(
      660,
      now + 0.06
    );

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(
      0.045,
      now + 0.01
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.14
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.15);

    if (started && !finished) {
      startPrinterSound();
    }
  }, [
    finished,
    getAudioContext,
    startPrinterSound,
    started,
    stopPrinterSound,
  ]);

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
        stopPrinterSound();
        setFinished(true);
      }, 1100);

      return () => clearTimeout(doneTimer);
    }

    const timer = setTimeout(() => {
      setPrinted((value) => value + 1);

      playPaperFeed();

      setTimeout(() => {
        playMechanicalClick();
      }, 90);
    }, 720);

    return () => clearTimeout(timer);
  }, [
    started,
    printed,
    finished,
    coupons.length,
    playMechanicalClick,
    playPaperFeed,
    stopPrinterSound,
  ]);

  useEffect(() => {
    return () => {
      stopPrinterSound();

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stopPrinterSound]);

  async function startPrinting() {
    if (coupons.length === 0) return;

    if (soundEnabledRef.current) {
      await startPrinterSound();
      playPaperFeed();
      playMechanicalClick();
    }

    setPrinted(1);
    setFinished(false);
    setStarted(true);
  }

  function finishPrinting() {
    stopPrinterSound();

    if (onFinished) {
      onFinished();
    }
  }

  const printedCoupons = coupons
    .slice(0, printed)
    .map((coupon, index) => ({
      ...coupon,
      originalNumber: index + 1,
    }))
    .reverse();

  return (
    <section className="printerScene">
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

      <div className="ambient ambientOne">♡</div>
      <div className="ambient ambientTwo">✦</div>
      <div className="ambient ambientThree">♥</div>

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
              {senderName} made a little collection
              <br />
              especially for {recipientName}.
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
              One little promise after another,
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
              {coupons.length} little reasons to
              <br />
              make a memory together.
            </span>
          </>
        )}
      </div>

      <div className="printerArea">
        <div
          className={`machine ${
            started && !finished ? "working" : ""
          }`}
        >
          <div className="machineTop">
            <div className="machineLogo">
              <span>WI♡ELI</span>
              <small>LOVE COUPON MACHINE</small>
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
              <small>MADE WITH LOVE FOR</small>

              <strong>
                {recipientName || "YOU"}
              </strong>
            </div>

            <div className="printerOutput">
              <div className="slotShadow" />

              <div className="slot">
                <div className="slotInner" />
              </div>

              {started &&
                printedCoupons.length > 0 && (
                  <div className="paperViewport">
                    <div className="continuousStrip">
                      {printedCoupons.map(
                        (coupon, index) => (
                          <div
                            className={`couponSegment ${
                              index === 0
                                ? "newestSegment"
                                : ""
                            }`}
                            key={`${coupon.id}-${coupon.originalNumber}`}
                          >
                            <div className="ticketBody">
                              <small>
                                WIVELI · LOVE COUPON
                              </small>

                              <strong>
                                {coupon.title}
                              </strong>

                              <p>
                                {coupon.subtitle}
                              </p>

                              <span className="ticketHeart">
                                ♡
                              </span>
                            </div>

                            <div className="ticketStub">
                              <small>NO.</small>

                              <b>
                                {String(
                                  coupon.originalNumber
                                ).padStart(2, "0")}
                              </b>

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
                              </div>
                            </div>

                            <div className="perforation">
                              <span>✂</span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
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
              ) : finished ? (
                <button
                  type="button"
                  onClick={finishPrinting}
                >
                  SEE MY COUPONS →
                </button>
              ) : (
                <div className="printingStatus">
                  <i />
                  <span>PRINTING...</span>
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
          <div className="rollHint">
            <span>
              ONE CONTINUOUS LOVE COUPON ROLL ♡
            </span>
          </div>
        )}
      </div>

      {started && !finished && (
        <div className="paperBits">
          <i className="bit1">♡</i>
          <i className="bit2">♥</i>
          <i className="bit3">✦</i>
          <i className="bit4">♡</i>
          <i className="bit5">♥</i>
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .printerScene {
          min-height: 100svh;
          position: relative;
          overflow: hidden;

          background:
            radial-gradient(
              circle at 50% 20%,
              #f7deda 0%,
              #edc4c2 47%,
              #dba9aa 100%
            );

          color: #4b0710;

          display: grid;

          grid-template-columns:
            minmax(280px, 0.8fr)
            minmax(430px, 1.2fr);

          align-items: center;

          gap: 6vw;

          padding: 90px 8vw 70px;
        }

        /*
          SOUND SIGN
        */

        .soundSign {
          position: absolute;

          z-index: 30;

          top: 26px;
          left: 50%;

          transform: translateX(-50%)
            rotate(-1.5deg);

          min-width: 174px;

          border: 1px solid
            rgba(83, 8, 18, 0.38);

          border-radius: 3px;

          padding: 11px 15px;

          background: #f5d8d3;
          color: #5b0a15;

          box-shadow:
            0 7px 18px
              rgba(79, 7, 16, 0.12),
            inset 0 0 0 3px
              rgba(255, 255, 255, 0.22);

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 0.14em;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            color 0.2s ease;
        }

        .soundSign::before,
        .soundSign::after {
          content: "";

          position: absolute;

          top: -16px;

          width: 1px;
          height: 17px;

          background:
            rgba(83, 8, 18, 0.35);
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
            rotate(0deg)
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
            rgba(255, 221, 215, 0.75);

          animation:
            soundPulse 1.2s
            ease-in-out infinite;
        }

        /*
          LEFT COPY
        */

        .sceneCopy {
          position: relative;
          z-index: 3;
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
            clamp(55px, 6.5vw, 100px);

          line-height: 0.78;

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
              rgba(71, 5, 14, 0.22)
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

          justify-content: space-between;
          align-items: center;

          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.13);
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
            0 0 14px #f4b9b7;
        }

        .working .machineLight i {
          animation:
            blink 0.6s infinite;
        }

        .machineFace {
          position: relative;

          min-height: 560px;

          border-radius:
            8px 8px 24px 24px;

          padding:
            43px 45px 32px;

          background:
            linear-gradient(
              145deg,
              #69101c,
              #4b0711
            );

          border:
            1px solid
            rgba(44, 0, 6, 0.35);

          box-shadow:
            inset 0 1px 0
              rgba(255, 255, 255, 0.13),
            inset 0 -20px 35px
              rgba(30, 0, 5, 0.18);
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
            rgba(247, 213, 208, 0.15);

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
          PRINTER OUTPUT
        */

        .printerOutput {
          position: relative;

          height: 305px;

          margin-top: 28px;

          overflow: hidden;
        }

        .slotShadow {
          position: absolute;

          z-index: 8;

          left: 7%;
          top: 14px;

          width: 86%;
          height: 30px;

          border-radius: 50%;

          background:
            rgba(0, 0, 0, 0.42);

          filter: blur(9px);
        }

        .slot {
          position: absolute;

          z-index: 10;

          left: 5%;
          top: 0;

          width: 90%;
          height: 25px;

          border-radius: 30px;

          background: #2b0208;

          border:
            5px solid #35040b;

          box-shadow:
            inset 0 5px 7px
              rgba(0, 0, 0, 0.85),
            0 2px 0
              rgba(255, 255, 255, 0.08);
        }

        .slotInner {
          position: absolute;

          left: 4%;
          right: 4%;
          top: 5px;

          height: 4px;

          border-radius: 10px;

          background:
            rgba(0, 0, 0, 0.85);
        }

        .paperViewport {
          position: absolute;

          left: 6%;
          top: 17px;

          width: 88%;
          height: 288px;

          overflow: hidden;

          z-index: 7;
        }

        .continuousStrip {
          width: 100%;

          display: flex;

          flex-direction: column;

          filter:
            drop-shadow(
              0 15px 14px
              rgba(20, 0, 3, 0.24)
            );
        }

        .couponSegment {
          position: relative;

          flex: 0 0 138px;

          min-height: 138px;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            76px;

          background:
            linear-gradient(
              90deg,
              #f3cbc8 0%,
              #f0c1bf 100%
            );

          color: #520a14;

          border-left:
            1px solid
            rgba(91, 11, 22, 0.8);

          border-right:
            1px solid
            rgba(91, 11, 22, 0.8);
        }

        .couponSegment:first-child {
          border-top:
            1px solid
            rgba(91, 11, 22, 0.8);
        }

        .couponSegment:last-child {
          border-bottom:
            1px solid
            rgba(91, 11, 22, 0.8);
        }

        .newestSegment {
          animation:
            feedPaper 0.68s
            cubic-bezier(
              0.18,
              0.78,
              0.25,
              1
            );
        }

        .ticketBody {
          position: relative;

          padding:
            22px 22px 20px;
        }

        .ticketBody small {
          display: block;

          font-size: 6px;
          font-weight: 700;

          letter-spacing: 0.17em;
        }

        .ticketBody strong {
          display: block;

          max-width: 285px;

          margin-top: 11px;

          font-family: Georgia, serif;

          font-size:
            clamp(19px, 2vw, 27px);

          font-style: italic;

          line-height: 0.92;
        }

        .ticketBody p {
          margin:
            9px 35px 0 0;

          font-family: Georgia, serif;

          font-size: 8px;

          line-height: 1.3;

          text-transform: uppercase;
        }

        .ticketHeart {
          position: absolute;

          right: 15px;
          bottom: 14px;

          font-family: Georgia, serif;

          font-size: 23px;
        }

        .ticketStub {
          position: relative;

          border-left:
            1px dashed #690f1b;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          gap: 5px;
        }

        .ticketStub small {
          font-size: 6px;

          letter-spacing: 0.08em;
        }

        .ticketStub b {
          font-family: Georgia, serif;

          font-size: 22px;
        }

        .ticketStub::before,
        .ticketStub::after {
          content: "";

          position: absolute;

          left: -7px;

          width: 13px;
          height: 13px;

          border-radius: 50%;

          background: #590b16;
        }

        .ticketStub::before {
          top: -7px;
        }

        .ticketStub::after {
          bottom: -7px;
        }

        .barcode {
          height: 17px;

          display: flex;

          align-items: stretch;

          gap: 2px;
        }

        .barcode i {
          display: block;

          width: 1px;

          background: #5a0a15;
        }

        .barcode i:nth-child(2),
        .barcode i:nth-child(5),
        .barcode i:nth-child(8) {
          width: 2px;
        }

        .barcode i:nth-child(4),
        .barcode i:nth-child(7) {
          height: 75%;
        }

        .perforation {
          position: absolute;

          z-index: 4;

          left: 0;
          right: 0;
          bottom: -1px;

          height: 1px;

          border-bottom:
            1px dashed
            rgba(91, 11, 22, 0.65);
        }

        .perforation span {
          position: absolute;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%, -50%);

          padding: 0 7px;

          background: #f1c5c2;

          font-size: 9px;

          line-height: 1;
        }

        /*
          BOTTOM CONTROLS
        */

        .machineBottom {
          position: absolute;

          left: 45px;
          right: 45px;
          bottom: 32px;

          min-height: 78px;

          border-top:
            1px solid
            rgba(247, 213, 208, 0.18);

          padding-top: 21px;

          display: flex;

          justify-content: space-between;

          align-items: center;

          color: #f5d1cd;

          z-index: 12;
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
            rgba(0, 0, 0, 0.12);
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
            blink 0.5s infinite;
        }

        .machineFeet {
          display: flex;

          justify-content: space-between;

          padding: 0 55px;
        }

        .machineFeet i {
          width: 45px;
          height: 12px;

          background: #34040b;

          border-radius:
            0 0 10px 10px;
        }

        .rollHint {
          margin-top: 16px;

          text-align: center;

          color:
            rgba(75, 7, 16, 0.62);

          font-size: 7px;

          font-weight: 800;

          letter-spacing: 0.18em;
        }

        /*
          BACKGROUND DETAILS
        */

        .ambient {
          position: absolute;

          font-family: Georgia, serif;

          color:
            rgba(81, 7, 16, 0.13);

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
            floatBit 2s
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
          bottom: 13%;

          animation-delay:
            0.5s !important;
        }

        .bit4 {
          left: 48%;
          bottom: 8%;

          animation-delay:
            0.8s !important;
        }

        .bit5 {
          left: 46%;
          top: 18%;

          animation-delay:
            1s !important;
        }

        /*
          ANIMATIONS
        */

        @keyframes feedPaper {
          0% {
            transform:
              translateY(-138px);
          }

          72% {
            transform:
              translateY(4px);
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
            grid-template-columns: 1fr;

            gap: 45px;

            padding:
              100px 20px 70px;
          }

          .sceneCopy {
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
              95px 14px 60px;
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
            min-height: 515px;

            padding:
              35px 16px 25px;
          }

          .machineMessage strong {
            font-size: 25px;
          }

          .printerOutput {
            height: 280px;
          }

          .paperViewport {
            left: 3%;

            width: 94%;

            height: 263px;
          }

          .slot {
            left: 2%;

            width: 96%;
          }

          .couponSegment {
            flex-basis: 132px;

            min-height: 132px;

            grid-template-columns:
              minmax(0, 1fr)
              62px;
          }

          .ticketBody {
            padding:
              20px 14px 17px;
          }

          .ticketBody strong {
            font-size: 19px;
          }

          .ticketBody p {
            margin-right: 25px;

            font-size: 7px;
          }

          .ticketStub b {
            font-size: 19px;
          }

          .machineBottom {
            left: 18px;
            right: 18px;
            bottom: 24px;
          }

          .machineBottom button {
            min-width: 150px;

            padding: 0 12px;

            font-size: 7px;
          }

          .decorHeart {
            display: none;
          }

          @keyframes feedPaper {
            0% {
              transform:
                translateY(-132px);
            }

            72% {
              transform:
                translateY(4px);
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
