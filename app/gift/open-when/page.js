"use client";

import previewStyles from "./preview.module.css";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Bounds,
  useBounds,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { clone } from "three/addons/utils/SkeletonUtils.js";

const MODEL_URL = "/assets/new-boy.glb";

useGLTF.preload(MODEL_URL);

const FALLBACK = {
  recipient: "Masha",
  sender: "Alex",
  theme: {
    id: "cosmic",
    accent: "#8c63c7",
    customBackground: null,
  },
  moments: [
    {
      id: "miss-me",
      title: "YOU MISS ME",
      message:
        "If you're opening this, I wish I could be right there with you. Keep this little piece of me close until I am. ♡",
      photo: null,
      voice: null,
      video: null,
      place: "",
      date: "",
      time: "",
      interaction: { enabled: false },
    },
    {
      id: "movie",
      title: "YOU MISS OUR MOVIE NIGHTS",
      message:
        "Remember this night? I still think about how simple and perfect it felt.",
      photo: null,
      voice: null,
      video: null,
      place: "Our cinema",
      date: "September 27",
      time: "19:30",
      interaction: {
        enabled: true,
        type: "movie",
        question: "WOULD YOU GO TO THE MOVIES WITH ME AGAIN?",
        text: "One more movie night. Just us.",
        button: "YES, LET'S DO IT ♡",
        response: "Masha wants to go to the movies with you again ♡",
      },
    },
  ],
};

const POSITIONS = [
  { x: 81, y: 24, r: -8 },
  { x: 88, y: 48, r: 7 },
  { x: 77, y: 71, r: -4 },
  { x: 91, y: 78, r: 9 },
  { x: 68, y: 85, r: -7 },
  { x: 92, y: 31, r: 4 },
  { x: 56, y: 82, r: 6 },
  { x: 69, y: 16, r: -5 },
];

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Model loading failed:", error);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function LoadingScreen({ failed = false }) {
  return (
    <div
      role={failed ? "alert" : "status"}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background:
          "linear-gradient(145deg, #fff1f5 0%, #f8d5e3 50%, #e8d9f5 100%)",
        color: "#79516e",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 30,
          letterSpacing: "0.08em",
        }}
      >
        WI♥ELI
      </div>

      <div style={{ fontSize: 13 }}>
        {failed
          ? "We couldn’t load your little world."
          : "Preparing a little something for you…"}
      </div>

      {failed && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            border: "1px solid #79516e",
            borderRadius: 999,
            background: "transparent",
            color: "#79516e",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}

