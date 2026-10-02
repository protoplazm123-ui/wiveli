"use client";

import { useEffect, useState } from "react";

import StoryUpload from '../../components/StoryUpload';
import TelegramGiftDelivery from '../../components/TelegramGiftDelivery';

const themes = [
  {
    id: "stars",
    icon: "✦",
    name: "Starry Universe",
    text: "Memories become stars in your universe.",
  },
  {
    id: "clouds",
    icon: "☁",
    name: "Cloud Journey",
    text: "Travel through your memories in the sky.",
  },
  {
    id: "color",
    icon: "♡",
    name: "Color Story",
    text: "A clean journey built around your favorite color.",
  },
  {
    id: "custom",
    icon: "∞",
    name: "Your World",
    text: "Upload your own background and build your own path.",
  },
];

const defaultLetter =
  "I wanted to remind you of some of the best moments I remember with you. The little things, the places, and the days I never want to forget. So I put some of them here — just for us.";

function createMemory(id = Date.now()) {
  return {
    id,
    title: "",
    date: "",
    place: "",
    text: "",
    photo: null,
    video: null,
    voice: null,
  };
}

export default function OurStoryEditor() {
  const [step, setStep] = useState(1);

  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [letter, setLetter] = useState(defaultLetter);
  const [openingPhoto, setOpeningPhoto] = useState(null);

  const [memories, setMemories] = useState([
    {
      id: 1,
      title: "How We Met",
      date: "2024-02-14",
      place: "Kyiv, Ukraine",
      text: "The moment everything started.",
      photo: null,
      video: null,
      voice: null,
    },
  ]);

  const [theme, setTheme] = useState("stars");
  const [customColor, setCustomColor] = useState("#5d347f");
  const [customBackground, setCustomBackground] = useState(null);

  const [finalMessage, setFinalMessage] = useState(
    "There are still so many places to see, things to do, and moments waiting for us. The rest is ours to write."
  );

  const addMemory = () => {
    setMemories((current) => [
      ...current,
      createMemory(Date.now()),
    ]);
  };

  const updateMemory = (id, field, value) => {
    setMemories((current) =>
      current.map((memory) =>
        memory.id === id
          ? { ...memory, [field]: value }
          : memory
      )
    );
  };

  const removeMemory = (id) => {
    setMemories((current) =>
      current.filter((memory) => memory.id !== id)
    );
  };

  const moveMemory = (index, direction) => {
    const target = index + direction;

    if (target < 0 || target >= memories.length) return;

    const next = [...memories];
    const [item] = next.splice(index, 1);

    next.splice(target, 0, item);

    setMemories(next);
  };

  const [ready,setReady]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false),[created,setCreated]=useState(null);
  const [uploads,setUploads]=useState({}),[previewUrls,setPreviewUrls]=useState({});

  const uploadBusy=Object.values(uploads).some(Boolean);
const [copied,setCopied]=useState(false);

