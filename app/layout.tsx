import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "9 Roses Journey",
  description:
    "Astrology readings, personal reflection, and guidance for your journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="site-body">
        <div className="site-shell">
          <header className="site-header">
            <Link href="/" className="site-logo">
              <span className="site-logo-mark">✦</span>
              <span>9 Roses Journey</span>
            </Link>

            <nav className="site-nav" aria-label="Main navigation">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/readings">Readings</Link>
              <Link href="/join">Join</Link>
            </nav>
          </header>

          {children}

          <footer className="site-footer">
            <p>© {new Date().getFullYear()} 9 Roses Journey</p>
          </footer>
        </div>
      </body>
    </html>
  );
}