function WiveliModel({ onReady }) {
  const group = useRef();
  const bounds = useBounds();
  const { size } = useThree();
  const { scene: originalScene, animations } = useGLTF(MODEL_URL);

  const scene = useMemo(() => {
    const copy = clone(originalScene);

    copy.traverse((object) => {
      if (!object.isMesh) return;

      const prepareMaterial = (original) => {
        const material = original.clone();

        if ("metalness" in material) {
          material.metalness = 0;
        }

        if ("roughness" in material) {
          const name = material.name || "";

          material.roughness = /EyeIris|EyeHighlight/i.test(name)
            ? 0.4
            : /HAIR/i.test(name)
            ? 0.75
            : 0.85;
        }

        if ("clearcoat" in material) {
          material.clearcoat = 0;
        }

        material.needsUpdate = true;
        return material;
      };

      if (object.material) {
        object.material = Array.isArray(object.material)
          ? object.material.map(prepareMaterial)
          : prepareMaterial(object.material);
      }

      object.frustumCulled = false;
    });

    return copy;
  }, [originalScene]);

  const { actions, mixer } = useAnimations(animations, group);

  useLayoutEffect(() => {
    const action = actions["Action"];

    if (action) {
      action.reset().play();
      mixer.update(0);
    }

    // Дополнительного поворота вправо больше нет.
    // Используем исходное положение модели.
    scene.updateMatrixWorld(true);

    return () => {
      action?.stop();
    };
  }, [actions, mixer, scene]);

  useLayoutEffect(() => {
    scene.updateMatrixWorld(true);
    bounds.refresh(scene).clip().fit();
  }, [bounds, scene, size.width, size.height]);

  useEffect(() => {
    let secondFrame = 0;

    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(onReady);
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [onReady]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

function NewBoyScene({ onReady, onError }) {
  return (
    <div className="owNewBoyCanvas" aria-hidden="true">
      <ModelErrorBoundary onError={onError}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{
            position: [0, 0, 7],
            fov: 35,
          }}
          gl={{
            alpha: true,
            antialias: true,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <hemisphereLight args={["#fff5ed", "#c9bddc", 1.5]} />

          <directionalLight
            position={[3, 5, 6]}
            intensity={2}
            color="#fff0e3"
          />

          <directionalLight
            position={[-4, 2, 4]}
            intensity={0.8}
            color="#e7e0ff"
          />

          <Suspense fallback={null}>
            <Bounds margin={1.2}>
              <WiveliModel onReady={onReady} />
            </Bounds>
          </Suspense>
        </Canvas>
      </ModelErrorBoundary>
    </div>
  );
}

function CosmicWorld({ onReady, onError }) {
  return (
    <div className="owrCosmicWorld">
      <div className="owrCosmicGlow owrCosmicGlowOne" />
      <div className="owrCosmicGlow owrCosmicGlowTwo" />
      <div className="owrCosmicDust" />

      <div className="owNewComposition">
        <div className="owNewOpen">OPEN</div>
        <NewBoyScene onReady={onReady} onError={onError} />
      </div>

      <div className="owrOrbit owrOrbitOne" />
      <div className="owrOrbit owrOrbitTwo" />

      <span className="owrCosmicSpark owrSparkOne">✦</span>
      <span className="owrCosmicSpark owrSparkTwo">✧</span>
      <span className="owrCosmicSpark owrSparkThree">✦</span>
    </div>
  );
}

export default function OpenWhenGiftPage({giftId=null}) {
  const [gift, setGift] = useState(FALLBACK);
  const [loaded, setLoaded] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState(false);

  const [opened, setOpened] = useState([]);
  const [responses, setResponses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [focused, setFocused] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [responseSent, setResponseSent] = useState(false);

  const handleModelReady = useCallback(() => {
    setModelReady(true);
  }, []);

  const handleModelError = useCallback(() => {
    setModelError(true);
  }, []);

  const [claimToken,setClaimToken]=useState(''),[error,setError]=useState(''),[notice,setNotice]=useState(''),[saving,setSaving]=useState(false),[refresh,setRefresh]=useState(0);
  const savingRef=useRef(false);
  const [reply,setReply]=useState({note:'',date:'',time:'',place:''});
  useEffect(()=>{
    if(!giftId){setLoaded(true);return;}
    const token=new URLSearchParams(window.location.search).get('claim')||'';setClaimToken(token);let live=true;const controller=new AbortController();setError('');
    fetch(`/api/gifts/${encodeURIComponent(giftId)}/open-when/media`,{headers:token?{'x-wiveli-gift-token':token}:{},cache:'no-store',signal:controller.signal}).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error||'Could not open this gift.');return d;}).then(d=>{if(!live)return;setGift(d.gift);setOpened((d.gift.openedMoments||[]).map(x=>x.momentId));setResponses(d.gift.responses||[]);setLoaded(true);setNotice(d.failed?'Some files did not load. Please use Refresh files.':'');fetch(`/api/gifts/${encodeURIComponent(giftId)}/opened`,{method:'POST',headers:token?{'x-wiveli-gift-token':token}:{}}).catch(()=>{});}).catch(e=>{if(live)setError(e.message);});
    const timer=setTimeout(()=>{if(live)setRefresh(v=>v+1);},45*60*1000);
    return()=>{live=false;controller.abort();clearTimeout(timer);};
  },[giftId,refresh]);
  useEffect(()=>{if(!loaded||modelReady||modelError)return;const timer=setTimeout(()=>setModelError(true),15000);return()=>clearTimeout(timer);},[loaded,modelReady,modelError]);
  async function saveAction(action,momentId){
    if(!giftId)return {preview:true};
    const r=await fetch(`/api/gifts/${encodeURIComponent(giftId)}/open-when/events`,{method:'POST',headers:{'Content-Type':'application/json',...(claimToken?{'x-wiveli-gift-token':claimToken}:{})},body:JSON.stringify({action,momentId:String(momentId),...(action==='respond'?reply:{})})});const d=await r.json();if(!r.ok)throw Error(d.error||'Could not save. Please try again.');
    if(d.openedMoments)setOpened(d.openedMoments.map(x=>x.momentId));if(d.responses)setResponses(d.responses);return d;
  }

  const selected = useMemo(
    () =>
      gift.moments.find(
        (moment) => String(moment.id) === String(selectedId)
      ),
    [gift, selectedId]
  );

  const theme = gift.theme?.id || "cosmic";
  const accent = gift.theme?.accent || "#8c63c7";
  const pageReady = loaded && (theme !== "cosmic" || modelReady || modelError);

  const isOpened = (id) =>
    opened.some((item) => String(item) === String(id));

  const hasResponded = (id) =>
    responses.some((item) => String(item.momentId) === String(id));

  const chooseMoment = (moment) => {
    if(savingRef.current)return;setReply({note:'',date:'',time:'',place:''});setNotice('');
    setSelectedId(moment.id);
    setShowExtras(false);
    setFlipped(false);
    setResponseSent(hasResponded(moment.id));
    requestAnimationFrame(() => setFocused(true));
  };

  const flipCard=async()=>{
    if(!selected||savingRef.current)return;
    if(flipped){setFlipped(false);return;}
    if(isOpened(selected.id)){setFlipped(true);return;}
    savingRef.current=true;setSaving(true);setNotice('');
    try{const d=await saveAction('open',selected.id);if(d.preview)setOpened(old=>[...old,selected.id]);setFlipped(true);}catch(e){setNotice(e.message);}finally{savingRef.current=false;setSaving(false);}
  };
  const sendResponse=async()=>{
    if(!selected?.interaction?.enabled||hasResponded(selected.id)||responseSent||savingRef.current)return;
    savingRef.current=true;setSaving(true);setNotice('');
    try{const d=await saveAction('respond',selected.id);if(d.preview){setNotice('Preview only — no reply was sent.');}else{setResponseSent(true);setNotice('Your reply was saved in the sender’s Inbox.');}}catch(e){setNotice(e.message);}finally{savingRef.current=false;setSaving(false);}
  };

  const returnCard = () => {
    if(savingRef.current)return;
    setShowExtras(false);
    setFlipped(false);

    setTimeout(() => {
      setFocused(false);
      setTimeout(() => setSelectedId(null), 400);
    }, 100);
  };

  const allOpened =
    gift.moments.length > 0 &&
    gift.moments.every((moment) => isOpened(moment.id));

  const customBackground = gift.theme?.customBackground;
  const customIsVideo =
    typeof customBackground === "string" &&
    (gift.theme?.backgroundMimeType?.startsWith("video/") || customBackground.startsWith("data:video"));

  if(error)return <main style={{padding:40}}><h1>Could not open your gift</h1><p>{error}</p><button onClick={()=>setRefresh(v=>v+1)}>TRY AGAIN</button></main>;
  if (!loaded) return <LoadingScreen />;

  return (
    <>
      {!pageReady && <LoadingScreen failed={modelError} />}
      {(notice||saving||!giftId)&&<div className="owCloudStatus" role="status">{saving?'Saving…':notice||'DEMO PREVIEW · Nothing is sent.'}</div>}
      <style jsx>{`.owCloudStatus{position:fixed;z-index:10000;bottom:16px;left:5%;width:90%;box-sizing:border-box;background:#fff8f2;color:#693743;padding:14px;border:1px solid #d8c2c2;border-radius:16px;font:14px/1.5 Arial,sans-serif;}.owReplyFields{display:grid;gap:12px;text-align:left;margin:20px 0;}.owReplyFields input,.owReplyFields textarea{box-sizing:border-box;width:100%;padding:12px;border:1px solid #bba8b7;border-radius:10px;background:#fffaf7;color:#59333f;font:16px/1.4 Arial,sans-serif;}.owReplyFields label{font:12px Arial,sans-serif;}`}</style>

      <main
        className={`owrPage owrTheme-${theme} ${
          focused ? "owrHasFocus" : ""
        }`}
        aria-hidden={!pageReady}
        style={{
          "--owr-accent": accent,
          visibility: pageReady ? "visible" : "hidden",
        }}
      >
        {theme === "cosmic" && !modelError && (
          <CosmicWorld
            onReady={handleModelReady}
            onError={handleModelError}
          />
        )}

        {theme === "custom" && customBackground && (
          customIsVideo ? (
            <video
              className="owrBackground"
              src={customBackground}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <div
              className="owrBackground owrCustomImage"
              style={{
                backgroundImage: `url("${customBackground}")`,
              }}
            />
          )
        )}

        {theme !== "cosmic" &&
          !(theme === "custom" && customBackground) && (
            <div className="owrGeneratedWorld">
              <div className="owrWorldOrb owrOrbOne" />
              <div className="owrWorldOrb owrOrbTwo" />
              <div className="owrWorldOrb owrOrbThree" />

              {theme === "romantic" && (
                <div className="owrRomanticHearts">
                  <i>♡</i><i>♡</i><i>♡</i><i>♡</i><i>♡</i>
                </div>
              )}

              {theme === "tech" && (
                <div className="owrTechGrid">
                  <span>OPEN / WHEN</span>
                  <span>01 — MEMORY SYSTEM</span>
                </div>
              )}

              {theme === "dreamy" && (
                <div className="owrClouds">
                  <i /><i /><i />
                </div>
              )}

              {theme === "custom" && (
                <div className="owrCustomSymbol">∞</div>
              )}
            </div>
          )}

        <div className="owrShade" />
        <div className="owrStars" />

        <header className="owrHeader">
          <a href="/" className="owrLogo">
            WI<span>♥</span>ELI
          </a>
          <span>
            {theme === "romantic"
              ? "MADE WITH LOVE"
              : theme === "tech"
              ? "PERSONAL MEMORY SYSTEM"
              : theme === "dreamy"
              ? "A LITTLE WORLD FOR YOU"
              : theme === "custom"
              ? "MADE JUST FOR YOU"
              : "A LITTLE SOMETHING FOR YOU"}
          </span>
        </header>

        <div className="owrHint">
          <span>FROM {gift.sender || "SOMEONE SPECIAL"}</span>{giftId&&<button disabled={saving} onClick={()=>setRefresh(v=>v+1)}>REFRESH FILES ↻</button>}
          <p>
            {theme === "romantic"
              ? "For every moment you need a little bit of me."
              : theme === "tech"
              ? "Select a moment."
              : theme === "dreamy"
              ? "Choose whatever your heart needs."
              : "Choose the moment you need."}
          </p>
        </div>

        <section className="owrUniverse">
          <div className="owrBurstPoint">
            <i /><i /><i />
          </div>

          {gift.moments.map((moment, index) => {
            const position = POSITIONS[index % POSITIONS.length];
            const openedMoment = isOpened(moment.id);

            return (
              <button
                type="button"
                key={moment.id}
                className={`owrFloatingCard ${
                  openedMoment ? "isOpened" : ""
                }`}
                style={{
                  "--owr-x": `${position.x}%`,
                  "--owr-y": `${position.y}%`,
                  "--owr-r": `${position.r}deg`,
                  "--owr-delay": `${index * -0.7}s`,
                }}
                onClick={() => chooseMoment(moment)}
              >
                {openedMoment ? (
                  <div className="owrMemoryCard">
                    {moment.photo ? (
                      <img src={moment.photo} alt="" />
                    ) : (
                      <div className="owrMemoryFallback">
                        <span>♡</span>
                      </div>
                    )}
                    <div>
                      <small>OPENED ♡</small>
                      <strong>{moment.title}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="owrClosedCard">
                    <div className="owrCardStar">
                      {theme === "tech" ? "◇" : "✦"}
                    </div>
                    <small>OPEN WHEN</small>
                    <strong>{moment.title}</strong>
                    <span>TAP TO OPEN</span>
                  </div>
                )}
              </button>
            );
          })}
        </section>

        {allOpened && !focused && (
          <div className="owrAllOpened">
            <span>YOU'VE OPENED THEM ALL.</span>
            <p>But they're still here whenever you need them. ♡</p>
          </div>
        )}

        {selected && (
          <section
            className={`${previewStyles.preview} owrFocusLayer ${
              focused ? "isVisible" : ""
            }`}
          >
            <button
              type="button"
              className="owrBack"
              onClick={returnCard}
            >
              ← BACK TO MY MOMENTS
            </button>

            <div className="owrFocusGlow" />

            <div className={`owrFocusArea ${flipped && selected.interaction?.enabled ? previewStyles.withQuestion : ""}`}>
              <button
                type="button"
                className={`owrBigCard ${
                  flipped ? "isFlipped" : ""
                }`}
                onClick={flipCard}
              >
                <div className="owrBigCardInner">
                  <div className="owrBigFront">
                    <span className="owrFrontNumber">
                      {String(
                        gift.moments.findIndex(
                          (item) =>
                            String(item.id) === String(selected.id)
                        ) + 1
                      ).padStart(2, "0")}
                    </span>

                    <span className="owrFrontStar">
                      {theme === "tech" ? "◇" : "✦"}
                    </span>

                    <div>
                      <small>OPEN WHEN</small>
                      <h1>{selected.title}</h1>
                    </div>

                    <span className="owrTap">TAP TO TURN OVER</span>
                  </div>

                  <div className="owrBigBack">
                    <span className="owrBackLabel">JUST FOR YOU ♡</span>

                    <p>
                      {selected.message ||
                        "There is something I wanted you to remember when you opened this."}
                    </p>

                    {(selected.date ||
                      selected.time ||
                      selected.place) && (
                      <div className="owrMeta">
                        {selected.date && (
                          <div>
                            <span>DATE</span>
                            <strong>{selected.date}</strong>
                          </div>
                        )}
                        {selected.time && (
                          <div>
                            <span>TIME</span>
                            <strong>{selected.time}</strong>
                          </div>
                        )}
                        {selected.place && (
                          <div>
                            <span>PLACE</span>
                            <strong>{selected.place}</strong>
                          </div>
                        )}
                      </div>
                    )}

                    <span className="owrBackHeart">♡</span>
                  </div>
                </div>
              </button>

              {flipped && (
                <div className="owrAfterCard">
                  {(selected.photo ||
                    selected.voice ||
                    selected.video || selected.gift) && (
                    <button
                      type="button"
                      onClick={() => setShowExtras((value) => !value)}
                    >
                      {showExtras ? "CLOSE EXTRAS ↑" : "THERE'S MORE ♡"}
                    </button>
                  )}

                  <button
                    type="button"
                    className="owrKeepButton"
                    onClick={returnCard}
                  >
                    KEEP THIS ONE CLOSE ♡
                  </button>
                </div>
              )}

              {flipped && selected.interaction?.enabled && (
                <div className="owrInteraction">
                  <span>♡ A LITTLE QUESTION</span>
                  <h2>
                    {selected.interaction.question ||
                      "WOULD YOU DO THIS WITH ME?"}
                  </h2>
                  <p>
                    {selected.interaction.text ||
                      "Maybe this deserves another memory."}
                  </p>

                  {!responseSent ? (
                    <div className={previewStyles.replyGrid}>{['note','date','time','place'].map(key=><label className="owReplyFields" key={key}>{key.toUpperCase()} (OPTIONAL){key==='note'?<textarea value={reply.note} maxLength={2000} onChange={e=>setReply(old=>({...old,note:e.target.value}))}/>:<input type={key==='date'?'date':key==='time'?'time':'text'} maxLength={300} value={reply[key]} onChange={e=>setReply(old=>({...old,[key]:e.target.value}))}/>}</label>)}<button type="button" disabled={saving} onClick={sendResponse}>
                      {selected.interaction.button ||
                        `TELL ${gift.sender?.toUpperCase()} ♡`}
                    </button></div>
                  ) : (
                    <div className="owrSent">
                      <strong>
                        SENT TO {gift.sender?.toUpperCase()} ♡
                      </strong>
                      <small>They'll know you want this too.</small>
                    </div>
                  )}
                </div>
              )}
            </div>

            {notice && <p className={previewStyles.status} role="status">{notice}</p>}

            {flipped && showExtras && (
              <aside className="owrExtras">
                <div className="owrExtrasTitle">
                  <span>ONE MORE THING ♡</span>
                  <p>A few little pieces left for you.</p>
                </div>

                {selected.photo && (
                  <div className="owrPhoto">
                    <img src={selected.photo} alt="" />
                  </div>
                )}

                {selected.voice && (
                  <div className="owrAudio">
                    <span>◉ A LITTLE MESSAGE FROM ME</span>
                    <audio src={selected.voice} controls />
                  </div>
                )}

                {selected.gift && <div>{selected.giftMimeType?.startsWith('image/')?<img src={selected.gift} alt="Your gift" style={{width:'100%',objectFit:'contain'}}/>:<object data={selected.gift} type="application/pdf" style={{width:'100%',height:360}} aria-label="Gift certificate"><p>Open your certificate below.</p></object>}<a href={selected.gift} target="_blank" rel="noopener noreferrer">OPEN CERTIFICATE ↗</a></div>}
                {selected.video && (
                  <div className="owrVideo">
                    <video src={selected.video} controls playsInline />
                  </div>
                )}
              </aside>
            )}
          </section>
        )}
      </main>
    </>
  );
}