const copyLink=async()=>{
  try{
    await navigator.clipboard.writeText(created.giftUrl);
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  }catch{
    setError('Could not copy. Select the link and copy it manually.');
  }
};
  const state={
    recipient,
    sender,
    openingLetter:letter,
    openingPhoto,
    memories,
    theme,
    customColor,
    customBackground,
    finalMessage
  };

  useEffect(()=>{
    try{
      const d=JSON.parse(
        localStorage.getItem('wiveli-story-draft-v2')||'null'
      );

      if(d){
        setCreated(d.created||null);
        setRecipient(d.recipient||'');
        setSender(d.sender||'');
        setLetter(d.openingLetter||'');
        setOpeningPhoto(d.openingPhoto||null);
        setMemories(d.memories||[]);
        setTheme(d.theme||'stars');
        setCustomColor(d.customColor||'#5d347f');
        setCustomBackground(d.customBackground||null);
        setFinalMessage(d.finalMessage||'');
      }
    }catch{
      setError('Could not restore the draft.');
    }

    setReady(true);
  },[]);

  useEffect(()=>{
    if(ready){
      try{
        localStorage.setItem(
          'wiveli-story-draft-v2',
          JSON.stringify({...state,created})
        );
      }catch{
        setError('Could not save the draft in this browser.');
      }
    }
  },[
    ready,
    created,
    recipient,
    sender,
    letter,
    openingPhoto,
    memories,
    theme,
    customColor,
    customBackground,
    finalMessage
  ]);

  const uploader=(key,kind,value,change)=>
    <StoryUpload
      key={key}
      kind={kind}
      attachment={value}
      onChange={change}
      onBusy={v=>
        setUploads(old=>({...old,[key]:v}))
      }
      onPreview={url=>
        setPreviewUrls(old=>({...old,[key]:url}))
      }
    />;

  const saveStory=async()=>{
    if(busy||!ready)return;

    if(uploadBusy){
      setError('Please wait until all files finish uploading.');
      return;
    }

    setBusy(true);
    setError('');

    try{
      const res=await fetch('/api/gifts',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          giftType:'our-story',
          giftData:state
        })
      });

      const d=await res.json();

      if(!res.ok||!d?.success||!d?.id){
        throw Error(
          d?.error||'Could not create story.'
        );
      }

      setCreated(d);

      try{
        localStorage.setItem(
          'wiveli-story-draft-v2',
          JSON.stringify({
            ...state,
            created:d
          })
        );
      }catch{}

      window.scrollTo({
        top:0,
        behavior:'smooth'
      });

    }catch(e){
      setError(
        e.message||'Could not create story.'
      );
    }finally{
      setBusy(false);
    }
  };

   if(created){
    return (
      <main className="osePage">

        <header className="oseHeader">
          <a href="/" className="oseLogo">
            WI<span>♥</span>ELI
          </a>
          <div />
          <a href="/account">← MY ACCOUNT</a>
        </header>

        <section className="oseStep">

          <div className="oseIntro">
            <p>OUR STORY · READY</p>
            <h1>
              YOUR STORY
              <br />
              <em>IS READY. ♡</em>
            </h1>
            <span>
              Your recipient can open it without registering.
            </span>
          </div>

          <div className="doneCard">
            <p className="doneLabel">PRIVATE GIFT LINK</p>

            <div className="doneRow">
              <input
                readOnly
                value={created.giftUrl}
                onFocus={e=>e.target.select()}
              />
              <button
                type="button"
                className="oseContinue"
                onClick={copyLink}
              >
                {copied ? "COPIED ✓" : "COPY LINK"}
              </button>
            </div>

            <div className="doneActions">
              <a
                href={created.giftUrl}
                target="_blank"
                rel="noreferrer"
              >
                OPEN STORY ↗
              </a>
              <button
                type="button"
                onClick={()=>setCreated(null)}
              >
                EDIT A NEW COPY
              </button>
            </div>
          </div>

          <div className="doneCard deliveryWrap">
            <TelegramGiftDelivery
              giftType="our-story"
              giftId={created.id}
              recipientName={recipient}
              senderName={sender}
              onBack={()=>
                window.location.assign('/account')
              }
            />
          </div>

        </section>

        <style jsx>{`
          .doneCard{
            max-width:760px;
            margin:0 auto 24px;
            padding:28px;
            border:1px solid rgba(184,152,242,.2);
            border-radius:24px;
            background:linear-gradient(
              180deg,
              rgba(255,255,255,.05),
              rgba(255,255,255,.015)
            );
            color:#f3eefc;
          }

          .doneLabel{
            margin:0 0 14px;
            font:700 10px Arial,sans-serif;
            letter-spacing:.2em;
            color:#b898f2;
          }

          .doneRow{
            display:flex;
            gap:12px;
            align-items:center;
            flex-wrap:wrap;
          }

          .doneRow input{
            flex:1 1 280px;
            min-width:0;
            padding:14px 16px;
            border:1px solid rgba(255,255,255,.14);
            border-radius:14px;
            background:rgba(255,255,255,.04);
            color:#fff;
            font:14px Arial,sans-serif;
          }

          .doneActions{
            display:flex;
            gap:24px;
            flex-wrap:wrap;
            margin-top:18px;
          }

          .doneActions a,
          .doneActions button{
            padding:0;
            border:0;
            background:none;
            color:#b898f2;
            font:700 11px Arial,sans-serif;
            letter-spacing:.14em;
            text-decoration:none;
            cursor:pointer;
          }

          .doneActions a:hover,
          .doneActions button:hover{
            color:#fff;
          }
        `}</style>

      </main>
    );
  }
          />
        </section>
      </main>
    );
  }

  return (
    <main className="osePage">

      {(error||uploadBusy)&&(
        <p
          role="status"
          style={{padding:20}}
        >
          {error||
            "Uploading your files… Please wait before continuing."
          }
        </p>
      )}

      <header className="oseHeader">

        <a href="/" className="oseLogo">
          WI<span>♥</span>ELI
        </a>

        <div className="oseProgress">

          <span>
            {String(step).padStart(2, "0")}
          </span>

          <div>
            <i
              style={{
                width: `${(step / 5) * 100}%`,
              }}
            />
          </div>

          <span>05</span>

        </div>

        <a href="/">← EXIT</a>

      </header>

      {step === 1 && (

        <section className="oseStep">

          <div className="oseIntro">

            <p>OUR STORY · 01</p>

            <h1>
              START WITH
              <br />
              <em>A LETTER.</em>
            </h1>

            <span>
              Before the journey begins, give them something
              personal to open.
            </span>

          </div>

          <div className="oseEditorGrid">

            <div className="oseForm">

              <label>
                FOR

                <input
                  value={recipient}
                  onChange={(e) =>
                    setRecipient(e.target.value)
                  }
                  placeholder="Their name"
                />
              </label>

              <label>
                FROM

                <input
                  value={sender}
                  onChange={(e) =>
                    setSender(e.target.value)
                  }
                  placeholder="Your name"
                />
              </label>

              <label>
                YOUR OPENING LETTER

                <textarea
                  value={letter}
                  onChange={(e) =>
                    setLetter(e.target.value)
                  }
                  rows={8}
                />
              </label>

              {uploader(
                'opening',
                'photo',
                openingPhoto,
                setOpeningPhoto
              )}

            </div>

            <div className="oseLetterPreview">

              <p>
                FOR {recipient.toUpperCase()} ♡
              </p>

              {openingPhoto ? (

                <div
                  className="osePreviewPhoto osePreviewPhotoReal"
                  style={{
                    backgroundImage:
                      `url(${previewUrls.opening||""})`,
                  }}
                />

              ) : (

                <div className="osePreviewPhoto">
                  YOUR PHOTO
                </div>

              )}

              <h2>
                LET&apos;S REMEMBER
                <br />
                <em>OUR STORY.</em>
              </h2>

              <blockquote>
                “{letter}”
              </blockquote>

              <span>
                FROM {sender.toUpperCase()}
              </span>

              <button type="button">
                BEGIN OUR JOURNEY →
              </button>

            </div>

          </div>

        </section>

      )}

      {step === 2 && (

        <section className="oseStep">

          <div className="oseIntro">

            <p>OUR STORY · 02</p>

            <h1>
              BUILD YOUR
              <br />
              <em>MEMORIES.</em>
            </h1>

            <span>
              Every memory becomes a stop in your journey.
            </span>

          </div>

          <div className="oseMemoryList">

            {memories.map((memory, index) => (

              <article
                className="oseMemoryEditor"
                key={memory.id}
              >

                <div className="oseMemoryNumber">

                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="oseMemoryMove">

                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() =>
                        moveMemory(index, -1)
                      }
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index === memories.length - 1
                      }
                      onClick={() =>
                        moveMemory(index, 1)
                      }
                    >
                      ↓
                    </button>

                  </div>

                  {memories.length > 1 && (

                    <button
                      type="button"
                      onClick={() =>
                        removeMemory(memory.id)
                      }
                    >
                      REMOVE
                    </button>

                  )}

                </div>

                <div className="oseMemoryFields">

                  <input
                    value={memory.title}
                    onChange={(e) =>
                      updateMemory(
                        memory.id,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="Memory title"
                  />

                  <div className="oseMemoryMeta">

                    <label>
                      DATE

                      <input
                        type="date"
                        value={memory.date}
                        onChange={(e) =>
                          updateMemory(
                            memory.id,
                            "date",
                            e.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      PLACE

                      <input
                        value={memory.place}
                        onChange={(e) =>
                          updateMemory(
                            memory.id,
                            "place",
                            e.target.value
                          )
                        }
                        placeholder="Paris, France"
                      />
                    </label>

                  </div>

                  <textarea
                    value={memory.text}
                    onChange={(e) =>
                      updateMemory(
                        memory.id,
                        "text",
                        e.target.value
                      )
                    }
                    placeholder="What do you remember about this moment?"
                    rows={5}
                  />

                  <div className="storyUploads">

                    {[
                      'photo',
                      'video',
                      'voice',
                      'gift'
                    ].map(kind=>(

                      <div key={kind}>

                        <p>
                          {kind.toUpperCase()}
                        </p>

                        {uploader(
                          `${memory.id}-${kind}`,
                          kind,
                          memory[kind],
                          file=>
                            updateMemory(
                              memory.id,
                              kind,
                              file
                            )
                        )}

                      </div>

                    ))}

                  </div>

                </div>

              </article>

            ))}

            <button
              type="button"
              className="oseAddMemory"
              onClick={addMemory}
            >
              <span>＋</span>
              ADD ANOTHER MEMORY
            </button>

          </div>

        </section>

      )}

      {step === 3 && (

        <section className="oseStep">

          <div className="oseIntro">

            <p>OUR STORY · 03</p>

            <h1>
              CHOOSE YOUR
              <br />
              <em>WORLD.</em>
            </h1>

            <span>
              Same memories. A completely different journey.
            </span>

          </div>

          <div className="oseThemes">

            {themes.map((item) => (

              <button
                type="button"
                key={item.id}
                className={`oseTheme ${
                  theme === item.id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setTheme(item.id)
                }
              >

                <div
                  className={`oseThemeVisual ${item.id}`}
                >
                  <span>{item.icon}</span>
                </div>

                <div>
                  <strong>
                    {item.name}
                  </strong>

                  <p>
                    {item.text}
                  </p>
                </div>

                <i>
                  {theme === item.id
                    ? "SELECTED"
                    : "SELECT"}
                </i>

              </button>

            ))}

          </div>

          {theme === "color" && (

            <div className="oseThemeOptions">

              <label>
                YOUR COLOR

                <input
                  type="color"
                  value={customColor}
                  onChange={(e) =>
                    setCustomColor(e.target.value)
                  }
                />
              </label>

            </div>

          )}

          {theme === "custom" && (

            <div className="oseThemeOptions">

              {uploader(
                'background',
                'photo',
                customBackground,
                setCustomBackground
              )}

              {customBackground && (

                <div
                  className="oseCustomPreview"
                  style={{
                    backgroundImage:
                      `url(${previewUrls.background||""})`,
                  }}
                >

                  <span>01</span>
                  <span>02</span>
                  <span>03</span>

                  <p>
                    YOUR MEMORIES BECOME POINTS
                    ON THIS WORLD
                  </p>

                </div>

              )}

            </div>

          )}

        </section>

      )}

      {step === 4 && (

        <section className="oseStep">

          <div className="oseIntro">

            <p>OUR STORY · 04</p>

            <h1>
              ONE LAST
              <br />
              <em>THING.</em>
            </h1>

            <span>
              The memories end. Your story doesn&apos;t.
            </span>

          </div>

          <div className="oseFinalEditor">

            <div>

              <p>
                A NOTE FOR OUR FUTURE
              </p>

              <h2>
                THE REST IS
                <br />
                <em>OURS TO WRITE.</em>
              </h2>

              <textarea
                rows={7}
                value={finalMessage}
                onChange={(e) =>
                  setFinalMessage(e.target.value)
                }
              />

              <span>
                They&apos;ll see this after the last memory.
              </span>

            </div>

            <div
              className={`oseEndingPreview ${theme}`}
              style={
                theme === "color"
                  ? {
                      background:
                        `radial-gradient(circle at 50% 40%, ${customColor}88, transparent 58%), #09070d`,
                    }
                  : theme === "custom" &&
                    customBackground
                  ? {
                      backgroundImage:
                        `linear-gradient(rgba(8,6,12,.4),rgba(8,6,12,.75)),url(${previewUrls.background||""})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >

              <div className="osePastPath">

                {memories
                  .slice(-4)
                  .map((memory) => (

                    <i key={memory.id}>
                      {theme === "clouds"
                        ? "☁"
                        : "✦"}
                    </i>

                  ))}

              </div>

              <p>
                AND HERE WE ARE ♡
              </p>

              <h3>
                {memories.length} MEMORIES BEHIND US.
                <br />
                A WHOLE WORLD AHEAD.
              </h3>

              <blockquote>
                “{finalMessage}”
              </blockquote>

              <strong>∞</strong>

            </div>

          </div>

        </section>

      )}

      {step === 5 && (

        <section className="oseStep oseReady">

          <p>
            OUR STORY · READY
          </p>

          <h1>
            YOUR STORY
            <br />
            <em>IS READY. ♡</em>
          </h1>

          <span>
            {memories.length} memories ·{" "}
            {
              themes.find(
                (item) =>
                  item.id === theme
              )?.name
            }
          </span>

          <div
            className={`oseReadyWorld ${theme}`}
            style={
              theme === "color"
                ? {
                    background:
                      `radial-gradient(circle, ${customColor}aa, #09070d 70%)`,
                  }
                : theme === "custom" &&
                  customBackground
                ? {
                    backgroundImage:
                      `linear-gradient(rgba(8,6,12,.35),rgba(8,6,12,.65)),url(${previewUrls.background||""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >

            <p>
              FOR {recipient.toUpperCase()}
            </p>

            <h2>
              LET&apos;S REMEMBER
              <br />
              OUR STORY.
            </h2>

            <div>

              {memories.map(
                (memory, index) => (

                  <i key={memory.id}>

                    {theme === "clouds"
                      ? "☁"
                      : "✦"}

                    <small>
                      {index + 1}
                    </small>

                  </i>

                )
              )}

            </div>

            <strong>∞</strong>

          </div>

        </section>

      )}

      <nav className="oseBottomNav">

        <button
          type="button"
          disabled={
            step === 1 ||
            uploadBusy ||
            busy
          }
          onClick={() =>
            setStep((current) =>
              Math.max(1, current - 1)
            )
          }
        >
          ← BACK
        </button>

        <span>
          {step === 1 && "OPENING LETTER"}
          {step === 2 && "YOUR MEMORIES"}
          {step === 3 && "YOUR WORLD"}
          {step === 4 && "THE FUTURE"}
          {step === 5 && "PREVIEW"}
        </span>

        {step < 5 ? (

          <button
            type="button"
            className="oseContinue"
            disabled={
              uploadBusy ||
              busy ||
              !ready
            }
            onClick={() =>
              setStep((current) =>
                Math.min(5, current + 1)
              )
            }
          >
            CONTINUE →
          </button>

        ) : (

          <button
            type="button"
            className="oseContinue"
            disabled={busy||!ready}
            onClick={saveStory}
          >
            {busy
              ? "CREATING…"
              : "CREATE OUR STORY ♡"
            }
          </button>
{error && (
  <p
    style={{
      position: "fixed",
      left: "50%",
      bottom: "80px",
      transform: "translateX(-50%)",
      zIndex: 99999,
      width: "min(560px, calc(100vw - 40px))",
      padding: "16px 20px",
      background: "#741020",
      color: "#fff",
      borderRadius: "14px",
      font: "14px/1.5 Arial, sans-serif",
      textAlign: "center",
      boxShadow: "0 10px 40px rgba(0,0,0,.4)",
    }}
  >
    {error}
  </p>
)}
        )}

      </nav>

      <style jsx>{`
        .storyUploads{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:18px;
        }

        .storyUploads p{
          font:700 10px Arial,sans-serif;
        }

        @media(max-width:600px){
          .storyUploads{
            grid-template-columns:1fr;
          }
        }
      `}</style>

    </main>
  );
}
