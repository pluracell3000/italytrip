"use client";
import { useState } from "react";
import { ArrowUpLeft, KeyRound } from "lucide-react";
export function Login({ setup }: { setup: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <main className="login">
      <div className="login-art" aria-hidden="true">
        <span>ITALIA</span>
        <div className="arch" />
        <p>שלושה בתים. מסע אחד.</p>
      </div>
      <section className="login-form">
        <p className="eyebrow">המסע המשפחתי שלנו</p>
        <h1>
          נמצא מקום
          <br />
          להרגיש בו בבית.
        </h1>
        <p>
          אורבייטו, ואל ד׳אורצ׳ה וסיינה.
          <br />
          כל האפשרויות, השאלות והבחירות — במקום אחד.
        </p>
        {setup ? (
          <div className="notice">
            <strong>האתר בהכנה</strong>
            <p>
              חיבור הנתונים והגישה המשפחתית טרם הושלמו. חיפוש יומי עדיין אינו
              פעיל.
            </p>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError("");
              try {
                const password = new FormData(e.currentTarget).get("password");
                const r = await fetch("/api/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ password }),
                });
                if (r.ok) location.reload();
                else
                  setError(
                    r.status === 429
                      ? "יותר מדי ניסיונות. נסו שוב בעוד כמה דקות."
                      : "הכניסה לא הצליחה. בדקו את הסיסמה או את חיבור האתר.",
                  );
              } catch {
                setError("אין חיבור. נסו שוב.");
              } finally {
                setBusy(false);
              }
            }}
          >
            <label htmlFor="password">
              <KeyRound size={16} /> סיסמת המשפחה או המנהל
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={16}
            />
            <button className="primary" disabled={busy}>
              כניסה למסע <ArrowUpLeft size={18} />
            </button>
            <p role="alert">{error}</p>
          </form>
        )}
        <small>מרחב פרטי למשפחה · ללא ביצוע הזמנות באתר</small>
      </section>
    </main>
  );
}
