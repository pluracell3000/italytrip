"use client";
import { useState } from "react";
import {
  Leaf,
  House,
  Car,
  Heart,
  MapPin,
  Info,
  ArrowUpLeft,
  ArrowLeftRight,
  Bookmark,
  ChevronDown,
  Plus,
} from "lucide-react";
import type { AppState } from "@/lib/state";
import { money, shortDate, dateTime, fieldLabels } from "@/lib/display";
import { Field } from "./Field";
type Unit = AppState["units"][number];
export function UnitCard({
  unit: u,
  data,
  compare,
  setCompare,
  action,
  busy,
}: {
  unit: Unit;
  data: AppState;
  compare: string[];
  setCompare: (v: string[]) => void;
  action: (a: any) => Promise<void>;
  busy: boolean;
}) {
  const b = data.config.bases.find((b) => b.id === u.base_id)!;
  const [expanded, setExpanded] = useState(false);
  const historical = u.evidence.some((e) => e.confidence === "historical");
  const last = u.listings
    .filter((l) => l.last_success)
    .sort((a, b) => Date.parse(b.last_success) - Date.parse(a.last_success))[0];
  return (
    <article className="unit-card">
      <div className={"unit-art " + u.style}>
        <div aria-hidden="true" className="window-illustration">
          <div />
          <div />
          <div />
          <div />
        </div>
        <span className="art-caption">
          {u.style === "countryside"
            ? "בית בין הגבעות"
            : u.style === "city"
              ? "מקום בעיר"
              : u.style === "village"
                ? "שהייה בכפר"
                : "מקום שעוד נכיר"}
          <small>איור כללי · תמונת הנכס אינה זמינה לשימוש</small>
        </span>
        <button
          className={"heart " + (u.favorite ? "saved" : "")}
          aria-label={u.favorite ? "הסרה מהמועדפים" : "שמירה למועדפים"}
          aria-pressed={u.favorite}
          disabled={busy}
          onClick={() =>
            void action({
              type: "favorite",
              unitId: u.id,
              value: !u.favorite,
            }).catch(() => {})
          }
        >
          <Heart size={20} fill={u.favorite ? "currentColor" : "none"} />
        </button>
        <span className="location">
          <MapPin size={13} />
          {b.name}
        </span>
      </div>
      <div className="unit-body">
        <div className="card-labels">
          <span className={"status " + (u.verified ? "verified" : "")}>
            {u.verified ? "זמינות מאומתת" : "מועמד · זמינות לא נבדקה"}
          </span>
          {historical && (
            <span className="historical-label">מחקר מ־6.11.2026</span>
          )}
        </div>
        <h3 dir="auto">{u.property_name}</h3>
        <p className="unit-name">{u.name}</p>
        {u.associatedSources > 1 && (
          <small>
            זהות הנכס קושרה ידנית בין {u.associatedSources} מקורות; יחידות שונות
            נשארות נפרדות.
          </small>
        )}
        <p className="unit-reason">
          {u.score > 0
            ? `יש עדויות ברמת היחידה לפרטים מתאימים (${u.score} נקודות התאמה).`
            : "נקודת פתיחה לבדיקה באזור שבחרנו. טרם אומתו דרישות הלינה ברמת היחידה."}
        </p>
        <div className="quick-facts">
          <span>
            <Leaf size={15} /> חוץ פרטי:{" "}
            <Field field={u.fields.privateOutdoor} />
          </span>
          <span>
            <House size={15} /> קומה: <Field field={u.fields.floor} />
          </span>
          <span>
            <Car size={15} /> חניה: <Field field={u.fields.parking} />
          </span>
        </div>
        <div className="uncertainty">
          <Info size={16} />
          <p>
            {u.uncertainties[0] ||
              "יש לאמת מיקום, סוג לינה, זהות היחידה ותנאים לפני ההזמנה."}
          </p>
        </div>
        <div className="price-row">
          <div>
            <strong>
              {u.total === null ? (
                "מחיר כולל טרם אומת"
              ) : (
                <bdi>{money(u.total)}</bdi>
              )}
            </strong>
            <small>
              {u.nightly === null ? (
                "עמלות חובה ומסים אינם ידועים"
              ) : (
                <>
                  <bdi>{money(u.nightly)}</bdi> ללילה ·{" "}
                  {u.budgetFit === "within" ? "בתקציב" : "מעל התקציב"}
                </>
              )}
            </small>
          </div>
          <span className="dates">
            <bdi>
              {shortDate(b.checkIn)}
              <br />
              {shortDate(b.checkOut)}
            </bdi>
          </span>
        </div>
        <a
          className="booking-link"
          href={
            u.verified && u.offer?.booking_url
              ? u.offer.booking_url
              : u.canonical_url
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {u.verified && u.offer?.booking_url
            ? "להצעה באתר ההזמנה"
            : "לבדיקת תאריכים באתר המקור"}
          <ArrowUpLeft size={18} />
        </a>
        <small className="source-note">
          {!u.verified && "קישור לנכס, לא הצעת הזמנה לתאריכים · "}
          <bdi>{new URL(u.canonical_url).hostname}</bdi>
        </small>
        <small className="source-note">
          {u.verified
            ? `אימות ההצעה: ${dateTime(u.offer?.observed_at)} · רעננות עד ${data.config.freshnessHours} שעות`
            : `בדיקת עמוד מוצלחת: ${dateTime(last?.last_success)} · אינה בדיקת זמינות`}
        </small>
        <div className="card-actions">
          <button
            aria-pressed={compare.includes(u.id)}
            disabled={!compare.includes(u.id) && compare.length >= 3}
            onClick={() =>
              setCompare(
                compare.includes(u.id)
                  ? compare.filter((id) => id !== u.id)
                  : [...compare, u.id],
              )
            }
          >
            <ArrowLeftRight size={16} />
            {compare.includes(u.id) ? "בהשוואה" : "להשוואה"}
          </button>
          <button
            disabled={busy}
            onClick={() =>
              void action({ type: "select", unitId: u.id }).catch(() => {})
            }
          >
            <Bookmark size={16} />
            {u.selection ? "נבחר על ידינו" : "לבחור לשהייה"}
          </button>
        </div>
        <button
          className="details-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          כל הפרטים, העדויות וההערות <ChevronDown size={15} />
        </button>
        {expanded && (
          <div className="unit-details">
            <dl>
              {Object.entries(fieldLabels).map(([field, label]) => (
                <div key={field}>
                  <dt>{label}</dt>
                  <dd>
                    <Field field={u.fields[field]} />
                  </dd>
                </div>
              ))}
            </dl>
            <p>
              בדיקת עמוד מקור מוצלחת אחרונה: {dateTime(last?.last_success)}.
              בדיקת עמוד אינה אימות זמינות.
            </p>
            <p>
              זמינות לתאריכים:{" "}
              {u.verified
                ? "מאומתת בחלון הרעננות"
                : "לא קיימת הצעה מאומתת ורעננה"}
              . ביטול: {u.offer?.conditions?.refundTerms || "לא ידוע"}.
            </p>
            {u.listings.map((l) => (
              <p key={l.id}>
                <a href={l.original_url} target="_blank" rel="noreferrer">
                  <bdi>{l.provider}</bdi> ↗
                </a>{" "}
                · תוצאה:{" "}
                {
                  (
                    {
                      success: "עמוד נבדק",
                      blocked: "הגישה נחסמה",
                      error: "שגיאה",
                      unsupported: "בדיקה אינה נתמכת",
                    } as any
                  )[l.outcome]
                }{" "}
                · ניסיון: {dateTime(l.last_attempt)}
              </p>
            ))}
            <details>
              <summary>העדויות המקוריות ({u.evidence.length})</summary>
              {u.evidence.map((e) => (
                <div className="evidence" key={e.id}>
                  <strong>{fieldLabels[e.field] || e.field}</strong>
                  <p dir="auto">
                    {typeof e.value === "object"
                      ? JSON.stringify(e.value)
                      : String(e.value)}
                  </p>
                  <small>
                    {e.scope === "property"
                      ? "ברמת הנכס — לא בהכרח ביחידה"
                      : "ברמת היחידה"}{" "}
                    · {e.attribution} · {dateTime(e.retrieved_at)}
                  </small>
                  <a href={e.source_url} target="_blank" rel="noreferrer">
                    מקור העדות ↗
                  </a>
                </div>
              ))}
            </details>
            <Notes unit={u} action={action} />
          </div>
        )}
      </div>
    </article>
  );
}
export function Notes({
  unit,
  action,
}: {
  unit: Unit;
  action: (a: any) => Promise<void>;
}) {
  return (
    <div className="notes">
      <h4>הערות למשפחה</h4>
      {unit.notes.map((n) => (
        <p key={n.id}>
          {n.body}
          <small>{dateTime(n.created_at)}</small>
        </p>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const f = e.currentTarget;
          try {
            await action({
              type: "note",
              unitId: unit.id,
              body: new FormData(f).get("body"),
            });
            f.reset();
          } catch {}
        }}
      >
        <label className="sr-only" htmlFor={"note-" + unit.id}>
          הערה למשפחה
        </label>
        <textarea
          id={"note-" + unit.id}
          name="body"
          placeholder="מה חשוב לנו לברר?"
          required
          maxLength={2000}
        />
        <button type="submit">
          <Plus size={16} />
          שמירת הערה
        </button>
      </form>
    </div>
  );
}
