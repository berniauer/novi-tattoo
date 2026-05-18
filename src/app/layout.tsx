import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOVI TATTOO — Pop-Culture, Anime & Dark Art",
  description:
    "Professioneller Tattoo-Artist spezialisiert auf Pop-Culture, Anime und Dark Art. Jetzt Termin anfragen.",
  openGraph: {
    title: "NOVI TATTOO",
    description: "Pop-Culture · Anime · Dark Art Specialist",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${syne.variable} ${manrope.variable} h-full`}
    >
      <body className="relative bg-ink text-white font-body antialiased min-h-full">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
