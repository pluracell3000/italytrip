"use client";
import { useEffect, useState, useCallback } from "react";
import {
  ArrowUpLeft,
  Heart,
  MapPin,
  CalendarDays,
  Car,
  Users,
  Check,
  Plus,
  SlidersHorizontal,
  ArrowLeftRight,
  Leaf,
  House,
  Clock,
  ExternalLink,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Bookmark,
  Info,
  ChevronDown,
} from "lucide-react";
import type { AppState } from "@/lib/state";
import { Admin } from "./Admin";
import { UnitCard, Notes } from "./UnitCard";
import { Field } from "./Field";
import { money, shortDate, dateTime, fieldLabels } from "@/lib/display";
type Unit = AppState["units"][number];
export function Dashboard({ initial }: { initial: AppState }) {
  const [data, setData] = useState(initial),
    [tab, setTab] = useState("overview"),
    [base, setBase] = useState("all"),
    [compare, setCompare] = useState<string[]>([]),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [previousVisit, setPreviousVisit] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const refresh = useCallback(async () => {
    const res = await fetch("/api/state", { cache: "no-store" });
    if (res.ok) setData(await res.json());
    else if (res.status === 401) location.reload();
  }, []);
  useEffect(() => {
    setPreviousVisit(localStorage.getItem("italy:lastVisit"));
    localStorage.setItem("italy:lastVisit", new Date().toISOString());
    const timer = setInterval(() => void refresh(), 30000);
    return () => clearInterval(timer);
  }, [refresh]);
  async function action(body: any) {
    setBusy(true);
    try {
      const r = await fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const d = await r.json();
        throw new Error(d.error);
      }
      await refresh();
      setNotice("השינוי נשמר למשפחה");
    } catch (e) {
      setNotice(
        String(e).includes("UNBOOK")
          ? "יש לבטל את סימון ההזמנה לפני החלפת הדירה."
          : String(e).includes("CONFLICT")
            ? "ההגדרות השתנו במכשיר אחר. רעננו ונסו שוב."
            : "השמירה לא הצליחה. נסו שוב.",
      );
      throw e;
    } finally {
      setBusy(false);
    }
  }
  const selected = data.units.filter((u) => u.selection),
    newChanges = data.changes.filter(
      (c) =>
        !previousVisit || Date.parse(c.created_at) > Date.parse(previousVisit),
    );
  const filtered = data.units.filter(
    (u) =>
      !u.hidden &&
      (base === "all" || u.base_id === base) &&
      (!filters.verified || u.verified) &&
      (!filters.price ||
        (u.nightly !== null && u.nightly <= Number(filters.price) * 100)) &&
      (!filters.style || u.style === filters.style) &&
      (!filters.outdoor || u.fields.privateOutdoor.value === true) &&
      (!filters.parking || u.fields.parking.value === true) &&
      (!filters.kitchen || u.fields.kitchen.value === true) &&
      (!filters.floor ||
        (u.fields.floor.value !== null &&
          Number(u.fields.floor.value) <= Number(filters.floor))) &&
      (!filters.cancel ||
        (u.verified && u.offer?.conditions?.refundable === true)),
  );
  const totalKnown =
    selected.length === 3 && selected.every((u) => u.total !== null);
  const nav = [
    ["overview", "המסע שלנו"],
    ["shortlist", "מקומות לינה"],
    ["compare", "השוואה"],
    ["family", "הבחירות שלנו"],
    ["changes", "מה חדש"],
    ...(data.admin ? [["admin", "ניהול"]] : []),
  ];
  return (
    <div className="app">
      <a className="skip" href="#main">
        דילוג לתוכן
      </a>
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">
            <Leaf size={23} />
          </span>
          <span>
            שלושה בתים באיטליה<small>IL NOSTRO VIAGGIO</small>
          </span>
        </a>
        <div className="top-meta">
          <span className="private">
            <ShieldCheck size={15} /> מרחב משפחתי
          </span>
          <button
            className="icon-button"
            aria-label="יציאה"
            onClick={async () => {
              await fetch("/api/logout", { method: "POST" });
              location.reload();
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <nav className="navigation" aria-label="ניווט ראשי">
        {nav.map(([id, label]) => (
          <button
            key={id}
            aria-current={tab === id ? "page" : undefined}
            className={tab === id ? "active" : ""}
            onClick={() => setTab(id)}
          >
            {label}
            {id === "changes" && newChanges.length > 0 && (
              <span className="counter">{newChanges.length}</span>
            )}
            {id === "compare" && compare.length > 0 && (
              <span className="counter">{compare.length}</span>
            )}
          </button>
        ))}
      </nav>
      <main id="main">
        <div className="page-heading">
          <p className="eyebrow">
            איטליה, בקצב שלנו · אביב {data.config.bases[0].checkIn.slice(0, 4)}
          </p>
          {!data.config.yearConfirmed && (
            <span className="date-notice">
              <CalendarDays size={14} /> התאריכים ממתינים לאישור
            </span>
          )}
        </div>
        {tab === "overview" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="pill">
                  <Leaf size={14} /> קצת עיר. קצת כפר. הרבה זמן לנשום.
                </span>
                <h1>
                  שלושה מקומות.
                  <br />
                  <em>להרגיש בבית באיטליה.</em>
                </h1>
                <p>
                  בוחרים יחד דירה נעימה לכל שלב בדרך — עם מקום לקפה בחוץ, אור
                  בחלונות וכל מה שצריך לשבוע רגוע.
                </p>
                <div className="trip-facts">
                  <span>
                    <CalendarDays size={17} />
                    <bdi>
                      {shortDate(data.config.bases[0].checkIn)} –{" "}
                      {shortDate(data.config.bases[2].checkOut)}
                    </bdi>
                  </span>
                  <span>
                    <Users size={17} />
                    {data.config.adults} מבוגרים
                  </span>
                  <span>
                    <Car size={17} />
                    רכב שכור
                  </span>
                </div>
                <button className="primary" onClick={() => setTab("shortlist")}>
                  בואו נמצא את הדירות <ArrowUpLeft size={19} />
                </button>
                <small>שדות התעופה להגעה ולעזיבה טרם נקבעו.</small>
              </div>
              <RouteMap data={data} />
            </section>
            <section className="section">
              <div className="section-title">
                <div>
                  <p className="eyebrow">הדרך שלנו</p>
                  <h2>שלושה בסיסים, בלי למהר</h2>
                </div>
                <span className="muted">כל הבסיסים מדרום לפירנצה</span>
              </div>
              <div className="base-grid">
                {data.config.bases.map((b, i) => (
                  <article className={"base-card base-" + i} key={b.id}>
                    <div className="base-card-top">
                      <span className="base-number">0{i + 1}</span>
                      <span className="pill light">
                        {Math.round(
                          (Date.parse(b.checkOut) - Date.parse(b.checkIn)) /
                            86400000,
                        )}{" "}
                        לילות
                      </span>
                    </div>
                    <h3>{b.name}</h3>
                    <p className="dates">
                      <bdi>
                        {shortDate(b.checkIn)} – {shortDate(b.checkOut)}
                      </bdi>
                    </p>
                    <p>{b.description}</p>
                    <small>
                      {selected.find((u) => u.base_id === b.id) ? (
                        <>
                          הבחירה שלנו:{" "}
                          <bdi>
                            {
                              selected.find((u) => u.base_id === b.id)!
                                .property_name
                            }
                          </bdi>{" "}
                          ·{" "}
                          {selected.find((u) => u.base_id === b.id)!.selection!
                            .booked
                            ? "סומן כהוזמן"
                            : "לא הוזמן"}
                        </>
                      ) : (
                        "עוד לא בחרנו מקום לשבוע הזה"
                      )}
                    </small>
                    <button
                      className="text-button"
                      onClick={() => {
                        setBase(b.id);
                        setTab("shortlist");
                      }}
                    >
                      למקומות הלינה באזור <ArrowUpLeft size={16} />
                    </button>
                  </article>
                ))}
              </div>
            </section>
            <section className="overview-bottom">
              <div className="panel">
                <p className="eyebrow">בוחרים בביטחון</p>
                <h2>מועמד טוב הוא רק ההתחלה</h2>
                <p>
                  זמינות מאומתת תופיע רק לצד הצעה לאותה יחידה, לאותם תאריכים
                  ולמספר האורחים שלנו. סימן שאלה נשאר גלוי עד שמקבלים תשובה.
                </p>
                <div className="legend">
                  <span className="status verified">זמינות מאומתת</span>
                  <span className="status">מועמד · טרם נבדק</span>
                  <span className="status historical">מחקר היסטורי</span>
                </div>
              </div>
              <div className="budget-panel">
                <p className="eyebrow">תקציב לינה</p>
                <h2>
                  <bdi dir="ltr">
                    {money(data.config.preferredNightly * 100)}–
                    {money(data.config.budgetNightly * 100)}
                  </bdi>
                  <small>ללילה, רצוי כולל כל תשלומי החובה</small>
                  <small>
                    מסגרת לינה לכל המסע:{" "}
                    <bdi dir="ltr">
                      {money(
                        (data.config.preferredNightly *
                          100 *
                          (Date.parse(data.config.bases[2].checkOut) -
                            Date.parse(data.config.bases[0].checkIn))) /
                          86400000,
                      )}
                      –
                      {money(
                        (data.config.budgetNightly *
                          100 *
                          (Date.parse(data.config.bases[2].checkOut) -
                            Date.parse(data.config.bases[0].checkIn))) /
                          86400000,
                      )}
                    </bdi>{" "}
                    · תקציב תכנון, לא הצעת מחיר
                  </small>
                </h2>
                <p>גם דירות מתאימות וזולות יותר מתקבלות בשמחה.</p>
                <hr />
                <p>
                  נבחרו <strong>{selected.length} מתוך 3</strong> מקומות
                </p>
                <strong>
                  {totalKnown ? (
                    <bdi>
                      {money(selected.reduce((n, u) => n + u.total!, 0))}
                    </bdi>
                  ) : (
                    "העלות הכוללת עדיין אינה ידועה"
                  )}
                </strong>
              </div>
            </section>
            <OperationStrip data={data} />
          </>
        )}
        {tab === "shortlist" && (
          <>
            <div className="section-title">
              <div>
                <h1 className="page-title">הבית הבא שלנו</h1>
                <p className="muted">
                  אפשרויות ששווה להכיר, עם כל מה שעדיין צריך לברר.
                </p>
              </div>
              <span className="pill">{filtered.length} יחידות ומועמדים</span>
            </div>
            <div className="base-tabs" aria-label="סינון לפי אזור">
              {[
                ["all", "כל האזורים"],
                ...data.config.bases.map((b) => [b.id, b.name]),
              ].map(([id, name]) => (
                <button
                  key={id}
                  aria-pressed={base === id}
                  className={base === id ? "active" : ""}
                  onClick={() => setBase(id)}
                >
                  {name}
                </button>
              ))}
            </div>
            <details className="filters">
              <summary>
                <SlidersHorizontal size={16} /> מסננים לפי מה שחשוב לנו{" "}
                <ChevronDown size={16} />
              </summary>
              <div className="filter-grid">
                <label>
                  מחיר מרבי מאומת ללילה
                  <select
                    value={filters.price || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, price: e.target.value })
                    }
                  >
                    <option value="">כולל מחיר לא ידוע</option>
                    {[150, 250, 350].map((p) => (
                      <option key={p} value={p}>
                        עד €{p}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  סגנון
                  <select
                    value={filters.style || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, style: e.target.value })
                    }
                  >
                    <option value="">כל הסגנונות</option>
                    <option value="city">בעיר</option>
                    <option value="village">בכפר</option>
                    <option value="countryside">אגריטוריזמו / כפרי</option>
                  </select>
                </label>
                <label>
                  קומה מאומתת עד
                  <select
                    value={filters.floor || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, floor: e.target.value })
                    }
                  >
                    <option value="">כולל לא ידוע</option>
                    {[0, 1, 2, 3].map((f) => (
                      <option key={f} value={f}>
                        {f === 0 ? "קרקע" : f}
                      </option>
                    ))}
                  </select>
                </label>
                {[
                  ["outdoor", "שטח חוץ פרטי מאושר"],
                  ["parking", "חניה מאושרת"],
                  ["kitchen", "מטבח מאושר"],
                  ["cancel", "ניתן לביטול בהחזר"],
                  ["verified", "רק זמינות מאומתת"],
                ].map(([k, l]) => (
                  <label className="check-label" key={k}>
                    <input
                      type="checkbox"
                      checked={!!filters[k]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          [k]: e.target.checked ? "yes" : "",
                        })
                      }
                    />
                    {l}
                  </label>
                ))}
              </div>
              <p className="muted">
                מסנן מאומת אינו כולל פרטים שעדיין לא ידועים. מחיר לא ידוע אינו
                מסווג כמתאים לתקציב.
              </p>
            </details>
            <h2 className="group-title">
              <ShieldCheck size={21} /> הצעות עם זמינות מאומתת{" "}
              <span>{filtered.filter((u) => u.verified).length}</span>
            </h2>
            {!filtered.some((u) => u.verified) && (
              <div className="empty subtle">
                עדיין אין הצעה מאומתת לתאריכים שלנו. אפשר להכיר את המועמדים למטה
                ולבדוק תאריכים באתר המקור.
              </div>
            )}
            <div className="unit-grid">
              {filtered
                .filter((u) => u.verified)
                .map((u) => (
                  <UnitCard
                    key={u.id}
                    unit={u}
                    data={data}
                    compare={compare}
                    setCompare={setCompare}
                    action={action}
                    busy={busy}
                  />
                ))}
            </div>
            <h2 className="group-title">
              <House size={21} /> מועמדים שכדאי לבדוק{" "}
              <span>{filtered.filter((u) => !u.verified).length}</span>
            </h2>
            <div className="unit-grid">
              {filtered
                .filter((u) => !u.verified)
                .map((u) => (
                  <UnitCard
                    key={u.id}
                    unit={u}
                    data={data}
                    compare={compare}
                    setCompare={setCompare}
                    action={action}
                    busy={busy}
                  />
                ))}
            </div>
            {filtered.length === 0 && (
              <div className="empty">
                אין כרגע התאמות למסננים. אפשר להסיר מסנן כדי לראות גם פרטים לא
                ידועים.
              </div>
            )}
            {compare.length > 0 && (
              <button
                className="compare-float primary"
                onClick={() => setTab("compare")}
              >
                <ArrowLeftRight size={18} /> להשוואת {compare.length} מקומות
              </button>
            )}
          </>
        )}
        {tab === "compare" && (
          <>
            <h1 className="page-title">מה מתאים לנו יותר?</h1>
            <p className="muted">עד שלוש יחידות, עם אותן שאלות חשובות.</p>
            {compare.length === 0 ? (
              <div className="empty">
                <ArrowLeftRight size={32} />
                <h2>בוחרים מקומות להשוואה</h2>
                <p>בכרטיסי הדירות לחצו על ״להשוואה״.</p>
                <button className="primary" onClick={() => setTab("shortlist")}>
                  למקומות הלינה
                </button>
              </div>
            ) : (
              <div className="comparison-scroll">
                <table>
                  <caption className="sr-only">השוואת יחידות נבחרות</caption>
                  <thead>
                    <tr>
                      <th>מה בודקים</th>
                      {compare.map((id) => {
                        const u = data.units.find((u) => u.id === id)!;
                        return (
                          <th key={id}>
                            <bdi>{u.property_name}</bdi>
                            <small>{u.name}</small>
                            <button
                              onClick={() =>
                                setCompare(compare.filter((c) => c !== id))
                              }
                            >
                              הסרה
                            </button>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(fieldLabels).map(([f, label]) => (
                      <tr key={f}>
                        <th>{label}</th>
                        {compare.map((id) => (
                          <td key={id}>
                            <Field
                              field={
                                data.units.find((u) => u.id === id)!.fields[f]
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    {[
                      "מחיר כולל לשהייה",
                      "ביטול",
                      "זמינות",
                      "מה נותר לברר",
                    ].map((label, i) => (
                      <tr key={label}>
                        <th>{label}</th>
                        {compare.map((id) => {
                          const u = data.units.find((u) => u.id === id)!;
                          return (
                            <td key={id}>
                              {i === 0 ? (
                                u.total === null ? (
                                  "לא ידוע — יש לברר עמלות ומסים"
                                ) : (
                                  <bdi>{money(u.total)}</bdi>
                                )
                              ) : i === 1 ? (
                                u.offer?.conditions?.refundTerms ||
                                "תנאי הביטול אינם ידועים"
                              ) : i === 2 ? (
                                u.verified ? (
                                  "זמינות מאומתת"
                                ) : (
                                  "לא נבדקה לתאריכים"
                                )
                              ) : (
                                u.uncertainties.join(" ")
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {tab === "family" && (
          <>
            <h1 className="page-title">הבחירות שלנו, יחד</h1>
            <p className="muted">
              בחירות, מועדפים והערות נשמרים למשפחה בכל המכשירים. בחירה אינה
              הזמנה.
            </p>
            <div className="selection-grid">
              {data.config.bases.map((b) => {
                const u = selected.find((u) => u.base_id === b.id);
                return (
                  <article className="panel" key={b.id}>
                    <p className="eyebrow">{b.name}</p>
                    <p className="dates">
                      <bdi>
                        {shortDate(b.checkIn)} – {shortDate(b.checkOut)}
                      </bdi>
                    </p>
                    {u ? (
                      <>
                        <h2>
                          <bdi>{u.property_name}</bdi>
                        </h2>
                        <p>{u.name}</p>
                        <span
                          className={
                            "status " + (u.selection!.booked ? "verified" : "")
                          }
                        >
                          {u.selection!.booked
                            ? "סומן כהוזמן על ידינו"
                            : "נבחר על ידינו · לא הוזמן"}
                        </span>
                        <p>
                          {u.total === null ? (
                            "מחיר כולל עדכני אינו ידוע"
                          ) : (
                            <bdi>{money(u.total!)}</bdi>
                          )}
                        </p>
                        <label className="check-label">
                          <input
                            type="checkbox"
                            checked={u.selection!.booked}
                            onChange={(e) =>
                              void action({
                                type: "select",
                                unitId: u.id,
                                booked: e.target.checked,
                              }).catch(() => {})
                            }
                          />{" "}
                          כבר הזמנו באתר המקור
                        </label>
                        <button
                          className="text-button"
                          disabled={busy}
                          onClick={() =>
                            void action({
                              type: "unselect",
                              unitId: u.id,
                            }).catch(() => {})
                          }
                        >
                          ביטול הבחירה
                        </button>
                        <Notes unit={u} action={action} />
                      </>
                    ) : (
                      <>
                        <House className="muted" size={35} />
                        <h2>עוד לא בחרנו</h2>
                        <button
                          className="text-button"
                          onClick={() => {
                            setBase(b.id);
                            setTab("shortlist");
                          }}
                        >
                          למציאת מקום באזור <ArrowUpLeft size={16} />
                        </button>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
            <h2 className="group-title">
              <Heart size={22} /> המועדפים שלנו
            </h2>
            <div className="unit-grid">
              {data.units
                .filter((u) => u.favorite)
                .map((u) => (
                  <UnitCard
                    key={u.id}
                    unit={u}
                    data={data}
                    compare={compare}
                    setCompare={setCompare}
                    action={action}
                    busy={busy}
                  />
                ))}
            </div>
            {!data.units.some((u) => u.favorite) && (
              <p className="empty">לחצו על הלב ליד מקום שמעניין אתכם.</p>
            )}
          </>
        )}
        {tab === "changes" && (
          <>
            <h1 className="page-title">מה התחדש בדרך?</h1>
            <p className="muted">
              {previousVisit
                ? `מאז הביקור במכשיר הזה: ${dateTime(previousVisit)}`
                : "זה הביקור הראשון במכשיר הזה."}{" "}
              הבחירות המשפחתיות לא מתחלפות אוטומטית.
            </p>
            <OperationStrip data={data} />
            {data.changes.length === 0 ? (
              <div className="empty">
                <Clock size={32} />
                <h2>עוד אין עדכונים מסריקה חיה</h2>
                <p>
                  המחקר ההיסטורי אינו תוצאת חיפוש חדשה. כשסריקה אמיתית תמצא
                  מועמדים נוספים, הם יופיעו כאן.
                </p>
              </div>
            ) : (
              <div className="timeline">
                {data.changes.map((c) => (
                  <article className="panel" key={c.id}>
                    <small>{dateTime(c.created_at)}</small>
                    <p>{c.message}</p>
                    {newChanges.some((n) => n.id === c.id) && (
                      <span className="status">חדש מאז הביקור הקודם</span>
                    )}
                  </article>
                ))}
              </div>
            )}
            <p className="muted">
              שינוי מחיר יושווה רק בין אותה יחידה, אותם תאריכים, אותו הרכב
              אורחים ואותם תנאי תעריף וביטול.
            </p>
          </>
        )}
        {tab === "admin" && data.admin && (
          <Admin data={data} action={action} refresh={refresh} />
        )}
        <footer>
          <span>
            לאט, בנחת, ביחד. <Leaf size={15} />
          </span>
          <span>מידע לא ידוע נשאר לא ידוע · ההזמנה מתבצעת באתר המקור</span>
        </footer>
      </main>
      {notice && (
        <div className="toast" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="סגירת הודעה">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
function RouteMap({ data }: { data: AppState }) {
  const bases = data.config.bases;
  const minLng = Math.min(...bases.map((b) => b.lng)),
    maxLng = Math.max(...bases.map((b) => b.lng));
  const minLat = Math.min(...bases.map((b) => b.lat)),
    maxLat = Math.max(...bases.map((b) => b.lat));
  const points = bases.map((b, i) => ({
    x: 120 + (190 * (b.lng - minLng)) / Math.max(0.01, maxLng - minLng),
    y: 65 + (200 * (maxLat - b.lat)) / Math.max(0.01, maxLat - minLat),
    n: `0${i + 1}`,
    name: b.towns[0],
    id: b.id,
  }));
  return (
    <div className="route-map">
      <div className="map-caption">
        <span className="eyebrow">שלוש תחנות באיטליה</span>
        <span>צפון ↑</span>
      </div>
      <svg
        direction="ltr"
        viewBox="0 0 420 330"
        role="img"
        aria-label={`תרשים סכמטי: ${bases.map((b) => b.name).join(" ← ")}. אינו מפת ניווט.`}
      >
        <defs>
          <pattern
            id="map-grid"
            width="35"
            height="35"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 35 0 L 0 0 0 35"
              fill="none"
              stroke="#dedfd3"
              strokeWidth=".5"
            />
          </pattern>
        </defs>
        <rect width="420" height="330" fill="url(#map-grid)" />
        <path
          d="M-20 290 Q70 190 10 70 M90 360 Q170 240 65 -20 M180 360 Q110 150 220 -20 M280 350 Q370 170 300 -20 M425 280 Q280 150 420 10"
          stroke="#dddcca"
          strokeWidth="25"
          fill="none"
          opacity=".48"
        />
        <path
          d={points
            .map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`)
            .join(" ")}
          fill="none"
          stroke="#73836a"
          strokeWidth="2.5"
          strokeDasharray="5 6"
        />
        {points.map(({ x, y, n, name, id }) => (
          <g key={id}>
            <circle
              cx={x}
              cy={y}
              r="18"
              fill="#faf8f1"
              stroke="#44614d"
              strokeWidth="1.5"
            />
            <text
              x={x}
              y={Number(y) + 5}
              textAnchor="middle"
              fontSize="12"
              fill="#304b39"
            >
              {n}
            </text>
            <text
              x={Number(x) - 28}
              y={Number(y) + 5}
              textAnchor="end"
              fontSize="18"
              fontFamily="Georgia"
              fill="#304b39"
            >
              {name}
            </text>
          </g>
        ))}
      </svg>
      <div className="map-bottom">
        <p>
          תרשים סכמטי · מרכזי האזורים בקירוב
          <br />
          הקווים אינם כבישים או זמני נסיעה
        </p>
        <div>
          {data.config.bases.map((b) => (
            <a
              key={b.id}
              href={b.locationSource}
              target="_blank"
              rel="noreferrer"
            >
              {b.name.split(" · ")[0]} <ExternalLink size={11} />
            </a>
          ))}
        </div>
        <small>מקור מיקום: OpenStreetMap contributors</small>
      </div>
    </div>
  );
}
export function OperationStrip({ data }: { data: AppState }) {
  return (
    <aside className="operation-strip">
      <Clock size={20} />
      <div>
        <strong>
          {data.tripEnded
            ? "המסע הסתיים — הסריקות נעצרו"
            : !data.scansEnabled
              ? "החיפוש היומי טרם הופעל"
              : data.config.paused
                ? "הסריקות מושהות"
                : data.overdue
                  ? "ממתינים לסריקה מוצלחת עדכנית"
                  : "החיפוש היומי פעיל"}
        </strong>
        <p>
          גילוי מוצלח אחרון: {dateTime(data.lastDiscovery)} · בדיקת זמינות
          לתאריכים אינה מחוברת.
        </p>
        {data.scansEnabled && !data.config.paused && !data.tripEnded && (
          <small>
            החלון היומי הבא מתחיל: {dateTime(data.nextExpected)} · זמן ההפעלה
            עשוי להשתנות בתוך השעה.
          </small>
        )}
      </div>
    </aside>
  );
}
