"use client";

import WishOpeningCard from "../../components/WishOpeningCard";
import { useEffect, useMemo, useRef, useState } from "react";
import CouponAttachmentUpload from "../../components/CouponAttachmentUpload";
import WishNoteMedia from "../../components/WishNoteMedia";
import { EMPTY_WISH_DRAFT, WISH_DRAFT_KEY } from "../../lib/use-wish-draft";
import CuteCalendar from "../../components/CuteCalendar";



const defaultCategories = [
  {
    id: "dream",
    name: "Dream Together",
    icon: "♡",
    description: "Something you dream of doing together",
  },
  {
    id: "food",
    name: "Food & Places",
    icon: "✦",
    description: "A restaurant, trip or place to discover",
  },
  {
    id: "time",
    name: "Our Time",
    icon: "♥",
    description: "A date or little moment together",
  },
  {
    id: "little",
    name: "Little Things",
    icon: "☺",
    description: "Something simple that would make you happy",
  },
  {
    id: "adventures",
    name: "Adventures",
    icon: "∞",
    description: "Something exciting you've always wanted to try",
  },
  {
    id: "special",
    name: "Something Special",
    icon: "✉",
    description: "Anything that doesn't fit anywhere else",
  },
];

const pad = (number) => String(number).padStart(2, "0");

