import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { ShoppingBag, User, Search } from 'lucide-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MEATHUB | Premium Artisanal Meat Delivery",
  description: "Experience the gold standard of meat delivery. Freshly prepared by expert butchers, delivered in 90 minutes.",
};

import Navbar from '@/components/Navbar';
import { AppProvider } from '@/context/AppContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <AppProvider>
          <Navbar />
          <div className="pt-20">
            {children}
          </div>
        </AppProvider>

        {/* Footer */}
        <footer className="bg-slate-950 text-white py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="space-y-6">
                <span className="text-2xl font-black tracking-tighter uppercase italic">
                  MEAT<span className="text-rose-600 not-italic">HUB</span>
                </span>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                  Redefining the standard of meat delivery with artisanal precision and local soul.
                </p>
              </div>
              <div>
                <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-rose-500">Shop</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400 uppercase tracking-tight">
                  <li className="hover:text-white cursor-pointer transition-colors">Fresh Chicken</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Tender Mutton</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Ocean Fresh Fish</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Jumbo Prawns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-rose-500">Service</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400 uppercase tracking-tight">
                  <li className="hover:text-white cursor-pointer transition-colors">Our Butchers</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Village Sources</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Subscriptions</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Pet AI Assistant</li>
                </ul>
              </div>
              <div>
                <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-rose-500">Contact</h4>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-tight mb-4 italic">
                  123 Artisan Lane, Meat District<br />Mumbai, MH 400001
                </p>
                <p className="text-sm font-black text-white italic">
                  +91 98765 43210
                </p>
              </div>
            </div>
            <div className="mt-20 pt-8 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
              © 2026 MEATHUB OPERATIONS. ALL RIGHTS RESERVED.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
