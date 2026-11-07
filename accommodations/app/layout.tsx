import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "שלושה בתים באיטליה | המסע שלנו",
  description: "מקום משותף לבחור בנחת את הבית הבא באיטליה",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
