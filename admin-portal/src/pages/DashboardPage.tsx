import { motion } from 'framer-motion'
import {
    TrendingUp,
    Package,
    Users,
    DollarSign,
    ArrowUp,
    ArrowDown,
    Activity
} from 'lucide-react'
import CountUp from 'react-countup'

interface DashboardPageProps {
    user: {
        name: string
    }
}

const statsCards = [
    {
        title: 'Total Revenue',
        value: 245680,
        change: 12.5,
        icon: DollarSign,
        color: 'from-accent-green to-emerald-400',
        prefix: '₹'
    },
    {
        title: 'Total Orders',
        value: 1247,
        change: 8.2,
        icon: Package,
        color: 'from-accent-blue to-cyan-400'
    },
    {
        title: 'Active Users',
        value: 3856,
        change: -2.4,
        icon: Users,
        color: 'from-accent-purple to-pink-400'
    },
    {
        title: 'Conversion Rate',
        value: 68.4,
        change: 5.1,
        icon: TrendingUp,
        color: 'from-accent-pink to-rose-400',
        suffix: '%'
    }
]

const recentOrders = [
    { id: '#12345', customer: 'John Doe', amount: 2499, status: 'delivered', time: '2 min ago' },
    { id: '#12344', customer: 'Jane Smith', amount: 1899, status: 'processing', time: '15 min ago' },
    { id: '#12343', customer: 'Bob Johnson', amount: 3299, status: 'pending', time: '1 hour ago' },
    { id: '#12342', customer: 'Alice Brown', amount: 1599, status: 'delivered', time: '2 hours ago' },
]

const STATUS_COLORS = {
    delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
    processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function DashboardPage({ user }: DashboardPageProps) {
    const currentHour = new Date().getHours()
    const greeting =
        currentHour < 12 ? 'Good Morning' :
            currentHour < 18 ? 'Good Afternoon' :
                'Good Evening'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        {greeting}, {user.name}! 👋
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Here's what's happening with your business today.
                    </p>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="flex items-center gap-2 px-4 py-2 glass rounded-lg"
                >
                    <Activity className="w-5 h-5 text-accent-green animate-pulse" />
                    <span className="text-sm text-white font-medium">All Systems Operational</span>
                </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="glass rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-medium ${stat.change > 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {stat.change > 0 ? (
                                    <ArrowUp className="w-4 h-4" />
                                ) : (
                                    <ArrowDown className="w-4 h-4" />
                                )}
                                {Math.abs(stat.change)}%
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white">
                            {stat.prefix}
                            <CountUp
                                end={stat.value}
                                duration={2}
                                separator=","
                                decimals={stat.suffix === '%' ? 1 : 0}
                            />
                            {stat.suffix}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 glass rounded-xl p-6 border border-slate-700/50"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                        <button className="text-sm text-accent-blue hover:text-accent-purple font-medium transition-colors">
                            View All →
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-dark-bg-secondary rounded-lg hover:bg-slate-700/30 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center font-bold text-white text-sm">
                                        {order.id.slice(-2)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{order.customer}</p>
                                        <p className="text-sm text-slate-400">{order.id} • {order.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-white">₹{order.amount.toLocaleString()}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass rounded-xl p-6 border border-slate-700/50"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        {[
                            { label: 'View All Orders', icon: Package, color: 'from-accent-blue to-cyan-400' },
                            { label: 'Approve Butchers', icon: Users, color: 'from-accent-purple to-pink-400' },
                            { label: 'Process Refunds', icon: DollarSign, color: 'from-accent-green to-emerald-400' },
                            { label: 'Analytics Report', icon: TrendingUp, color: 'from-accent-pink to-rose-400' },
                        ].map((action, index) => (
                            <motion.button
                                key={action.label}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center gap-3 p-4 bg-dark-bg-secondary rounded-lg hover:bg-slate-700/50 transition-all group"
                            >
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color}`}>
                                    <action.icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-medium text-slate-300 group-hover:text-white transition-colors">
                                    {action.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
