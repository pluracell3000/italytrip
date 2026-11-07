"use client";
import { useState } from "react";
import {
  RefreshCw,
  Pause,
  Play,
  Plus,
  Settings,
  ShieldCheck,
} from "lucide-react";
import type { AppState } from "@/lib/state";
import { dateTime } from "@/lib/display";
export function Admin({
  data,
  action,
  refresh,
}: {
  data: AppState;
  action: (a: any) => Promise<void>;
  refresh: () => Promise<void>;
}) {
  const [editVersion, setEditVersion] = useState(data.version);
  const [config, setConfig] = useState(data.config),
    [message, setMessage] = useState(""),
    [scanning, setScanning] = useState(false),
    [raw, setRaw] = useState(JSON.stringify(data.config, null, 2));
  const save = async (c: any) => {
    try {
      await action({ type: "config", version: editVersion, config: c });
      setEditVersion(editVersion + 1);
      setConfig(c);
      setRaw(JSON.stringify(c, null, 2));
      setMessage("ההגדרות נשמרו. הצעות מהגרסה הקודמת אינן תקפות.");
    } catch {
      setMessage("שמירה נכשלה. בדקו תאריכים רציפים, ערכים וגרסת הגדרות.");
    }
  };
  return (
    <div className="admin">
      <h1 className="page-title">מאחורי הקלעים</h1>
      <p className="muted">
        הגדרות, עדויות ובריאות המערכת. שינויים נשמרים לכל המשפחה.
      </p>
      <div className="admin-grid">
        <section className="panel">
          <h2>
            <Settings size={21} /> הגדרות המסע
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void save(config);
            }}
          >
            <div className="filter-grid">
              <label>
                מבוגרים
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={config.adults}
                  onChange={(e) =>
                    setConfig({ ...config, adults: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                תקציב מרבי ללילה (€)
                <input
                  type="number"
                  min="1"
                  max="2000"
                  value={config.budgetNightly}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      budgetNightly: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={config.yearConfirmed}
                  onChange={(e) =>
                    setConfig({ ...config, yearConfirmed: e.target.checked })
                  }
                />{" "}
                שנת הנסיעה והתאריכים מאושרים
              </label>
            </div>
            {config.bases.map((b, i) => (
              <fieldset key={b.id}>
                <legend>{b.name}</legend>
                <div className="filter-grid">
                  <label>
                    כניסה
                    <input
                      type="date"
                      required
                      value={b.checkIn}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          bases: config.bases.map((x, j) =>
                            j === i ? { ...x, checkIn: e.target.value } : x,
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    עזיבה
                    <input
                      type="date"
                      required
                      value={b.checkOut}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          bases: config.bases.map((x, j) =>
                            j === i ? { ...x, checkOut: e.target.value } : x,
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    רדיוס חיפוש (ק״מ)
                    <input
                      type="number"
                      min="1"
                      max="80"
                      value={b.radiusKm}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          bases: config.bases.map((x, j) =>
                            j === i
                              ? { ...x, radiusKm: Number(e.target.value) }
                              : x,
                          ),
                        })
                      }
                    />
                  </label>
                </div>
              </fieldset>
            ))}
            <button className="primary" type="submit">
              שמירת הגדרות
            </button>
            <p className="muted">
              שינוי הגדרות מעלה את גרסת החיפוש. הבחירות המשפחתיות נשמרות,
              ומחירים ישנים אינם מוצגים לתאריכים החדשים.
            </p>
          </form>
          <details>
            <summary>עריכת בסיסים, עיירות, דרישות ותקרות</summary>
            <p>
              מזהי הבסיסים קבועים. אפשר לשנות שמות, עיירות, מיקומים ורדיוס.
              המיקום חייב להיות מדרום לפירנצה. החיפוש לפי עיירות; מרחק נכס לא
              מאומת עד שמתקבלות קואורדינטות מקור.
            </p>
            <label htmlFor="config-json">הגדרות JSON</label>
            <textarea
              id="config-json"
              className="code-input"
              dir="ltr"
              rows={20}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
            />
            <button
              onClick={() => {
                try {
                  void save(JSON.parse(raw));
                } catch {
                  setMessage("JSON אינו תקין");
                }
              }}
            >
              שמירת הגדרות מתקדמות
            </button>
          </details>
        </section>
        <div>
          <section className="panel">
            <h2>
              <ShieldCheck size={22} /> מצב הסריקות
            </h2>
            <dl className="status-list">
              <div>
                <dt>מפתח חיפוש Brave</dt>
                <dd>
                  {data.providers.brave ? "מוגדר; בדקו תוצאות משימות" : "חסר"}
                </dd>
              </div>
              <div>
                <dt>מלאי לתאריכים</dt>
                <dd>אין ספק מורשה מחובר</dd>
              </div>
              <div>
                <dt>סריקה מלאה מוצלחת</dt>
                <dd>{dateTime(data.lastSuccess)}</dd>
              </div>
              <div>
                <dt>גילוי מוצלח אחרון</dt>
                <dd>{dateTime(data.lastDiscovery)}</dd>
              </div>
              <div>
                <dt>ניסיון אחרון</dt>
                <dd>{dateTime(data.runs[0]?.started_at)}</dd>
              </div>
              <div>
                <dt>החלון היומי הבא</dt>
                <dd>{dateTime(data.nextExpected)}</dd>
              </div>
            </dl>
            <p>
              תזמון: <bdi>06:00 UTC</bdi> מדי יום — 08:00 בחורף / 09:00 בקיץ
              בישראל. בתוכנית Hobby ההפעלה עשויה להיות בכל זמן במהלך השעה.
            </p>
            <p>
              תקרות: {config.queryLimit} שאילתות, {config.detailLimit} בדיקות
              פרטים ועד {config.offerLimit} בדיקות הצעות (כרגע 0, ללא ספק מלאי).
              זמן ריצה מרבי: 240 שניות עבודה בתוך פונקציה של 300 שניות.
            </p>
            <p>
              תקרת API יומית:{" "}
              <bdi>${(config.dailyCapMicrousd / 1e6).toFixed(2)}</bdi> · חודשית:{" "}
              <bdi>${(config.monthlyCapMicrousd / 1e6).toFixed(2)}</bdi>. גם
              סריקות ידניות נספרות.
            </p>
            <div className="card-actions">
              <button
                disabled={
                  scanning ||
                  !data.scansEnabled ||
                  !data.providers.brave ||
                  config.paused
                }
                onClick={async () => {
                  setScanning(true);
                  setMessage("הסריקה פועלת. אפשר לעקוב אחר המשימות למטה.");
                  try {
                    const r = await fetch("/api/scan", {
                      method: "POST",
                      headers: { "Idempotency-Key": crypto.randomUUID() },
                    });
                    const run = await r.json();
                    setMessage(
                      r.ok
                        ? `הסריקה הסתיימה: ${run.status}; מועמדים חדשים: ${run.discovered}`
                        : `הסריקה לא התחילה: ${run.error}`,
                    );
                    await refresh();
                  } catch {
                    setMessage(
                      "החיבור לסריקה נותק. בדקו את היסטוריית הריצות לפני ניסיון נוסף.",
                    );
                  } finally {
                    setScanning(false);
                  }
                }}
              >
                <RefreshCw className={scanning ? "spin" : ""} size={16} />
                {scanning ? "הסריקה פועלת…" : "הפעלת סריקה"}
              </button>
              <button
                onClick={() =>
                  void save({ ...data.config, paused: !data.config.paused })
                }
              >
                {data.config.paused ? <Play size={16} /> : <Pause size={16} />}{" "}
                {data.config.paused ? "חידוש סריקות" : "השהיית סריקות"}
              </button>
            </div>
            {!data.scansEnabled && (
              <p className="notice">
                מתג ההפעלה בשרת כבוי. דרושים מסד נתונים, מפתח Brave והפעלת
                SCANS_ENABLED לפני סריקה אמיתית.
              </p>
            )}
          </section>
          <section className="panel">
            <h2>
              <Plus size={21} /> הוספת קישור לנכס
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const f = e.currentTarget;
                const values = Object.fromEntries(new FormData(f));
                try {
                  await action({ type: "add", ...values });
                  f.reset();
                } catch {}
              }}
            >
              <label>
                שם הנכס
                <input name="name" required maxLength={160} />
              </label>
              <label>
                כתובת מקור HTTPS
                <input
                  name="url"
                  type="url"
                  dir="ltr"
                  required
                  placeholder="https://…"
                />
              </label>
              <label>
                אזור
                <select name="baseId">
                  {data.config.bases.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">הוספת מועמד לבדיקה</button>
            </form>
          </section>
        </div>
      </div>
      <section className="panel">
        <h2>תיקון פרטים ואישור מארח</h2>
        <p>
          עדות חדשה נשמרת עם המקור והייחוס. עדויות סותרות יישארו גלויות. אישור
          פרט אינו אימות זמינות.
        </p>
        <form
          className="evidence-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const f = e.currentTarget;
            const v = Object.fromEntries(new FormData(f));
            const value =
              v.value === "true"
                ? true
                : v.value === "false"
                  ? false
                  : v.field === "floor" && /^\d$/.test(String(v.value))
                    ? Number(v.value)
                    : v.value;
            try {
              await action({ type: "evidence", ...v, value });
              f.reset();
            } catch {}
          }}
        >
          <label>
            יחידה
            <select name="unitId">
              {data.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.property_name} · {u.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            שדה
            <select name="field">
              {Object.entries({
                privateOutdoor: "שטח חוץ פרטי",
                outdoor: "תיאור שטח חוץ והצמדה",
                daylight: "אור טבעי",
                floor: "קומה",
                stairs: "מדרגות",
                elevator: "מעלית",
                kitchen: "מטבח",
                heating: "חימום",
                airConditioning: "מיזוג",
                laundry: "כביסה",
                dishwasher: "מדיח",
                wifi: "Wi-Fi",
                parking: "חניה",
                parkingDistance: "מרחק חניה",
                drivingRequired: "נסיעה לקניות ואוכל",
                manageableAccess: "גישה נוחה",
              }).map(([v, l]) => (
                <option value={v} key={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label>
            ערך (true / false או תיאור)
            <input name="value" required maxLength={300} />
          </label>
          <label>
            היקף העדות
            <select name="scope">
              <option value="unit">היחידה המסוימת</option>
              <option value="property">כלל הנכס בלבד</option>
            </select>
          </label>
          <label>
            כתובת מקור
            <input name="sourceUrl" type="url" dir="ltr" required />
          </label>
          <label>
            מי אישר ומתי
            <input
              name="attribution"
              placeholder="למשל: אישור המארח בטלפון, 8.11.2026"
              required
              maxLength={200}
            />
          </label>
          <button type="submit">שמירת עדות</button>
        </form>
      </section>
      <section className="panel">
        <h2>זהות היחידה והשאלות שנותרו</h2>
        <p>
          מאשרים רק את היחידה המסוימת שעבורה התקבל מידע. אישור זהות אינו אישור
          זמינות או הזמנה.
        </p>
        <form
          className="evidence-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const f = e.currentTarget,
              v = Object.fromEntries(new FormData(f));
            try {
              await action({
                type: "unit",
                unitId: v.unitId,
                name: v.name,
                identityConfirmed: v.identityConfirmed === "on",
                uncertainties: String(v.uncertainties)
                  .split("\n")
                  .map((x) => x.trim())
                  .filter(Boolean),
                sourceUrl: v.sourceUrl,
                attribution: v.attribution,
              });
              f.reset();
            } catch {}
          }}
        >
          <label>
            יחידה
            <select name="unitId">
              {data.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.property_name} · {u.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            שם היחידה המדויק
            <input name="name" required maxLength={160} />
          </label>
          <label className="check-label">
            <input name="identityConfirmed" type="checkbox" />
            זהות היחידה אושרה במקור
          </label>
          <label>
            שאלות שנותרו (כל שאלה בשורה)
            <textarea name="uncertainties" maxLength={6000} />
          </label>
          <label>
            כתובת מקור
            <input name="sourceUrl" type="url" dir="ltr" required />
          </label>
          <label>
            מי אישר ומתי
            <input name="attribution" minLength={5} maxLength={200} required />
          </label>
          <button>שמירת זהות היחידה</button>
        </form>
      </section>
      <section className="panel">
        <h2>אותו נכס בשני מקורות</h2>
        <p>
          קישור רק לאחר אישור שזה אותו נכס. היחידות, ההצעות, הבחירות והעדויות לא
          יתמזגו.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const f = e.currentTarget;
            try {
              await action({
                type: "linkProperties",
                ...Object.fromEntries(new FormData(f)),
              });
              f.reset();
            } catch {}
          }}
        >
          {["sourceId", "targetId"].map((key, i) => (
            <label key={key}>
              {i === 0 ? "הנכס לקישור" : "הנכס הקנוני"}
              <select name={key}>
                {data.units
                  .filter(
                    (u, i, a) =>
                      a.findIndex((x) => x.property_id === u.property_id) === i,
                  )
                  .map((u) => (
                    <option key={u.property_id} value={u.property_id}>
                      {u.property_name} · {new URL(u.canonical_url).hostname}
                    </option>
                  ))}
              </select>
            </label>
          ))}
          <label>
            עדות לזהות משותפת
            <input
              name="attribution"
              required
              minLength={5}
              maxLength={300}
              placeholder="למשל: המארח אישר ששתי הכתובות שייכות לאותו נכס"
            />
          </label>
          <button type="submit">אישור קישור נכסים בלבד</button>
        </form>
      </section>
      <section className="panel">
        <h2>הצגה וסגנון</h2>
        <div className="admin-properties">
          {data.units
            .filter(
              (u, i, a) =>
                a.findIndex((x) => x.property_id === u.property_id) === i,
            )
            .map((u) => (
              <div key={u.property_id}>
                <strong dir="auto">{u.property_name}</strong>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={u.pinned}
                    onChange={(e) =>
                      void action({
                        type: "property",
                        propertyId: u.property_id,
                        pinned: e.target.checked,
                        hidden: u.hidden,
                        style: u.style,
                      }).catch(() => {})
                    }
                  />
                  נעוץ
                </label>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={u.hidden}
                    onChange={(e) =>
                      void action({
                        type: "property",
                        propertyId: u.property_id,
                        pinned: u.pinned,
                        hidden: e.target.checked,
                        style: u.style,
                      }).catch(() => {})
                    }
                  />
                  מוסתר
                </label>
                <select
                  aria-label={"סגנון " + u.property_name}
                  value={u.style}
                  onChange={(e) =>
                    void action({
                      type: "property",
                      propertyId: u.property_id,
                      pinned: u.pinned,
                      hidden: u.hidden,
                      style: e.target.value,
                    }).catch(() => {})
                  }
                >
                  <option value="unknown">לא ידוע</option>
                  <option value="city">עיר</option>
                  <option value="village">כפר</option>
                  <option value="countryside">כפרי / אגריטוריזמו</option>
                </select>
              </div>
            ))}
        </div>
      </section>
      <section className="panel">
        <h2>ריצות ומשימות ספקים</h2>
        <p>
          סטטוס partial משמר את התוצאות המוצלחות ואת היסטוריית הכשלים. ריצה
          שהופסקה מזוהה גם לפי פקיעת הנעילה.
        </p>
        {data.runs.length === 0 && (
          <p>טרם בוצעה סריקה. יבוא המחקר אינו סריקה.</p>
        )}
        {data.runs.map((r) => (
          <details key={r.id}>
            <summary>
              <bdi>
                {r.status === "running" &&
                Date.parse(r.lease_until) < Date.now()
                  ? "interrupted (lease expired)"
                  : r.status}
              </bdi>{" "}
              · {dateTime(r.started_at)} · {r.trigger} · {r.discovered} חדשים
            </summary>
            <p>
              גרסה {r.config_version} · {r.queries} שאילתות · {r.details} בדיקות
              פרטים · {r.offers} הצעות · סיום: {dateTime(r.finished_at)} · עלות
              שמורה: <bdi>${(r.reserved_microusd / 1e6).toFixed(3)}</bdi>
            </p>
            {r.error && <p dir="auto">{r.error}</p>}
            {data.tasks
              .filter((t) => t.scan_id === r.id)
              .map((t) => (
                <p key={t.id} dir="auto">
                  <strong>
                    {t.provider}: {t.outcome}
                  </strong>{" "}
                  · {t.subject} {t.error && " · " + t.error}
                </p>
              ))}
          </details>
        ))}
      </section>
      <p role="status" className="notice">
        {message ||
          "שינויים בהרשאות ובמפתחות מתבצעים בהגדרות Vercel, לא בקישור שיתוף."}
      </p>
    </div>
  );
}
