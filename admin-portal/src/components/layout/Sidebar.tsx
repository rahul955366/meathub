import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    Package,
    TrendingUp,
    AlertCircle,
    DollarSign,
    Users,
    Beef,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Shield
} from 'lucide-react'

interface SidebarProps {
    user: {
        id: string
        email: string
        name: string
        role: string
        avatar?: string
    }
    onLogout: () => void
}

const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-accent-blue' },
    { path: '/orders', icon: Package, label: 'Orders', color: 'text-accent-green' },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics', color: 'text-accent-purple' },
    { path: '/complaints', icon: AlertCircle, label: 'Complaints', color: 'text-accent-pink' },
    { path: '/refunds', icon: DollarSign, label: 'Refunds', color: 'text-orange-400' },
    { path: '/users', icon: Users, label: 'Users', color: 'text-cyan-400' },
    { path: '/butchers', icon: Beef, label: 'Butchers', color: 'text-rose-400' },
]

export default function Sidebar({ user, onLogout }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            className="glass border-r border-slate-700/50 flex flex-col relative"
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                    <AnimatePresence mode="wait">
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-glow-blue">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white">MEATHUB</h2>
                                    <p className="text-xs text-slate-400">Admin Portal</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 hover:bg-slate-700/30 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {collapsed ? (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        ) : (
                            <ChevronLeft className="w-5 h-5 text-slate-400" />
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${isActive
                                ? 'bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 border border-accent-blue/30 shadow-glow-blue'
                                : 'hover:bg-slate-700/30'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-3 w-full"
                            >
                                <item.icon
                                    className={`w-5 h-5 ${isActive ? item.color : 'text-slate-400 group-hover:text-white'
                                        }`}
                                />
                                <AnimatePresence mode="wait">
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={`font-medium ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                                }`}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-slate-700/50 space-y-2">
                {/* Settings */}
                <NavLink
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/30 transition-all group"
                >
                    <Settings className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    <AnimatePresence mode="wait">
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="font-medium text-slate-400 group-hover:text-white"
                            >
                                Settings
                            </motion.span>
                        )}
                    </AnimatePresence>
                </NavLink>

                {/* Profile */}
                <div className="glass rounded-lg p-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                            alt={user.name}
                            className="w-10 h-10 rounded-lg ring-2 ring-accent-blue/30"
                        />
                        <AnimatePresence mode="wait">
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 min-w-0"
                                >
                                    <p className="text-sm font-medium text-white truncate">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence mode="wait">
                        {!collapsed && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                onClick={onLogout}
                                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm font-medium rounded-lg transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.aside>
    )
}