const toDateValue = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export default function WishNoteGift({giftId = null}) {
  const [gift,setGift]=useState(null),[claimToken,setClaimToken]=useState("");
  const [loadError,setLoadError]=useState(""),[actionError,setActionError]=useState(""),[saving,setSaving]=useState(false);
  const [uploadStates,setUploadStates]=useState({});
  const uploadBusy=Object.values(uploadStates).some(Boolean);
  const pendingWishId=useRef(null),savingRef=useRef(false);
  const TOTAL_WISHES=gift?.wishCount||24;
  const categories=defaultCategories.map((c,i)=>({...c,name:gift?.categories?.[i]||c.name}));
  const [loaded, setLoaded] = useState(false);

  const [step, setStep] = useState("card");

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [wishText, setWishText] = useState("");
  const [wishDate, setWishDate] = useState("");
  const [wishTime, setWishTime] = useState("");
  const [wishPlace, setWishPlace] = useState("");

  const [wishes, setWishes] = useState([]);

  const [openedWish, setOpenedWish] = useState(null);

  const [memoryNote, setMemoryNote] = useState("");
  const [memoryFiles, setMemoryFiles] = useState([]);

  const [calendarDate, setCalendarDate] = useState(new Date());

  /* =========================================================
     LOAD
     ========================================================= */

  useEffect(() => {
    let cancelled=false;const controller=new AbortController();
    const token=new URLSearchParams(window.location.search).get("claim")||"";setClaimToken(token);
    if(!giftId){
      try{const draft={...EMPTY_WISH_DRAFT,...JSON.parse(localStorage.getItem(WISH_DRAFT_KEY)||"{}")};setGift({...draft,wishCount:draft.isCustom?Number(draft.customWishCount):draft.wishCount});}catch{setGift(EMPTY_WISH_DRAFT);}
      setLoaded(true);return;
    }
    setLoaded(false);setLoadError("");
    fetch(`/api/gifts/${encodeURIComponent(giftId)}`,{cache:"no-store",headers:token?{"x-wiveli-gift-token":token}:{},signal:controller.signal})
      .then(async res=>{const data=await res.json();if(!res.ok||data.giftType!=="wish-note")throw Error(data.error||"Could not open this Wish Note. Please use the original private link.");return data.giftData;})
      .then(data=>{if(cancelled)return;setGift(data);setWishes(data.wishes||[]);setLoaded(true);fetch(`/api/gifts/${encodeURIComponent(giftId)}/opened`,{method:"POST",headers:token?{"x-wiveli-gift-token":token}:{}}).catch(()=>{});})
      .catch(e=>{if(!cancelled)setLoadError(e.message);});
    return()=>{cancelled=true;controller.abort();};
  },[giftId]);

  async function saveAction(body) {
    const res=await fetch(`/api/gifts/${encodeURIComponent(giftId)}/wish-note`,{method:"POST",headers:{"Content-Type":"application/json",...(claimToken?{"x-wiveli-gift-token":claimToken}:{})},body:JSON.stringify(body)});
    const data=await res.json();if(!res.ok)throw Error(data.error||"Could not save your wish.");setWishes(data.wishes);return data.wish;
  }

  /* =========================================================
     COUNTERS
     ========================================================= */

  const completedCount = wishes.filter(
    (wish) => wish.completed || wish.memory
  ).length;

  const createdCount = wishes.length;

  const remainingSlots = Math.max(
    TOTAL_WISHES - createdCount,
    0
  );

  /* =========================================================
     HELPERS
     ========================================================= */

  const formatDate = (date) => {
    if (!date) return "Any day";

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${date}T12:00:00`));
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setWishText("");
    setWishDate("");
    setWishTime("");
    setWishPlace("");
  };

  const closeEverything = () => {
    if(savingRef.current||uploadBusy)return;
    setActionError("");
    pendingWishId.current=null;
    resetForm();

    setOpenedWish(null);
    setMemoryNote("");
    setMemoryFiles([]);

    setStep("card");
  };

  /* =========================================================
     CREATE WISH
     ========================================================= */

  const saveWish = async () => {
    if(savingRef.current||!selectedCategory||!wishText.trim()||!wishDate)return;
    if(createdCount>=TOTAL_WISHES){setStep("limit");return;}
    savingRef.current=true;setSaving(true);setActionError("");
    pendingWishId.current ||= crypto.randomUUID();
    try {
      const body={action:"create",wishId:pendingWishId.current,categoryId:selectedCategory.id,text:wishText.trim(),date:wishDate,time:wishTime,place:wishPlace.trim(),timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC"};
      let newWish;
      if(giftId)newWish=await saveAction(body);
      else {newWish={...body,id:body.wishId,category:selectedCategory,createdAt:new Date().toISOString(),completed:false,memory:null};setWishes(previous=>[...previous,newWish]);}
      setOpenedWish(newWish);pendingWishId.current=null;resetForm();setStep("success");
    }catch(e){setActionError(e.message);}finally{savingRef.current=false;setSaving(false);}
  };

  /* =========================================================
     OPEN WISH
     ========================================================= */

  const openWish = (wish) => {
    setOpenedWish(wish);

    setMemoryNote(
      wish.memory?.note || ""
    );

    setMemoryFiles(wish.memory?.files || []);

    setStep("wish-detail");
  };

  /* =========================================================
     MEMORY / COMPLETE
     ========================================================= */

  const saveMemory = async () => {
    if(!openedWish||savingRef.current||uploadBusy)return;
    savingRef.current=true;setSaving(true);setActionError("");
    try {
      let updatedWish;
      if(giftId)updatedWish=await saveAction({action:"memory",wishId:openedWish.id,note:memoryNote.trim(),files:memoryFiles});
      else {updatedWish={...openedWish,completed:true,completedAt:new Date().toISOString(),memory:{note:memoryNote.trim(),files:[],updatedAt:new Date().toISOString()}};setWishes(previous=>previous.map(w=>w.id===openedWish.id?updatedWish:w));}
      setOpenedWish(updatedWish);setStep("memory-saved");
    }catch(e){setActionError(e.message);}finally{savingRef.current=false;setSaving(false);}
  };

  /* =========================================================
     CALENDAR
     ========================================================= */

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const calendarDays = useMemo(() => {
    const first = new Date(
      year,
      month,
      1
    );

    const mondayIndex =
      (first.getDay() + 6) % 7;

    return Array.from(
      { length: 42 },
      (_, index) => {
        const date = new Date(
          year,
          month,
          index - mondayIndex + 1
        );

        return {
          date,
          value: toDateValue(date),
          number: date.getDate(),

          currentMonth:
            date.getMonth() === month,
        };
      }
    );
  }, [year, month]);

  const monthName =
    new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(calendarDate);

  const changeCalendarMonth = (
    amount
  ) => {
    setCalendarDate(
      new Date(
        year,
        month + amount,
        1
      )
    );
  };

  const wishesByDate = useMemo(() => {
    const map = {};

    wishes.forEach((wish) => {
      if (!wish.date) return;

      if (!map[wish.date]) {
        map[wish.date] = [];
      }

      map[wish.date].push(wish);
    });

    return map;
  }, [wishes]);

  /* =========================================================
     RENDER
     ========================================================= */

  if(!loaded)return <main style={{padding:40}}><p role={loadError?"alert":"status"}>{loadError||"Opening your Wish Note…"}</p>{loadError&&<button onClick={()=>window.location.reload()}>TRY AGAIN</button>}</main>;
  return (
    <main className={`wishExperience wishStyle-${gift?.style || "soft"}`}>
      {!giftId && <p className="wishNotice">PREVIEW ONLY · Nothing here is sent or saved to an account.</p>}
      {(actionError||saving) && <div className="wishActionNotice" role={actionError?"alert":"status"}>{actionError||"Saving…"}{actionError&&<button onClick={()=>setActionError("")}>CLOSE</button>}</div>}
      <style jsx>{`.wishNotice{position:relative;z-index:2;padding:12px;text-align:center;font:12px Arial,sans-serif;}.wishActionNotice{position:fixed;z-index:10000;bottom:20px;left:5%;width:90%;box-sizing:border-box;background:#fffaf5;color:#692f3c;padding:16px;border:1px solid #bc9098;border-radius:16px;box-shadow:0 4px 30px #0002;}.wishActionNotice button{margin-left:12px;}.wishGiftExtras{position:relative;max-width:820px;margin:24px auto;padding:20px;border-radius:20px;background:#fff8f2;color:#692f3c;}.wishStyle-minimal{background:#f3f0e9;}.wishStyle-film{background:#e7d8bd;}.wishStyle-dark{background:#271d26;}.wishOpeningPhoto{overflow:auto;}.wishOpeningPhotoShade{pointer-events:none;}`}</style>

      <div className="wishExperienceGlow wishExperienceGlowOne" />
      <div className="wishExperienceGlow wishExperienceGlowTwo" />

      <header className="wishExperienceHeader">
        <div>
          WISH NOTE <span>♡</span>
        </div>

        <p>MADE WITH WIVELI</p>
      </header>

      {/* =====================================================
          MAIN CARD
          ===================================================== */}

      <div className={`wishPolaroidStage ${step !== "card" ? "isBlurred" : ""}`}>
        <WishOpeningCard gift={gift || {}} giftId={giftId} claimToken={claimToken} hasWishes={wishes.length>0} completedCount={completedCount} disabled={createdCount>=TOTAL_WISHES} buttonLabel={createdCount>=TOTAL_WISHES?"ALL WISHES MADE":"MAKE A WISH"} onOpen={()=>setStep(createdCount>=TOTAL_WISHES?"limit":"category")}/>
      </div>
      <style jsx>{`.wishExperienceHeader{position:relative;top:auto;left:auto;right:auto;gap:16px;padding:12px 4px;flex-wrap:wrap;}.wishPolaroidStage{position:relative;z-index:1;width:calc(100% - 32px);max-width:620px;margin:24px auto 40px;}.wishPolaroidStage.isBlurred{filter:blur(7px);pointer-events:none;}`}</style>

      {step === "card" && Object.keys(gift?.attachments||{}).some(kind=>kind!=="photo") && <details className="wishGiftExtras"><summary>SOMETHING EXTRA FOR YOU ♡</summary>{giftId?<WishNoteMedia giftId={giftId} claimToken={claimToken} excludePhoto/>:<WishNoteMedia preview={Object.fromEntries(Object.entries(gift.attachments).filter(([kind])=>kind!=="photo"))}/>}</details>}

      {/* =====================================================
          CALENDAR / BOOK BUTTONS
          ===================================================== */}

      {wishes.length > 0 &&
        step === "card" && (

          <div className="wishLifeLauncher">

            <button
              type="button"
              onClick={() =>
                setStep("calendar")
              }
            >

              <span>♡</span>

              <div>
                <small>
                  OUR CALENDAR
                </small>

                <strong>
                  {completedCount} /{" "}
                  {TOTAL_WISHES} completed
                </strong>
              </div>

              <b>→</b>

            </button>

            <button
              type="button"
              onClick={() =>
                setStep("book")
              }
            >

              <span>✦</span>

              <div>
                <small>
                  OUR WISH BOOK
                </small>

                <strong>
                  {completedCount}{" "}
                  {completedCount === 1
                    ? "memory"
                    : "memories"}
                </strong>
              </div>

              <b>→</b>

            </button>

          </div>

        )}

      {/* =====================================================
          MODALS
          ===================================================== */}

      {step !== "card" && (

        <div className="wishModalLayer">

          {/* CATEGORY */}

          {step === "category" && (

            <div className="wishGlassModal wishCategoryModal">

              <button
                className="wishModalClose"
                type="button"
                onClick={closeEverything}
              >
                ×
              </button>

              <div className="wishModalHeading">

                <p>
                  MAKE A WISH ♡
                </p>

                <h2>
                  WHAT ARE YOU
                  <br />
                  WISHING FOR?
                </h2>

                <span>
                  Choose the feeling that fits your wish.
                </span>

              </div>

              <div className="wishModalCategories">

                {categories.map(
                  (category, index) => (

                    <button
                      type="button"
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(
                          category
                        );

                        setStep("wish");
                      }}
                    >

                      <div className="wishModalCategoryTop">

                        <small>
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </small>

                        <i>
                          {category.icon}
                        </i>

                      </div>

                      <div>

                        <strong>
                          {category.name}
                        </strong>

                        <span>
                          {
                            category.description
                          }
                        </span>

                      </div>

                      <b>↗</b>

                    </button>

                  )
                )}

              </div>

            </div>

          )}

          {/* WRITE WISH */}

          {step === "wish" &&
            selectedCategory && (

              <div className="wishGlassModal wishWriteModal">

                <button
                  className="wishModalBack"
                  type="button"
                  onClick={() =>
                    setStep(
                      "category"
                    )
                  }
                >
                  ←
                </button>

                <button
                  className="wishModalClose"
                  type="button"
                  onClick={
                    closeEverything
                  }
                >
                  ×
                </button>

                <div className="wishSelectedCategory">

                  <span>
                    {
                      selectedCategory.icon
                    }
                  </span>

                  {
                    selectedCategory.name
                  }

                </div>

                <div className="wishModalHeading">

                  <p>YOUR WISH</p>

                  <h2>
                    TELL ME
                    <br />
                    EVERYTHING
                    <span>.</span>
                  </h2>

                  <span>
                    What would make you smile?
                  </span>

                </div>

                <label className="wishMainInput">

                  <span>
                    WHAT DO YOU WISH FOR?
                  </span>

                  <textarea
                    rows={4}
                    maxLength={180}
                    value={wishText}
                    onChange={(event) =>
                      setWishText(
                        event.target.value
                      )
                    }
                    placeholder="I wish we could..."
                    autoFocus
                  />

                  <small>
                    {wishText.length}/180
                  </small>

                </label>

                <button
                  type="button"
                  className="wishContinueButton"
                  disabled={
                    !wishText.trim()
                  }
                  onClick={() =>
                    setStep("date")
                  }
                >

                  CHOOSE WHEN

                  <span>→</span>

                </button>

              </div>

            )}

          {/* DATE */}

          {step === "date" && (

            <div className="wishGlassModal wishDateModal">

              <button
                className="wishModalBack"
                type="button"
                onClick={() =>
                  setStep("wish")
                }
              >
                ←
              </button>

              <button
                className="wishModalClose"
                type="button"
                onClick={
                  closeEverything
                }
              >
                ×
              </button>

              <div className="wishModalHeading">

                <p>
                  WHEN SHOULD IT HAPPEN?
                </p>

                <h2>
                  PICK YOUR
                  <br />
                  PERFECT DAY
                  <span>.</span>
                </h2>

              </div>

              <div className="wishCalendarGlass">

                <CuteCalendar
                  value={wishDate}
                  onChange={
                    setWishDate
                  }
                  onClose={() => {}}
                />

              </div>

              <div className="wishDateDetails">

                <label>

                  <span>TIME</span>

                  <input
                    type="time"
                    value={wishTime}
                    onChange={(event) =>
                      setWishTime(
                        event.target.value
                      )
                    }
                  />

                </label>

                <label>

                  <span>PLACE</span>

                  <input
                    type="text"
                    maxLength={80}
                    value={wishPlace}
                    onChange={(event) =>
                      setWishPlace(
                        event.target.value
                      )
                    }
                    placeholder="Somewhere special..."
                  />

                </label>

              </div>

              <button
                type="button"
                className="wishContinueButton"
                disabled={!wishDate}
                onClick={() =>
                  setStep("review")
                }
              >

                REVIEW MY WISH

                <span>→</span>

              </button>

            </div>

          )}

          {/* REVIEW */}

          {step === "review" && (

            <div className="wishGlassModal wishReviewModal">

              <button
                className="wishModalClose"
                type="button"
                onClick={
                  closeEverything
                }
              >
                ×
              </button>

              <div className="wishReviewHeart">
                ♡
              </div>

              <div className="wishModalHeading">

                <p>ONE LAST LOOK</p>

                <h2>
                  YOUR
                  <br />
                  WISH
                  <span>.</span>
                </h2>

                <span>
                  Make sure everything feels right.
                </span>

              </div>

              <div className="wishReviewCard">

                <div className="wishReviewCategory">

                  <span>
                    {
                      selectedCategory?.icon
                    }
                  </span>

                  <p>
                    {
                      selectedCategory?.name
                    }
                  </p>

                </div>

                <h3>
                  {wishText}
                </h3>

                <div className="wishReviewDetails">

                  <div>
                    <small>
                      DATE
                    </small>

                    <strong>
                      {formatDate(
                        wishDate
                      )}
                    </strong>
                  </div>

                  <div>
                    <small>
                      TIME
                    </small>

                    <strong>
                      {wishTime ||
                        "Any time"}
                    </strong>
                  </div>

                  <div>
                    <small>
                      PLACE
                    </small>

                    <strong>
                      {wishPlace ||
                        "Anywhere"}
                    </strong>
                  </div>

                </div>

              </div>

              <div className="wishReviewActions">

                <button
                  type="button"
                  className="wishEditButton"
                  onClick={() =>
                    setStep("wish")
                  }
                >
                  ← EDIT
                </button>

                <button
                  type="button"
                  className="wishSendButton"
                  disabled={saving}
                  onClick={saveWish}
                >

                  SEND MY WISH

                  <span>♡</span>

                </button>

              </div>

            </div>

          )}

          {/* WISH SAVED */}

          {step === "success" && (

            <div className="wishGlassModal wishSuccessModal">

              <div className="wishSuccessSymbol">
                ♥
              </div>

              <p>WISH SAVED</p>

              <h2>
                YOUR WISH
                <br />
                IS ON ITS WAY
                <span>.</span>
              </h2>

              <div className="wishSuccessLine" />

              <p className="wishSuccessText">
                Your wish now has a place
                <br />
                in your shared calendar.
              </p>

              <button
                type="button"
                onClick={() =>
                  setStep("calendar")
                }
              >
                OPEN OUR CALENDAR
              </button>

              <button
                type="button"
                className="wishSuccessSecondary"
                onClick={() =>
                  setStep("card")
                }
              >
                BACK TO GIFT
              </button>

            </div>

          )}

          {/* =================================================
              OUR CALENDAR
              ================================================= */}

          {step === "calendar" && (

            <div className="wishGlassModal wishLifeCalendarModal">

              <button
                className="wishModalClose"
                type="button"
                onClick={() =>
                  setStep("card")
                }
              >
                ×
              </button>

              <div className="wishModalHeading">

                <p>
                  OUR CALENDAR ♡
                </p>

                <h2>
                  WISHES BECOME
                  <br />
                  MOMENTS
                  <span>.</span>
                </h2>

                <span>
                  {completedCount} /{" "}
                  {TOTAL_WISHES} completed
                  · tap a marked day
                  to open the wish.
                </span>

              </div>

              <div className="wishCalendarProgress">

                <div>
                  <strong>
                    {completedCount}
                  </strong>
                  <span>
                    COMPLETED
                  </span>
                </div>

                <div>
                  <strong>
                    {createdCount}
                  </strong>
                  <span>
                    CREATED
                  </span>
                </div>

                <div>
                  <strong>
                    {remainingSlots}
                  </strong>
                  <span>
                    LEFT
                  </span>
                </div>

              </div>

              <div className="wishLifeCalendar">

                <div className="wishLifeCalendarTop">

                  <button
                    type="button"
                    onClick={() =>
                      changeCalendarMonth(
                        -1
                      )
                    }
                  >
                    ‹
                  </button>

                  <h3>
                    {monthName}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      changeCalendarMonth(
                        1
                      )
                    }
                  >
                    ›
                  </button>

                </div>

                <div className="wishLifeWeek">

                  {[
                    "MON",
                    "TUE",
                    "WED",
                    "THU",
                    "FRI",
                    "SAT",
                    "SUN",
                  ].map((day) => (
                    <span key={day}>
                      {day}
                    </span>
                  ))}

                </div>

                <div className="wishLifeDays">

                  {calendarDays.map(
                    (day) => {

                      const dayWishes =
                        wishesByDate[
                          day.value
                        ] || [];

                      return (
                        <button
                          type="button"
                          key={day.date.toISOString()}
                          className={[
                            "wishLifeDay",

                            !day.currentMonth
                              ? "outside"
                              : "",

                            dayWishes.length
                              ? "hasWish"
                              : "",

                            dayWishes.some(
                              (wish) =>
                                wish.completed ||
                                wish.memory
                            )
                              ? "hasCompletedWish"
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          onClick={() => {
                            if (
                              dayWishes.length
                            ) {
                              openWish(
                                dayWishes[0]
                              );
                            }
                          }}
                        >

                          <small>
                            {day.number}
                          </small>

                          {dayWishes.length >
                            0 && (

                            <div className="wishLifeDayIcons">

                              {dayWishes
                                .slice(0, 3)
                                .map(
                                  (wish) => (

                                    <span
                                      key={
                                        wish.id
                                      }
                                      className={
                                        wish.completed ||
                                        wish.memory
                                          ? "completed"
                                          : ""
                                      }
                                    >
                                      {wish
                                        .category
                                        ?.icon ||
                                        "♡"}
                                    </span>

                                  )
                                )}

                            </div>

                          )}

                        </button>
                      );
                    }
                  )}

                </div>

              </div>

              <div className="wishCalendarLegend">

                {categories.map(
                  (category) => (

                    <span
                      key={
                        category.id
                      }
                    >
                      <i>
                        {
                          category.icon
                        }
                      </i>

                      {
                        category.name
                      }
                    </span>

                  )
                )}

              </div>

            </div>

          )}

          {/* =================================================
              WISH DETAILS
              ================================================= */}

          {step === "wish-detail" &&
            openedWish && (

              <div className="wishGlassModal wishMemoryModal">

                <button
                  className="wishModalBack"
                  type="button"
                  onClick={() =>
                    setStep(
                      "calendar"
                    )
                  }
                >
                  ←
                </button>

                <button
                  className="wishModalClose"
                  type="button"
                  onClick={
                    closeEverything
                  }
                >
                  ×
                </button>

                <div className="wishMemoryCategory">

                  <span>
                    {
                      openedWish
                        .category
                        ?.icon
                    }
                  </span>

                  {
                    openedWish
                      .category
                      ?.name
                  }

                </div>

                <p className="wishMemoryDate">
                  {formatDate(
                    openedWish.date
                  )}
                </p>

                <h2 className="wishMemoryWish">
                  “{openedWish.text}”
                </h2>

                <div className="wishMemoryMeta">

                  <div>
                    <small>
                      TIME
                    </small>

                    <strong>
                      {openedWish.time ||
                        "Any time"}
                    </strong>
                  </div>

                  <div>
                    <small>
                      PLACE
                    </small>

                    <strong>
                      {openedWish.place ||
                        "Anywhere"}
                    </strong>
                  </div>

                </div>

                {openedWish.completed ||
                openedWish.memory ? (

                  <div className="wishExistingMemory">

                    <p>
                      THIS BECAME A MEMORY ♡
                    </p>

                    {giftId && <WishNoteMedia giftId={giftId} wishId={openedWish.id} claimToken={claimToken} revision={openedWish.memory?.updatedAt}/>}
                    <blockquote>
                      {openedWish
                        .memory
                        ?.note ||
                        "A little moment worth remembering."}
                    </blockquote>

                    {!!openedWish
                      .memory?.files
                      ?.length && (

                      <span>
                        {
                          openedWish
                            .memory
                            .files
                            .length
                        }{" "}
                        media{" "}
                        {openedWish
                          .memory
                          .files
                          .length ===
                        1
                          ? "file"
                          : "files"}
                      </span>

                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setStep(
                          "memory"
                        )
                      }
                    >
                      EDIT MEMORY
                    </button>

                  </div>

                ) : (

                  <button
                    type="button"
                    className="wishContinueButton"
                    onClick={() =>
                      setStep(
                        "memory"
                      )
                    }
                  >

                    ADD A MEMORY

                    <span>♡</span>

                  </button>

                )}

              </div>

            )}

          {/* =================================================
              ADD MEMORY
              ================================================= */}

          {step === "memory" &&
            openedWish && (

              <div className="wishGlassModal wishAddMemoryModal">

                <button
                  className="wishModalBack"
                  type="button"
                  onClick={() =>
                    setStep(
                      "wish-detail"
                    )
                  }
                >
                  ←
                </button>

                <button
                  className="wishModalClose"
                  type="button"
                  onClick={
                    closeEverything
                  }
                >
                  ×
                </button>

                <div className="wishModalHeading">

                  <p>
                    ADD A MEMORY ♡
                  </p>

                  <h2>
                    KEEP THIS
                    <br />
                    MOMENT
                    <span>.</span>
                  </h2>

                  <span>
                    Completing this memory marks the wish as completed.
                  </span>

                </div>

                {giftId ? ['photo','video','voice','gift'].map(kind=><div key={kind}><p>{kind.toUpperCase()}</p><CouponAttachmentUpload kind={kind} attachment={memoryFiles.find(file=>file.kind===kind)} endpoint={`/api/gifts/${encodeURIComponent(giftId)}/wish-note/uploads`} headers={claimToken?{"x-wiveli-gift-token":claimToken}:{}} onBusy={value=>setUploadStates(previous=>({...previous,[kind]:value}))} saveHint="Uploaded. Save this memory to attach it to the wish." onChange={file=>setMemoryFiles(previous=>[...previous.filter(f=>f.kind!==kind),...(file?[{...file,kind}]:[])])}/></div>) : <p>File uploads become available in the saved gift.</p>}

                <label className="wishMainInput">

                  <span>
                    YOUR NOTE
                  </span>

                  <textarea
                    rows={4}
                    maxLength={300}
                    value={memoryNote}
                    onChange={(event) =>
                      setMemoryNote(
                        event.target.value
                      )
                    }
                    placeholder="What made this day special?"
                  />

                  <small>
                    {memoryNote.length}
                    /300
                  </small>

                </label>

                <button
                  type="button"
                  className="wishContinueButton"
                  disabled={saving||uploadBusy}
                  onClick={saveMemory}
                >

                  SAVE THIS MEMORY

                  <span>♡</span>

                </button>

                <p className="wishMemoryStorageNotice">
                  Your files will stay with this wish after you save the memory.
                </p>

              </div>

            )}

          {/* =================================================
              MEMORY SAVED
              ================================================= */}

          {step ===
            "memory-saved" && (

            <div className="wishGlassModal wishSuccessModal">

              <div className="wishSuccessSymbol">
                ✦
              </div>

              <p>
                WISH COMPLETED
              </p>

              <h2>
                ONE WISH
                <br />
                BECAME A MEMORY
                <span>.</span>
              </h2>

              <div className="wishSuccessLine" />

              <p className="wishSuccessText">

                {completedCount} /{" "}
                {TOTAL_WISHES} wishes
                completed.

              </p>

              <button
                type="button"
                onClick={() =>
                  setStep("book")
                }
              >
                OPEN OUR WISH BOOK
              </button>

              <button
                type="button"
                className="wishSuccessSecondary"
                onClick={() =>
                  setStep(
                    "calendar"
                  )
                }
              >
                BACK TO CALENDAR
              </button>

            </div>

          )}

          {/* =================================================
              WISH BOOK
              ================================================= */}

          {step === "book" && (

            <div className="wishGlassModal wishBookModal">

              <button
                className="wishModalClose"
                type="button"
                onClick={() =>
                  setStep("card")
                }
              >
                ×
              </button>

              <div className="wishModalHeading">

                <p>
                  OUR WISH BOOK ♡
                </p>

                <h2>
                  OUR LITTLE
                  <br />
                  STORY
                  <span>.</span>
                </h2>

                <span>
                  Wishes that turned into something real.
                </span>

              </div>

              <div className="wishBookStats">

                <div>
                  <strong>
                    {completedCount}
                  </strong>

                  <span>
                    COMPLETED
                  </span>
                </div>

                <div>
                  <strong>
                    {TOTAL_WISHES}
                  </strong>

                  <span>
                    TOTAL WISHES
                  </span>
                </div>

              </div>

              <div className="wishBookProgress">

                <div
                  style={{
                    width: `${Math.min(
                      100,
                      (completedCount /
                        TOTAL_WISHES) *
                        100
                    )}%`,
                  }}
                />

              </div>

              <p className="wishBookProgressText">
                {completedCount} /{" "}
                {TOTAL_WISHES} wishes
                became memories
              </p>

              <div className="wishBookList">

                {wishes
                  .filter(
                    (wish) =>
                      wish.completed ||
                      wish.memory
                  )
                  .sort(
                    (a, b) =>
                      new Date(
                        a.date
                      ) -
                      new Date(
                        b.date
                      )
                  )
                  .map(
                    (wish, index) => (

                      <button
                        type="button"
                        key={wish.id}
                        onClick={() =>
                          openWish(
                            wish
                          )
                        }
                      >

                        <small>
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </small>

                        <span>
                          {
                            wish.category
                              ?.icon
                          }
                        </span>

                        <div>

                          <strong>
                            {wish.text}
                          </strong>

                          <p>
                            {formatDate(
                              wish.date
                            )}
                          </p>

                        </div>

                        <b>↗</b>

                      </button>

                    )
                  )}

                {completedCount ===
                  0 && (

                  <div className="wishBookEmpty">

                    <span>♡</span>

                    <strong>
                      Your story starts here.
                    </strong>

                    <p>
                      When a wish comes true,
                      add a memory and it
                      will become part of
                      your story.
                    </p>

                  </div>

                )}

              </div>

            </div>

          )}

          {/* =================================================
              LIMIT
              ================================================= */}

          {step === "limit" && (

            <div className="wishGlassModal wishSuccessModal">

              <div className="wishSuccessSymbol">
                ♡
              </div>

              <p>
                ALL WISHES CREATED
              </p>

              <h2>
                NOW LET THEM
                <br />
                BECOME MEMORIES
                <span>.</span>
              </h2>

              <div className="wishSuccessLine" />

              <p className="wishSuccessText">
                You have used all{" "}
                {TOTAL_WISHES} wishes.
                <br />
                Your story is just beginning.
              </p>

              <button
                type="button"
                onClick={() =>
                  setStep(
                    "calendar"
                  )
                }
              >
                OPEN OUR CALENDAR
              </button>

            </div>

          )}

        </div>

      )}

    </main>
  );
}

