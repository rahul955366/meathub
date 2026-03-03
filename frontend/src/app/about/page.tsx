import React from 'react';
import { ShieldCheck, Truck, Clock, Award, Users, Heart, Zap, PlayCircle, Milestone } from 'lucide-react';
import Link from 'next/link';
import { getVillageSources } from '@/lib/api';

export default async function AboutPage() {
    const sources = await getVillageSources() || [];
    const stats = [
        { label: 'Butchers', value: '50+', icon: Users, color: 'text-rose-600' },
        { label: 'Avg Delivery', value: '45m', icon: Clock, color: 'text-emerald-600' },
        { label: 'Communities', value: '20+', icon: Milestone, color: 'text-blue-600' },
        { label: 'Hygiene Score', value: '98%', icon: ShieldCheck, color: 'text-rose-600' },
    ];

    const values = [
        {
            title: "Bio-Secure Protocol",
            desc: "Every butcher on MeatHub follows our strict 48-point hygiene checklist. No exceptions, ever.",
            icon: ShieldCheck,
            bg: "bg-rose-50",
            iconColor: "text-rose-600"
        },
        {
            title: "Sunday Auto-Dispatch",
            desc: "Our unique rickshaw fleet ensures your Sunday morning Natu Kodi arrives fresh, even during peak surge.",
            icon: Truck,
            bg: "bg-emerald-50",
            iconColor: "text-emerald-600"
        },
        {
            title: "Artisanal Sourcing",
            desc: "We bridge the gap between village farms and city kitchens, ensuring traceability in every bite.",
            icon: Award,
            bg: "bg-blue-50",
            iconColor: "text-blue-600"
        }
    ];

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center bg-slate-900 overflow-hidden pt-20">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />

                <div className="container mx-auto px-4 relative z-10">
                    <div
                        className="max-w-3xl space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                            Our Mission
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase italic">
                            Meat With <br />
                            <span className="text-rose-600 not-italic">Integrity.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-2xl">
                            MeatHub is India's first bio-secure marketplace. We're not just selling meat; we're rebuilding the trust that has been missing from your local butcher for decades.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/butchers" className="h-16 px-10 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-700 transition-all shadow-2xl flex items-center gap-3">
                                Start Browsing <Zap className="w-5 h-5 fill-current" />
                            </Link>
                            <button className="h-16 px-10 bg-white/10 backdrop-blur-xl text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all border border-white/20 flex items-center gap-3">
                                Watch Film <PlayCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <div className="container mx-auto px-4 -mt-20 relative z-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {stats.map((s, i) => (
                        <div
                            key={i}
                            className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center space-y-2 group hover:-translate-y-2 transition-transform"
                        >
                            <s.icon className={`w-8 h-8 mx-auto mb-2 ${s.color}`} />
                            <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{s.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Story Section */}
            <section className="py-32 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight">
                                    The Sunday <br />
                                    <span className="text-rose-600">Surge Secret</span>
                                </h2>
                                <p className="text-slate-600 text-lg leading-relaxed font-bold">
                                    In India, Sunday morning is a war. 70% of weekly meat is sold in a 3-hour window. Traditional apps fail because they rely on bikes.
                                </p>
                            </div>

                            <div className="p-8 bg-white rounded-[3rem] border-2 border-slate-100 shadow-xl space-y-4">
                                <h4 className="text-xl font-black text-slate-900 uppercase italic">The Auto-Rickshaw Fleet</h4>
                                <p className="text-slate-500 text-sm font-medium">
                                    Our proprietary logistics model uses a fleet of certified auto-rickshaws. One rickshaw serves an entire gated community with 50 orders in a single run, reducing carbon footprint and ensuring your Natu Kodi is on your table by 8 AM.
                                </p>
                            </div>

                            <Link href="/subscriptions" className="group inline-flex items-center gap-3 text-rose-600 font-black uppercase tracking-widest text-xs">
                                EXPLORE SUBSCRIPTION PROTOCOLS
                                <span className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-lg">
                                    <Zap className="w-4 h-4 fill-current" />
                                </span>
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-slate-200 rounded-[4rem] overflow-hidden shadow-2xl rotate-3">
                                <img
                                    src="https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=1200&q=80"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 hover:scale-100"
                                    alt="Butcher at work"
                                />
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-600 rounded-full blur-[80px] opacity-20" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Our Core Pillars</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">The standards that define ₹20L premium quality</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {values.map((v, i) => (
                            <div key={i} className="space-y-6 group">
                                <div className={`w-16 h-16 ${v.bg} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg`}>
                                    <v.icon className={`w-8 h-8 ${v.iconColor}`} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">
                                    {v.title}
                                </h4>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {v.desc}
                                </p>
                                <div className="h-1 w-12 bg-slate-100 group-hover:w-full group-hover:bg-rose-100 transition-all duration-500 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Village Sourcing Section (Issue #9) */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 mb-16 text-center">
                        Farm to <span className="text-rose-600">Fork</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {sources.map((source: any) => (
                            <div key={source.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <h4 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">{source.name}</h4>
                                <p className="text-slate-500 text-sm font-medium">{source.location}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="pb-32 px-4">
                <div className="container mx-auto">
                    <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center space-y-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600 blur-[150px] opacity-20 -mr-48 -mt-48" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 blur-[150px] opacity-10 -ml-48 -mb-48" />

                        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
                                Ready to Upgrade <br />
                                Your <span className="text-rose-600">Daily Habit?</span>
                            </h2>
                            <p className="text-slate-400 text-xl font-medium">
                                Join 5,000+ families who have said goodbye to local butcher ambiguity.
                            </p>
                            <Link href="/butchers" className="inline-flex h-20 px-12 bg-white text-slate-900 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-rose-600 hover:text-white transition-all shadow-2xl items-center gap-4">
                                Explore The Marketplace <Zap className="w-5 h-5 fill-current" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
