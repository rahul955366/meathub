import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, User, Menu } from 'lucide-react'

interface TopBarProps {
    user: {
        id: string
        name: string
        email: string
        avatar?: string
    }
}

export default function TopBar({ user }: TopBarProps) {
    const [showNotifications, setShowNotifications] = useState(false)
    const [notifications] = useState([
        { id: 1, type: 'order', message: 'New order #12345 placed', time: '2 min ago', unread: true },
        { id: 2, type: 'complaint', message: 'New complaint received', time: '15 min ago', unread: true },
        { id: 3, type: 'refund', message: 'Refund approved for order #12340', time: '1 hour ago', unread: false },
    ])

    const unreadCount = notifications.filter(n => n.unread).length

    return (
        <header className="glass border-b border-slate-700/50 px-6 py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between">
                {/* Left: Search */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search orders, users, products..."
                            className="w-full pl-12 pr-4 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Right: Notifications & Profile */}
                <div className="flex items-center gap-4 ml-6">
                    {/* Notifications */}
                    <div className="relative">
                        <motion.button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 hover:bg-slate-700/30 rounded-lg transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Bell className="w-6 h-6 text-slate-400" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-accent-pink text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </motion.button>

                        {/* Notifications Dropdown */}
                        <AnimatePresence>
                            {showNotifications && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowNotifications(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-80 glass rounded-lg shadow-soft z-50"
                                    >
                                        <div className="p-4 border-b border-slate-700/50">
                                            <h3 className="font-semibold text-white">Notifications</h3>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {unreadCount} unread notifications
                                            </p>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.map((notif) => (
                                                <motion.div
                                                    key={notif.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors cursor-pointer ${notif.unread ? 'bg-accent-blue/5' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-accent-blue' : 'bg-slate-600'
                                                            }`} />
                                                        <div className="flex-1">
                                                            <p className="text-sm text-white">{notif.message}</p>
                                                            <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="p-3 border-t border-slate-700/50">
                                            <button className="w-full py-2 text-sm text-accent-blue hover:text-accent-purple font-medium transition-colors">
                                                View All Notifications
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50">
                        <img
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                            alt={user.name}
                            className="w-10 h-10 rounded-lg ring-2 ring-accent-blue/30"
                        />
                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
