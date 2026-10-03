"use client";

import { useEffect, useMemo, useState } from "react";

import CouponAttachmentUpload from '../../components/CouponAttachmentUpload';
import OpenWhenReady from '../../components/OpenWhenReady';
const IDEAS = [
  { id:"miss", category:"LOVE", title:"YOU MISS ME", symbol:"♡", text:"A little piece of you for when the distance feels bigger." },
  { id:"sleep", category:"COMFORT", title:"YOU CAN'T SLEEP", symbol:"☾", text:"Something soft for the late nights." },
  { id:"reset", category:"COMFORT", title:"YOU NEED A RESET", symbol:"↺", text:"A small pause when everything feels loud." },
  { id:"smile", category:"FUN", title:"YOU NEED TO SMILE", symbol:"☺", text:"Something silly, sweet, or completely you." },
  { id:"love", category:"LOVE", title:"YOU NEED TO FEEL LOVED", symbol:"♥", text:"Remind them exactly how much they mean to you." },
  { id:"overthinking", category:"COMFORT", title:"YOU'RE OVERTHINKING", symbol:"∞", text:"A reminder to come back to right now." },
  { id:"courage", category:"MOTIVATION", title:"YOU NEED COURAGE", symbol:"✦", text:"A little push before the scary thing." },
  { id:"alone", category:"COMFORT", title:"YOU FEEL ALONE", symbol:"◌", text:"Proof that you are never quite by yourself." },
  { id:"movie", category:"LOVE", title:"YOU MISS OUR MOVIE NIGHTS", symbol:"▶", text:"A memory that might deserve another chapter." },
  { id:"good", category:"FUN", title:"SOMETHING GOOD HAPPENED", symbol:"☆", text:"Celebrate the good news together." },
  { id:"proud", category:"MOTIVATION", title:"YOU DOUBT YOURSELF", symbol:"↑", text:"Remind them what you already see in them." },
  { id:"bad-day", category:"COMFORT", title:"YOU HAD A BAD DAY", symbol:"♡", text:"A safe little corner for a difficult day." },
];

const FILTERS = ["ALL", "LOVE", "COMFORT", "FUN", "MOTIVATION"];

const THEMES = [
  {
    id:"romantic",
    name:"ROMANTIC",
    symbol:"♡",
    description:"Soft, intimate and warm.",
  },
  {
    id:"cosmic",
    name:"COSMIC",
    symbol:"✦",
    description:"A little universe made for two.",
  },
  {
    id:"tech",
    name:"TECH / FUTURE",
    symbol:"◇",
    description:"Clean, digital and futuristic.",
  },
  {
    id:"dreamy",
    name:"DREAMY",
    symbol:"☁",
    description:"Light, floating and gentle.",
  },
  {
    id:"custom",
    name:"CUSTOM",
    symbol:"∞",
    description:"Make the world completely yours.",
  },
];

const INTERACTIONS = [
  {
    id:"movie",
    label:"MOVIE",
    question:"WOULD YOU GO TO THE MOVIES WITH ME AGAIN?",
    text:"One more movie night. Just us.",
    button:"YES, LET'S DO IT ♡",
  },
  {
    id:"dinner",
    label:"DINNER",
    question:"SHOULD WE HAVE DINNER TOGETHER?",
    text:"I think we deserve another evening together.",
    button:"YES, TAKE ME THERE ♡",
  },
  {
    id:"trip",
    label:"TRIP",
    question:"SHOULD WE GO SOMEWHERE TOGETHER?",
    text:"Maybe it's time for another little adventure.",
    button:"LET'S GO ♡",
  },
  {
    id:"repeat",
    label:"DO THIS AGAIN",
    question:"SHOULD WE MAKE THIS MEMORY AGAIN?",
    text:"Some moments deserve a second chapter.",
    button:"I WANT THIS AGAIN ♡",
  },
  {
    id:"custom",
    label:"CUSTOM",
    question:"WOULD YOU DO THIS WITH ME?",
    text:"There's something I'd love to share with you.",
    button:"YES ♡",
  },
];

function createMoment(idea) {
  return {
    id:`${idea.id}-${Date.now()}`,
    title:idea.title,
    category:idea.category || "CUSTOM",
    message:"",
    photo:null,
    voice:null,
    video:null,
    place:"",
    date:"",
    time:"",
    interaction:{
      enabled:false,
      type:"custom",
      question:"",
      text:"",
      button:"",
      response:"",
    },
  };
}

