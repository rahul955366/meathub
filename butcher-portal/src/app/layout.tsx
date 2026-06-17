import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "nprogress/nprogress.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MEATHUB | Butcher Operations Portal",
  description: "Internal portal for MeatHub partner butchers to manage orders, inventory, and logistics.",
};

import { Suspense } from 'react';
import ProgressBar from '@/components/ProgressBar';
import { AppProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <AppProvider>
          <Suspense fallback={null}>
            <ProgressBar />
          </Suspense>
          <Toaster position="bottom-center" />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
