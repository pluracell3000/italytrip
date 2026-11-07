import { valueLabel } from "@/lib/display";
export function Field({ field }: { field: any }) {
  return (
    <span
      className={
        field?.conflict ? "conflict" : field?.value === null ? "unknown" : ""
      }
    >
      {field?.conflict ? "מידע סותר — נדרש בירור" : valueLabel(field)}
    </span>
  );
}
