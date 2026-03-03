"use client";

import { useState } from 'react';
import { Sparkles, Send, Loader2, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface AIChatProps {
    context: 'PET' | 'GYM' | 'GENERAL';
    title: string;
}

export default function AIChat({ context, title }: AIChatProps) {
    const { token } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const openChat = () => {
        setIsOpen(true);
        if (history.length === 0) {
            const greeting = context === 'PET'
                ? "Welcome to the Pet Nutrition Guild. I'm here to help you design a species-appropriate ancestral diet for your companion. What are we calculating today?"
                : context === 'GYM'
                    ? "Strength and Honor. I am your Protein Protocol Assistant. Let's optimize your intake for maximum recovery. What is your current training goal?"
                    : "Greetings, Chef. I am your Artisanal Guide to the Village Guild. How can I assist with your sourcing today?";

            setTimeout(() => {
                setHistory([{ role: 'ai', text: greeting }]);
            }, 500);
        }
    };

    const handleSend = async () => {
        if (!message.trim()) return;
        if (!token) {
            setHistory(prev => [...prev, { role: 'ai', text: "Please sign in to the MeatHub Guild to access the Artisanal Assistant." }]);
            return;
        }

        const userMessage = message;
        setMessage('');
        setHistory(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/proxy/contextual-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ context, message: userMessage }),
            });

            const data = await res.json();
            setHistory(prev => [...prev, { role: 'ai', text: data.response }]);
        } catch (error) {
            setHistory(prev => [...prev, { role: 'ai', text: "I'm sorry, I'm having trouble connecting to my meat-servers right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={openChat}
                className="fixed bottom-8 right-8 z-50 h-20 px-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl flex items-center gap-4 hover:bg-rose-600 transition-all hover:scale-105 active:scale-95 border border-white/10 group"
            >
                <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-32 right-8 z-50 w-[400px] h-[600px] bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3)] border border-slate-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500">
                    {/* Header */}
                    <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black uppercase tracking-tighter text-sm italic">{title}</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Online & ready</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                        {history.length === 0 && (
                            <div className="text-center py-10 space-y-4">
                                <p className="text-sm font-medium text-slate-500 italic">How can I help you today regarding {context === 'PET' ? 'your pet\'s nutrition' : 'your gym protein goals'}?</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {context === 'PET' ? (
                                        ['Best organ meats?', 'Weekly plan for dog', 'Zero-waste options'].map(tip => (
                                            <button key={tip} onClick={() => setMessage(tip)} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all">
                                                {tip}
                                            </button>
                                        ))
                                    ) : (
                                        ['Daily 250g plan', 'Best lean cuts', 'Monthly savings'].map(tip => (
                                            <button key={tip} onClick={() => setMessage(tip)} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all">
                                                {tip}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        {history.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-5 rounded-[2rem] text-sm font-medium shadow-sm ${msg.role === 'user'
                                    ? 'bg-rose-600 text-white rounded-tr-none'
                                    : 'bg-slate-50 text-slate-900 border border-slate-100 rounded-tl-none italic'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-50 p-5 rounded-[2rem] rounded-tl-none border border-slate-100">
                                    <Loader2 className="w-5 h-5 animate-spin text-rose-600" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-8 border-t border-slate-100">
                        <div className="relative">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your question..."
                                className="w-full h-14 pl-6 pr-16 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white transition-all italic"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!message.trim() || isLoading}
                                className="absolute right-2 top-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-rose-600 transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-slate-950/20 active:scale-90"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
