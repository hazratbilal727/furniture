import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileBottomNav } from "./components/mobile-bottom-nav";
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
  title: "Muntazir & Sons Furniture | Peshawar",
  description:
    "Modern furniture with a point of view, from Peshawar to your home.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
