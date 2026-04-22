import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "redalpine — Portfolio Intelligence",
  description: "AI-powered investment thesis memos for the redalpine portfolio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