export default function OpenWhenPage() {
  const [filter,setFilter] = useState("ALL");
  const [recipient,setRecipient] = useState("");
  const [sender,setSender] = useState("");

  const [moments,setMoments] = useState([]);
  const [selectedIdea,setSelectedIdea] = useState(null);
  const [editingId,setEditingId] = useState(null);

  const [customOpen,setCustomOpen] = useState(false);
  const [customTitle,setCustomTitle] = useState("");

  const [theme,setTheme] = useState("cosmic");
  const [customColor,setCustomColor] = useState("#8c63c7");
  const [customBackground,setCustomBackground] = useState(null);

  const filtered = useMemo(() => {
    if(filter === "ALL") return IDEAS;
    return IDEAS.filter((idea)=>idea.category === filter);
  },[filter]);

  const editing = moments.find((moment)=>moment.id === editingId);

  const alreadyAdded = (idea) =>
    moments.some((moment)=>moment.title === idea.title);

  const updateMoment = (field,value) => {
    setMoments((current)=>
      current.map((moment)=>
        moment.id === editingId
          ? {...moment,[field]:value}
          : moment
      )
    );
  };

  const updateInteraction = (field,value) => {
    setMoments((current)=>
      current.map((moment)=>
        moment.id === editingId
          ? {
              ...moment,
              interaction:{
                ...moment.interaction,
                [field]:value,
              },
            }
          : moment
      )
    );
  };

  const addIdea = (idea) => {
    const existing = moments.find(
      (moment)=>moment.title === idea.title
    );

    if(existing){
      setSelectedIdea(null);
      setEditingId(existing.id);
      return;
    }

    const moment = createMoment(idea);

    setMoments((current)=>[...current,moment]);
    setSelectedIdea(null);
    setEditingId(moment.id);
  };

  const addCustom = () => {
    if(!customTitle.trim()) return;

    const moment = createMoment({
      id:"custom",
      category:"CUSTOM",
      title:customTitle.trim().toUpperCase(),
    });

    setMoments((current)=>[...current,moment]);
    setCustomTitle("");
    setCustomOpen(false);
    setEditingId(moment.id);
  };

  const deleteMoment = () => {
    setMoments((current)=>
      current.filter((moment)=>moment.id !== editingId)
    );
    setEditingId(null);
  };

  const chooseInteraction = (preset) => {
    const responseText =
      preset.id === "movie"
        ? `${recipient} wants to go to the movies with you ♡`
        : preset.id === "dinner"
        ? `${recipient} wants to have dinner with you ♡`
        : preset.id === "trip"
        ? `${recipient} wants to go somewhere with you ♡`
        : preset.id === "repeat"
        ? `${recipient} wants to recreate this memory with you ♡`
        : `${recipient} wants to do this with you ♡`;

    setMoments((current)=>
      current.map((moment)=>
        moment.id === editingId
          ? {
              ...moment,
              interaction:{
                enabled:true,
                type:preset.id,
                question:preset.question,
                text:preset.text,
                button:preset.button,
                response:responseText,
              },
            }
          : moment
      )
    );
  };

  const [ready,setReady]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false),[created,setCreated]=useState(null),[uploads,setUploads]=useState({});
  const uploadBusy=Object.values(uploads).some(Boolean);
  const draft={recipient,sender,moments,theme:{id:theme,accent:customColor,customBackground}};
  useEffect(()=>{try{const d=JSON.parse(localStorage.getItem('wiveli-open-when-cloud-v1')||'null');if(d){setRecipient(d.recipient||'');setSender(d.sender||'');setMoments(d.moments||[]);setTheme(d.theme?.id||'cosmic');setCustomColor(d.theme?.accent||'#8c63c7');setCustomBackground(d.theme?.customBackground||null);setCreated(d.created||null);}}catch{setError('Could not restore the draft.');}setReady(true);},[]);
  useEffect(()=>{if(ready)try{localStorage.setItem('wiveli-open-when-cloud-v1',JSON.stringify({...draft,created}));}catch{setError('Could not save the draft in this browser.');}},[ready,recipient,sender,moments,theme,customColor,customBackground,created]);
  const upload=(key,kind,value,onChange)=><CouponAttachmentUpload key={key} kind={kind} attachment={value} onChange={onChange} onBusy={value=>setUploads(old=>({...old,[key]:value}))} saveHint="Uploaded. Save this moment, then create your gift."/>;
  const preview=async()=>{
    if(busy||uploadBusy||!ready)return;setBusy(true);setError('');
    try{const r=await fetch('/api/gifts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({giftType:'open-when',giftData:draft})});const d=await r.json();if(!r.ok)throw Error(d.error||'Could not create gift.');setCreated(d);}catch(e){setError(e.message);}finally{setBusy(false);}
  };
  if(created)return <OpenWhenReady created={created} recipient={recipient} sender={sender} onEdit={()=>setCreated(null)} />;

  return(
    <main className="owcPage">
      {(error||uploadBusy)&&<p role="status" className="cloudNotice">{error||"Uploading… Please wait before leaving this editor."}</p>}

      <header className="owcHeader">
        <a href="/" className="owcLogo">
          WI<span>♥</span>ELI
        </a>

        <span>OPEN WHEN</span>

        <button
          type="button"
          disabled={busy||uploadBusy||!ready||!moments.length} onClick={preview}
        >
          CREATE YOUR GIFT →
        </button>
      </header>

      <section className="owcHero">
        <div className="owcHeroCopy">
          <span>MAKE IT PERSONAL</span>

          <h1>
            Open when
            <br/>
            <em>they need you.</em>
          </h1>

          <p>
            Create little moments they can return to whenever
            they need comfort, courage, love or simply a little
            bit of you.
          </p>

          <div className="owcPeople">
            <label>
              <span>FROM</span>
              <input
                value={sender}
                onChange={(e)=>setSender(e.target.value)}
                placeholder="Your name"
              />
            </label>

            <label>
              <span>FOR</span>
              <input
                value={recipient}
                onChange={(e)=>setRecipient(e.target.value)}
                placeholder="Their name"
              />
            </label>
          </div>
        </div>

        <div className="owcGiftStatus">
          <span>YOUR GIFT</span>
          <strong>{String(moments.length).padStart(2,"0")}</strong>
          <p>{moments.length === 1 ? "MOMENT" : "MOMENTS"} ADDED</p>
        </div>
      </section>

      <section className="owcDiscover">

        <div className="owcDiscoverTop">
          <div>
            <span>CHOOSE A MOMENT</span>
            <h2>What might they need?</h2>
          </div>

          <button
            type="button"
            className="owcCustomTop"
            onClick={()=>setCustomOpen(true)}
          >
            + CREATE YOUR OWN
          </button>
        </div>

        <div className="owcFilters">
          {FILTERS.map((item)=>(
            <button
              type="button"
              key={item}
              className={filter === item ? "active" : ""}
              onClick={()=>setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="owcGrid">
          {filtered.map((idea,index)=>{
            const added=alreadyAdded(idea);

            return(
              <button
                type="button"
                key={idea.id}
                className={`owcCard ${added ? "isAdded" : ""}`}
                onClick={()=>setSelectedIdea(idea)}
              >
                <div className="owcCardTop">
                  <span>{String(index+1).padStart(2,"0")}</span>
                  <i>{idea.symbol}</i>
                </div>

                <div className="owcCardBody">
                  <small>OPEN WHEN</small>
                  <h3>{idea.title}</h3>
                  <p>{idea.text}</p>
                </div>

                <div className="owcCardBottom">
                  <span>{idea.category}</span>
                  <strong>{added ? "ADDED ✓" : "EXPLORE →"}</strong>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            className="owcCard owcCustomCard"
            onClick={()=>setCustomOpen(true)}
          >
            <div>
              <span>＋</span>
              <small>YOUR MOMENT</small>
              <h3>Something only you two understand.</h3>
            </div>

            <strong>CREATE YOUR OWN →</strong>
          </button>
        </div>
      </section>

      <section className="owcWorldSection">

        <div className="owcWorldIntro">
          <span>CHOOSE YOUR WORLD</span>
          <h2>How should their Open When feel?</h2>
          <p>
            The memories stay the same. The whole atmosphere changes.
          </p>
        </div>

        <div className="owcWorldGrid">
          {THEMES.map((item)=>(
            <button
              type="button"
              key={item.id}
              className={`owcWorldCard owcWorld-${item.id} ${
                theme === item.id ? "active" : ""
              }`}
              onClick={()=>setTheme(item.id)}
            >
              <div className="owcWorldPreview">
                <div className="owcWorldMiniCard">
                  <small>OPEN WHEN</small>
                  <strong>YOU MISS ME</strong>
                  <i>{item.symbol}</i>
                </div>
              </div>

              <div className="owcWorldInfo">
                <span>{item.symbol}</span>

                <div>
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </div>
              </div>

              {theme === item.id && (
                <b className="owcWorldSelected">
                  SELECTED ✓
                </b>
              )}
            </button>
          ))}
        </div>

        {theme === "custom" && (
          <div className="owcCustomWorld">

            <label>
              <span>ACCENT COLOR</span>

              <div>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e)=>setCustomColor(e.target.value)}
                />

                <strong>{customColor}</strong>
              </div>
            </label>

            <div><p>BACKGROUND PHOTO</p>{upload('background-photo','photo',customBackground?.mimeType?.startsWith('image/')?customBackground:null,setCustomBackground)}<p>OR BACKGROUND VIDEO</p>{upload('background-video','video',customBackground?.mimeType?.startsWith('video/')?customBackground:null,setCustomBackground)}</div>

          </div>
        )}

      </section>

      {moments.length > 0 && (
        <div className="owcDock">
          <div>
            <span>YOUR GIFT</span>
            <strong>
              {moments.length}{" "}
              {moments.length === 1 ? "MOMENT" : "MOMENTS"}
            </strong>
          </div>

          <div className="owcDockItems">
            {moments.slice(0,4).map((moment)=>(
              <button
                type="button"
                key={moment.id}
                onClick={()=>setEditingId(moment.id)}
              >
                {moment.title}
              </button>
            ))}

            {moments.length > 4 && (
              <span>+{moments.length-4}</span>
            )}
          </div>

          <button
            type="button"
            className="owcPreviewButton"
            disabled={busy||uploadBusy||!ready} onClick={preview}
          >
            CREATE GIFT →
          </button>
        </div>
      )}

      {selectedIdea && (
        <div className="owcOverlay">
          <div className="owcIdeaPanel">

            <button
              type="button"
              className="owcClose"
              onClick={()=>setSelectedIdea(null)}
            >
              ×
            </button>

            <div className="owcIdeaNumber">
              {selectedIdea.symbol}
            </div>

            <span>OPEN WHEN...</span>
            <h2>{selectedIdea.title}</h2>
            <p>{selectedIdea.text}</p>

            <div className="owcCanHold">
              <span>THIS MOMENT CAN HOLD</span>

              <div>
                <i>♡ MESSAGE</i>
                <i>▣ PHOTO</i>
                <i>◉ VOICE</i>
                <i>▶ VIDEO</i>
                <i>⌖ PLACE</i>
                <i>✦ INVITATION</i>
              </div>
            </div>

            <button
              type="button"
              className="owcCreateMoment"
              onClick={()=>addIdea(selectedIdea)}
            >
              {alreadyAdded(selectedIdea)
                ? "EDIT THIS MOMENT →"
                : "CREATE THIS MOMENT →"}
            </button>

          </div>
        </div>
      )}

      {customOpen && (
        <div className="owcOverlay">
          <div className="owcCustomPanel">

            <button
              type="button"
              className="owcClose"
              onClick={()=>setCustomOpen(false)}
            >
              ×
            </button>

            <span>YOUR OWN MOMENT</span>
            <h2>OPEN WHEN...</h2>

            <input
              autoFocus
              value={customTitle}
              placeholder="YOU..."
              onChange={(e)=>setCustomTitle(e.target.value)}
              onKeyDown={(e)=>{
                if(e.key === "Enter") addCustom();
              }}
            />

            <button
              type="button"
              onClick={addCustom}
              disabled={!customTitle.trim()}
            >
              CREATE MOMENT →
            </button>

          </div>
        </div>
      )}

      {editing && (
        <div className="owcOverlay owcEditorOverlay">
          <div className="owcEditor owcEditorV2">

            <button
              type="button"
              className="owcClose"
              disabled={uploadBusy||busy} onClick={()=>setEditingId(null)}
            >
              ×
            </button>

            <div className="owcEditorHead">
              <span>BUILD THIS MOMENT</span>
              <small>OPEN WHEN...</small>

              <input
                value={editing.title}
                onChange={(e)=>
                  updateMoment("title",e.target.value.toUpperCase())
                }
              />
            </div>

            <div className="owcBuildGrid">

              <div className="owcBuildMain">

                <label className="owcField">
                  <span>YOUR MESSAGE ♡</span>

                  <textarea
                    value={editing.message}
                    placeholder="If you're opening this..."
                    onChange={(e)=>
                      updateMoment("message",e.target.value)
                    }
                  />
                </label>

                <div className="owcWhenWhere">

                  <label>
                    <span>DATE</span>
                    <input
                      type="date"
                      value={editing.date}
                      onChange={(e)=>
                        updateMoment("date",e.target.value)
                      }
                    />
                  </label>

                  <label>
                    <span>TIME</span>
                    <input
                      type="time"
                      value={editing.time}
                      onChange={(e)=>
                        updateMoment("time",e.target.value)
                      }
                    />
                  </label>

                  <label>
                    <span>PLACE</span>
                    <input
                      value={editing.place}
                      placeholder="Cinema, our place..."
                      onChange={(e)=>
                        updateMoment("place",e.target.value)
                      }
                    />
                  </label>

                </div>

                <div className="cloudUploads">{['photo','video','voice','gift'].map(kind=><div key={kind}><p>{kind.toUpperCase()}</p>{upload(`${editing.id}-${kind}`,kind,editing[kind],file=>updateMoment(kind,file))}</div>)}</div>

              </div>

              <div className="owcInteractionBuilder">

                <div className="owcInteractionTitle">
                  <span>OPTIONAL</span>
                  <h3>Make it interactive ♡</h3>
                  <p>
                    Let {recipient || "them"} respond to this moment.
                  </p>
                </div>

                <label className="owcSwitch">
                  <input
                    type="checkbox"
                    checked={editing.interaction?.enabled || false}
                    onChange={(e)=>
                      updateInteraction("enabled",e.target.checked)
                    }
                  />

                  <span/>

                  <b>
                    {editing.interaction?.enabled
                      ? "INTERACTION ON"
                      : "ADD INTERACTION"}
                  </b>
                </label>

                {editing.interaction?.enabled && (
                  <>
                    <div className="owcInteractionTypes">
                      {INTERACTIONS.map((item)=>(
                        <button
                          type="button"
                          key={item.id}
                          className={
                            editing.interaction.type === item.id
                              ? "active"
                              : ""
                          }
                          onClick={()=>chooseInteraction(item)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <label className="owcMiniField">
                      <span>QUESTION</span>
                      <input
                        value={editing.interaction.question}
                        onChange={(e)=>
                          updateInteraction("question",e.target.value)
                        }
                      />
                    </label>

                    <label className="owcMiniField">
                      <span>LITTLE NOTE</span>
                      <input
                        value={editing.interaction.text}
                        onChange={(e)=>
                          updateInteraction("text",e.target.value)
                        }
                      />
                    </label>

                    <label className="owcMiniField">
                      <span>BUTTON</span>
                      <input
                        value={editing.interaction.button}
                        onChange={(e)=>
                          updateInteraction("button",e.target.value)
                        }
                      />
                    </label>

                    <div className="owcResponsePreview">
                      <span>WHAT YOU'LL BE NOTIFIED</span>
                      <p>
                        {editing.interaction.response ||
                          `${recipient} wants to do this with you ♡`}
                      </p>
                    </div>
                  </>
                )}

              </div>

            </div>

            <div className="owcEditorActions">
              <button
                type="button"
                onClick={deleteMoment}
              >
                DELETE
              </button>

              <button
                type="button"
                disabled={uploadBusy||busy} onClick={()=>setEditingId(null)}
              >
                SAVE MOMENT ♡
              </button>
            </div>

          </div>
        </div>
      )}

      <style jsx>{`.cloudNotice{position:relative;z-index:300;padding:16px;background:#fff4ee;color:#653441;}.cloudUploads{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;}.cloudUploads p{font:700 10px Arial,sans-serif;letter-spacing:.1em;}@media(max-width:600px){.cloudUploads{grid-template-columns:1fr;}}`}</style>
    </main>
  );
}

