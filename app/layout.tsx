import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
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
  title: {
    default: "9 Roses Journey",
    template: "%s | 9 Roses Journey",
  },
  description:
    "Astrology guidance, birth chart readings, astrocartography, and relocation astrology with Larisa.",
};

async function signOut() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/");
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="site-body">
        <div className="site-shell">
          <header className="site-header">
            <Link href="/" className="site-logo">
              <Image
                src="/images/9roses-logo-small.png"
                alt=""
                width={40}
                height={40}
                priority
                className="site-logo-image"
              />
              <span>9 Roses Journey</span>
            </Link>

            <nav className="site-nav" aria-label="Main navigation">
              <Link href="/">Home</Link>
              <Link href="/readings">Readings</Link>
              <Link href="/astrocartography">Astrocartography</Link>
              <Link href="/about">About</Link>
              <Link href="/join">Join</Link>
              <Link href="/schedule" className="site-nav-cta">
                Schedule a Reading
              </Link>

              {user && (
                <form action={signOut}>
                  <button className="site-nav-button" type="submit">
                    Log out
                  </button>
                </form>
              )}
            </nav>
          </header>

          {children}

          <footer className="site-footer">
            <p>© {new Date().getFullYear()} 9 Roses Journey</p>

            <nav className="footer-links" aria-label="Footer navigation">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/data-deletion">Data Deletion</Link>
            </nav>
          </footer>
        </div>
      </body>
    </html>
  );
}