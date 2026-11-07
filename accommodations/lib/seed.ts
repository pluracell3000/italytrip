import { json } from "./db";
import { defaults } from "./config";
import { database } from "./db";
import { stableId, listingKey } from "./domain";
export async function seed() {
  const db = await database();
  await db.transaction(async (tx) => {
    await tx.query(
      "INSERT INTO trips(id,config) VALUES($1,$2) ON CONFLICT DO NOTHING",
      ["italy", json(defaults)],
    );
    for (const [i, b] of defaults.bases.entries())
      await tx.query(
        "INSERT INTO bases(id,trip_id,name,position,config) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING",
        [b.id, "italy", b.name, i, json(b)],
      );
    const seeds = [
      [
        "orvieto",
        "Dimora del Funaro con parcheggio",
        "יחידה לפי המחקר ההיסטורי",
        "https://www.booking.com/hotel/it/dimora-del-funaro-con-parcheggio.en-gb.html",
        "יש לאשר מקום ישיבה במרפסת ומספר מדרגות.",
        "city",
      ],
      [
        "orvieto",
        "La Casetta alla Funicolare",
        "יחידה לפי המחקר ההיסטורי",
        "https://www.casettafunicolare.com/",
        "אורבייטו סקאלו; יש לאמת את פרטי היחידה לתאריכים.",
        "village",
      ],
      [
        "pienza",
        "Il Casalino",
        "Deluxe Suite — זיהוי מול Booking לא מאושר",
        "https://agriturismoilcasalino.it/en/deluxe-suite/",
        "לא הוכח שהדירה עם שני חדרי השינה ב־Booking היא יחידה זו.",
        "countryside",
      ],
      [
        "pienza",
        "Il Casalino",
        "Garden Suite — זיהוי מול Booking לא מאושר",
        "https://agriturismoilcasalino.it/en/garden-suite/",
        "אין התאמה מוכחת בין Garden View ל־Garden Suite.",
        "countryside",
      ],
      [
        "siena",
        "San Prospero Suite",
        "San Prospero Suite",
        "https://paradisosiena.com/property/san-prospero-suite/",
        "הקומה אינה ידועה; במחקר דווח על מידע סותר לגבי מעלית.",
        "city",
      ],
      [
        "siena",
        "La Coroncina Lodging",
        "קטגוריה לא מזוהה",
        "https://www.lacoroncinalodging.com/english/the-lodgings/",
        "הקטגוריה אינה מזהה יחידה, קומה או שטח חוץ פרטי.",
        "countryside",
      ],
      [
        "pienza",
        "Tobruk",
        "Cipresso",
        "https://www.tobruk.it/en/cipresso/",
        "מועמד לבדיקה מחדש; חוסר זמינות בעבר אינו קובע זמינות כיום.",
        "countryside",
      ],
      [
        "siena",
        "Porta Pispini Residence",
        "יחידה טרם זוהתה",
        "https://www.portapispiniresidence.com/en/apartments",
        "מועמד לבדיקה מחדש; חוסר זמינות בעבר אינו קובע זמינות כיום.",
        "city",
      ],
    ];
    for (const [base, name, unit, url, uncertainty, style] of seeds) {
      const pid = stableId(name),
        uid = stableId(name + unit);
      await tx.query(
        "INSERT INTO properties(id,name,base_id,canonical_url,style) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING",
        [pid, name, base, url, style],
      );
      await tx.query(
        "INSERT INTO units(id,property_id,name,uncertainties) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING",
        [uid, pid, unit, [uncertainty]],
      );
      await tx.query(
        "INSERT INTO listings(id,property_id,unit_id,provider,original_url) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING",
        [stableId(listingKey(url)), pid, uid, new URL(url).hostname, url],
      );
      await tx.query(
        "INSERT INTO evidence(id,unit_id,property_id,field,value,scope,source_url,retrieved_at,confidence,attribution,manual) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true) ON CONFLICT DO NOTHING",
        [
          stableId(uid + "historical"),
          uid,
          pid,
          "researchNote",
          json(uncertainty),
          "unit",
          url,
          "2026-11-06T12:00:00Z",
          "historical",
          "תקציר המחקר שסופק בהנחיות; קובץ PDF טרם התקבל",
        ],
      );
    }
    // The supplied Airbnb URL has no confirmed property/unit mapping; keep separate.
    const airUrl = "https://www.airbnb.com/rooms/1645810669204915224",
      airPid = stableId("airbnb:1645810669204915224"),
      airUid = stableId("airbnb:1645810669204915224:unknown-unit");
    await tx.query(
      "INSERT INTO properties(id,name,base_id,canonical_url) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING",
      [airPid, "Airbnb — זיהוי הנכס דורש אישור", "orvieto", airUrl],
    );
    await tx.query(
      "INSERT INTO units(id,property_id,name,uncertainties) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING",
      [
        airUid,
        airPid,
        "יחידה לא מזוהה",
        ["קישור שסופק במחקר; אין התאמה מאומתת לנכס או יחידה אחרים."],
      ],
    );
    await tx.query(
      "INSERT INTO listings(id,property_id,unit_id,provider,source_id,original_url) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING",
      [airPid, airPid, airUid, "airbnb", "1645810669204915224", airUrl],
    );
  });
}
