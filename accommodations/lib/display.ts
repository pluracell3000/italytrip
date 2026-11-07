export const money = (c: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(c / 100);
export const dateTime = (v: any) =>
  v
    ? new Date(v).toLocaleString("he-IL", {
        timeZone: "Asia/Jerusalem",
        dateStyle: "short",
        timeStyle: "short",
      })
    : "טרם בוצעה";
export const shortDate = (v: string) =>
  new Date(v + "T12:00:00Z").toLocaleDateString("he-IL", {
    day: "numeric",
    month: "short",
  });
export const fieldLabels: Record<string, string> = {
  outdoor: "שטח חוץ והצמדה ליחידה",
  privateOutdoor: "שטח חוץ פרטי",
  daylight: "אור טבעי",
  floor: "קומה",
  stairs: "מדרגות",
  elevator: "מעלית",
  kitchen: "מטבח מאובזר",
  heating: "חימום",
  airConditioning: "מיזוג",
  laundry: "מכונת כביסה / כביסה",
  dishwasher: "מדיח",
  wifi: "Wi-Fi",
  parking: "חניה",
  parkingDistance: "מרחק מהחניה",
  drivingRequired: "נסיעה לאוכל ולקניות",
  manageableAccess: "גישה נוחה",
};
export const valueLabel = (f: any) =>
  !f || f.value === null
    ? "לא ידוע"
    : f.value === true
      ? "אושר"
      : f.value === false
        ? "אין / לא"
        : String(f.value);
