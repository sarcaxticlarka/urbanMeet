import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import React, { Suspense } from 'react'
import Footer from "@/components/Footer";
import Providers from "./providers";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "urbanMeet | Discover Tech Events & Groups",
  description: "urbanMeet is a platform for discovering, joining, and creating tech meetups, hackathons, and study groups. Connect with developers and students in your city.",
  openGraph: {
    title: "urbanMeet | Discover Tech Events & Groups",
    description: "urbanMeet is a platform for discovering, joining, and creating tech meetups, hackathons, and study groups. Connect with developers and students in your city.",
    images: [
      {
        url: "/assets/logo-light.png",
        width: 400,
        height: 400,
        alt: "urbanMeet Logo"
      }
    ]
  },
  icons: {
    icon: "/assets/logo-light.png"
  }
};

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#111827" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/logo-light.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <AuthProvider>
          <Providers>
            <Suspense fallback={<div className="w-full py-3 text-center text-sm text-zinc-500 bg-white/50 backdrop-blur">Loading...</div>}>
              <Navbar />
            </Suspense>
            <main className="flex flex-col min-h-[80vh]">
              {children}
            </main>
            <Footer />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
