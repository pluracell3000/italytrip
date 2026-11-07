import { role } from "@/lib/auth";
import { getState } from "@/lib/state";
import { Dashboard } from "@/components/Dashboard";
import { Login } from "@/components/Login";
export const dynamic = "force-dynamic";
export default async function Page() {
  const r = await role();
  if (!r)
    return (
      <Login
        setup={
          !process.env.DATABASE_URL ||
          !process.env.FAMILY_PASSWORD ||
          !process.env.SESSION_SECRET
        }
      />
    );
  try {
    return (
      <Dashboard
        initial={JSON.parse(JSON.stringify(await getState(r === "admin")))}
      />
    );
  } catch {
    console.error(JSON.stringify({ event: "state_load_failed" }));
    return (
      <main className="login">
        <div className="panel">
          <p className="eyebrow">ITALIA · INSIEME</p>
          <h1>המסע כמעט מוכן</h1>
          <p>
            חיבור הנתונים עדיין לא הושלם. לא מוצגים מחירים או תוצאות לדוגמה.
          </p>
          <p>
            מנהל האתר צריך לחבר את מסד הנתונים ולהריץ את ההגירה ואת יבוא המחקר.
          </p>
        </div>
      </main>
    );
  }
}
