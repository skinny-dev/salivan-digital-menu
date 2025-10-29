import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "فست فود سالیوان",
  description: "منوی دیجیتال فست فود سالیوان - تهران، چهاردانگه",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans">{children}</body>
    </html>
  );
}
