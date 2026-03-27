import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TM Training Guide",
  description:
    "Torn.com gym training guide & calculator for The Masters faction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
