import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bot,
    Send,
    X,
    Minimize2,
    Maximize2,
    Sparkles,
    TrendingUp,
    Package,
    Users,
    DollarSign
} from 'lucide-react'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

const QUICK_QUESTIONS = [
    { icon: DollarSign, text: "What's today's revenue?", query: "revenue today" },
    { icon: Package, text: "Show pending orders", query: "pending orders" },
    { icon: TrendingUp, text: "Sales predictions", query: "predict sales" },
    { icon: Users, text: "Top customers", query: "top customers" },
]

const SAMPLE_RESPONSES: { [key: string]: string } = {
    "revenue today": "📊 Today's revenue so far is **₹45,230** from **127 orders**. This is up **12%** compared to yesterday at the same time!",
    "pending orders": "📦 You have **23 pending orders** requiring attention:\n- 8 orders awaiting payment confirmation\n- 12 orders in processing\n- 3 orders pending butcher assignment\n\nWould you like me to show details?",
    "predict sales": "🔮 Based on current trends and historical data:\n\n**Next 7 Days Prediction:**\n- Expected Orders: 850-920\n- Projected Revenue: ₹2.8L - ₹3.2L\n- Peak Days: Friday & Saturday\n\n**Recommendation:** Stock up on chicken breast and mutton curry cuts!",
    "top customers": "🌟 Top 5 customers this month:\n\n1. John Doe - ₹24,500 (18 orders)\n2. Jane Smith - ₹19,800 (15 orders)\n3. Bob Johnson - ₹16,200 (12 orders)\n4. Alice Brown - ₹14,900 (11 orders)\n5. Charlie Wilson - ₹12,300 (9 orders)",
}

export default function AdminAI() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "👋 Hello Admin! I'm your AI Assistant powered by advanced analytics. Ask me anything about your business - revenue, orders, predictions, customer insights, or recommendations!",
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsTyping(true)

        // Simulate AI response
        setTimeout(() => {
            const response = getAIResponse(input)
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMessage])
            setIsTyping(false)
        }, 1500)
    }

    const getAIResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase()

        // Check for keywords
        for (const [key, response] of Object.entries(SAMPLE_RESPONSES)) {
            if (lowerQuery.includes(key.toLowerCase()) || lowerQuery.includes(key)) {
                return response
            }
        }

        // Default responses based on keywords
        if (lowerQuery.includes('revenue') || lowerQuery.includes('sales')) {
            return "💰 Current revenue metrics:\n- Today: ₹45,230\n- This Week: ₹2.8L\n- This Month: ₹8.9L\n\nRevenue is trending upward with a 12% increase!"
        }

        if (lowerQuery.includes('order')) {
            return "📦 Order statistics:\n- Total Orders: 1,247\n- Pending: 23\n- Processing: 45\n- Delivered: 1,156\n- Cancelled: 23"
        }

        if (lowerQuery.includes('customer')) {
            return "👥 Customer insights:\n- Active Customers: 3,856\n- New This Month: 234\n- Retention Rate: 78%\n- Average Order Value: ₹1,970"
        }

        if (lowerQuery.includes('predict') || lowerQuery.includes('forecast')) {
            return "🔮 AI Predictions:\n- Next week revenue: ₹3.2L (+15%)\n- Expected orders: 920\n- Top selling: Chicken Breast\n- Growth opportunity: Fish segment"
        }

        if (lowerQuery.includes('complaint')) {
            return "⚠️ Complaints overview:\n- Total This Month: 45\n- Pending: 12\n- Resolved: 30\n- Main Issue: Late delivery (40%)\n\n**Recommendation:** Focus on delivery time optimization"
        }

        if (lowerQuery.includes('butcher')) {
            return "🥩 Butcher statistics:\n- Total Butchers: 12\n- Active: 10\n- Pending Approval: 2\n- Top Performer: Mohammed Ali (4.8★)"
        }

        // General response
        return `I understand you're asking about "${query}". Here's what I can help with:\n\n📊 Revenue & Sales\n📦 Orders & Inventory\n👥 Customer Analytics\n🔮 Predictions & Forecasts\n⚠️ Complaints Analysis\n🥩 Butcher Performance\n\nTry asking: "What's today's revenue?" or "Show top customers"`
    }

    const handleQuickQuestion = (query: string) => {
        setInput(query)
        handleSend()
    }

    if (!isOpen) {
        return (
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full shadow-glow-purple flex items-center justify-center z-50"
            >
                <Bot className="w-8 h-8 text-white" />
                <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-accent-pink rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
            </motion.button>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                height: isMinimized ? 60 : 600
            }}
            className={`fixed bottom-6 right-6 w-96 glass rounded-2xl shadow-soft border border-slate-700 z-50 flex flex-col overflow-hidden`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-glow-blue">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                            Admin AI Assistant
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                        </h3>
                        <p className="text-xs text-slate-400">Powered by Advanced Analytics</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-2 hover:bg-slate-700/30 rounded-lg transition-colors"
                    >
                        {isMinimized ? (
                            <Maximize2 className="w-4 h-4 text-slate-400" />
                        ) : (
                            <Minimize2 className="w-4 h-4 text-slate-400" />
                        )}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-slate-700/30 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-slate-400" />
                    </motion.button>
                </div>
            </div>

            <AnimatePresence>
                {!isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex-1 flex flex-col"
                    >
                        {/* Quick Questions */}
                        <div className="p-3 border-b border-slate-700 bg-dark-bg-secondary">
                            <p className="text-xs text-slate-400 mb-2">Quick Questions:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {QUICK_QUESTIONS.map((q, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleQuickQuestion(q.text)}
                                        className="flex items-center gap-2 p-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-left transition-colors"
                                    >
                                        <q.icon className="w-4 h-4 text-accent-blue flex-shrink-0" />
                                        <span className="text-xs text-white truncate">{q.text}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-bg-primary">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white'
                                            : 'glass border border-slate-700'
                                        }`}>
                                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                                        <p className="text-xs opacity-60 mt-1">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="glass border border-slate-700 rounded-lg p-3">
                                        <div className="flex gap-1">
                                            <motion.div
                                                className="w-2 h-2 bg-accent-blue rounded-full"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                            />
                                            <motion.div
                                                className="w-2 h-2 bg-accent-purple rounded-full"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                            />
                                            <motion.div
                                                className="w-2 h-2 bg-accent-pink rounded-full"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-700 bg-dark-bg-secondary">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask me anything..."
                                    className="flex-1 px-4 py-2 bg-dark-bg-primary border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue text-sm"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="p-2 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5 text-white" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
