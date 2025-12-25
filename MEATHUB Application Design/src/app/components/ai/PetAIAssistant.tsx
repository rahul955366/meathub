// 🐾 MEATHUB - Pet AI Assistant (Super Fun & Kid-Friendly!)
// Your pet's best friend! 🐶🐱💕

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import {
    MessageCircle,
    X,
    Send,
    Sparkles,
    Heart,
    PawPrint,
    Dog,
    Cat,
    Bird,
    Fish,
    Bone
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AIAssistantMessage } from '../../../types';
import { toast } from 'sonner';
import { aiApi } from '../../../api/aiApi';

export function PetAIAssistant() {
    const { showAIAssistant, setShowAIAssistant, currentUser } = useApp();
    const [messages, setMessages] = useState<AIAssistantMessage[]>([
        {
            id: '1',
            role: 'ASSISTANT',
            content: `Hi there! 🐾 I'm Pawsome, your pet food helper!

I can help you with:
🐶 Dog food advice
🐱 Cat food tips
🐦 Bird nutrition
🐠 Fish food info
🦴 Healthy treats

Tell me about your furry friend! What's their name? 😊`,
            timestamp: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Fun quick actions for kids
    const quickActions = [
        { icon: Dog, label: 'Dog Food', emoji: '🐶', action: 'dog' },
        { icon: Cat, label: 'Cat Food', emoji: '🐱', action: 'cat' },
        { icon: Bird, label: 'Bird Food', emoji: '🐦', action: 'bird' },
        { icon: Fish, label: 'Fish Food', emoji: '🐠', action: 'fish' },
    ];

    const handleSendMessage = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage: AIAssistantMessage = {
            id: Date.now().toString(),
            role: 'USER',
            content: input,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        const userInput = input;
        setInput('');
        setIsTyping(true);

        try {
            // Call AI API with PET context for pet-specific responses
            const response = await aiApi.chat({
                message: userInput,
                language: 'en',
                context: 'PET' // This tells the AI to give pet-specific advice
            });

            const responseText = response.response || response.message || 'Woof! I got your message!';

            const aiMessage: AIAssistantMessage = {
                id: (Date.now() + 1).toString(),
                role: 'ASSISTANT',
                content: responseText,
                timestamp: new Date().toISOString(),
                action: response.actionResult ? {
                    type: (response.detectedIntent || 'DATA_FETCHED') as any,
                    success: true,
                    data: response.actionResult
                } : undefined
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error: any) {
            // Friendly error messages for kids
            const errorMessage: AIAssistantMessage = {
                id: (Date.now() + 1).toString(),
                role: 'ASSISTANT',
                content: error?.status === 0
                    ? "Oops! I'm having trouble connecting right now. Let's try again! 🐾"
                    : "Hmm, something went wrong. But don't worry, I'm still here to help! 😊",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuickAction = (action: string) => {
        let message = '';

        switch (action) {
            case 'dog':
                message = 'What is the best food for my dog?';
                break;
            case 'cat':
                message = 'What should I feed my cat?';
                break;
            case 'bird':
                message = 'What do birds like to eat?';
                break;
            case 'fish':
                message = 'What food is good for fish?';
                break;
        }

        setInput(message);
        setTimeout(() => {
            handleSendMessage();
        }, 100);
    };

    if (!showAIAssistant) {
        return (
            <button
                onClick={() => setShowAIAssistant(true)}
                className="fixed bottom-6 right-6 z-40 w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-all animate-bounce"
                style={{ animationDuration: '2s' }}
            >
                <div className="relative">
                    <PawPrint className="h-10 w-10 group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse flex items-center justify-center text-xs">
                        🐾
                    </span>
                </div>
            </button>
        );
    }

    return (
        <Card className="fixed bottom-6 right-6 z-40 w-full max-w-md h-[650px] shadow-2xl flex flex-col border-4 border-purple-300 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 overflow-hidden">
            {/* Super Fun Header */}
            <div className="p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                    {[...Array(5)].map((_, i) => (
                        <PawPrint
                            key={i}
                            className="absolute animate-float"
                            style={{
                                left: `${i * 25}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.5}s`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-white/50 shadow-lg animate-bounce">
                            <span className="text-3xl">🐾</span>
                        </div>
                        <div>
                            <h3 className="font-black text-xl">Pawsome Helper!</h3>
                            <p className="text-xs text-white/90 font-bold">Your Pet's Best Friend 💕</p>
                        </div>
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowAIAssistant(false)}
                        className="text-white hover:bg-white/20 hover:scale-110 transition-all"
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {/* Fun Quick Actions */}
            <div className="p-3 border-b-2 border-purple-200 bg-white/70 backdrop-blur-sm">
                <div className="grid grid-cols-4 gap-2">
                    {quickActions.map((action) => (
                        <Button
                            key={action.action}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(action.action)}
                            className="flex flex-col items-center gap-1 h-auto py-2 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all hover:scale-105"
                        >
                            <span className="text-2xl">{action.emoji}</span>
                            <span className="text-xs font-bold">{action.label}</span>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-white/50 to-purple-50/50" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-3xl p-4 shadow-lg ${message.role === 'USER'
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                                    : 'bg-white border-2 border-purple-200 text-gray-800'
                                    }`}
                            >
                                {message.role === 'ASSISTANT' && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">🐾</span>
                                        <span className="font-bold text-purple-600">Pawsome</span>
                                    </div>
                                )}

                                <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
                                    {message.content}
                                </p>

                                {message.action && (
                                    <Badge
                                        variant={message.action.success ? 'default' : 'destructive'}
                                        className="mt-3"
                                    >
                                        <Heart className="h-3 w-3 mr-1" />
                                        {message.action.type.replace(/_/g, ' ')}
                                    </Badge>
                                )}

                                <p className="text-xs opacity-60 mt-2 font-semibold">
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white border-2 border-purple-200 rounded-3xl p-4 shadow-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">🐾</span>
                                    <span className="font-bold text-purple-600">Pawsome</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t-2 border-purple-200 bg-white/90 backdrop-blur-sm">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me about pet food! 🐾"
                        className="flex-1 border-2 border-purple-300 focus:border-purple-500 rounded-full px-4 text-base"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full w-12 h-12 shadow-lg hover:scale-110 transition-all disabled:opacity-50"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </form>

                <p className="text-xs text-center text-purple-600 font-bold mt-2">
                    💕 Powered by AI • Made with love for pets! 🐾
                </p>
            </div>

        </Card>
    );
}
