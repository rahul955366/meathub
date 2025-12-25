import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Users, Package, ArrowUp, ArrowDown } from 'lucide-react'
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

// Mock Data
const revenueData = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 145 },
    { month: 'Mar', revenue: 48000, orders: 132 },
    { month: 'Apr', revenue: 61000, orders: 168 },
    { month: 'May', revenue: 55000, orders: 152 },
    { month: 'Jun', revenue: 67000, orders: 185 },
    { month: 'Jul', revenue: 72000, orders: 198 },
]

const categoryData = [
    { name: 'Chicken', value: 35, sales: 87500 },
    { name: 'Mutton', value: 25, sales: 62500 },
    { name: 'Fish', value: 20, sales: 50000 },
    { name: 'Pork', value: 12, sales: 30000 },
    { name: 'Others', value: 8, sales: 20000 },
]

const topProducts = [
    { name: 'Chicken Breast', orders: 234, revenue: 58500 },
    { name: 'Mutton Curry Cut', orders: 189, revenue: 47250 },
    { name: 'Fish Fillet', orders: 156, revenue: 39000 },
    { name: 'Chicken Legs', orders: 143, revenue: 35750 },
    { name: 'Pork Chops', orders: 98, revenue: 24500 },
]

const COLORS = ['#00b4d8', '#9d4edd', '#ff006e', '#06ffa5', '#ffa500']

export default function AnalyticsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-accent-purple" />
                    Analytics & Insights
                </h1>
                <p className="text-slate-400 mt-1">Track performance and make data-driven decisions</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Total Revenue',
                        value: '₹2,45,680',
                        change: '+12.5%',
                        positive: true,
                        icon: DollarSign,
                        color: 'from-green-500 to-emerald-400'
                    },
                    {
                        label: 'Total Orders',
                        value: '1,247',
                        change: '+8.2%',
                        positive: true,
                        icon: Package,
                        color: 'from-blue-500 to-cyan-400'
                    },
                    {
                        label: 'Customers',
                        value: '3,856',
                        change: '-2.4%',
                        positive: false,
                        icon: Users,
                        color: 'from-purple-500 to-pink-400'
                    },
                    {
                        label: 'Avg Order Value',
                        value: '₹1,970',
                        change: '+5.1%',
                        positive: true,
                        icon: TrendingUp,
                        color: 'from-pink-500 to-rose-400'
                    },
                ].map((metric, index) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass rounded-lg p-4 border border-slate-700/50"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color}`}>
                                <metric.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${metric.positive ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {metric.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                {metric.change}
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs">{metric.label}</p>
                        <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-xl p-6 border border-slate-700/50"
                >
                    <h3 className="text-lg font-bold text-white mb-4">Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#00b4d8" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                    color: '#f1f5f9'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#00b4d8"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Category Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass rounded-xl p-6 border border-slate-700/50"
                >
                    <h3 className="text-lg font-bold text-white mb-4">Category Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                    color: '#f1f5f9'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Monthly Orders */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass rounded-xl p-6 border border-slate-700/50"
                >
                    <h3 className="text-lg font-bold text-white mb-4">Monthly Orders</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                    color: '#f1f5f9'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="#9d4edd"
                                strokeWidth={3}
                                dot={{ fill: '#9d4edd', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Top Products */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass rounded-xl p-6 border border-slate-700/50"
                >
                    <h3 className="text-lg font-bold text-white mb-4">Top Products</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topProducts}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                    color: '#f1f5f9'
                                }}
                            />
                            <Bar dataKey="revenue" fill="#06ffa5" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* AI Predictions Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass rounded-xl p-6 border border-accent-blue/30"
            >
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">AI-Powered Predictions</h3>
                        <p className="text-slate-300 mb-4">
                            Based on current trends and historical data, here's what we predict for next month:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-dark-bg-secondary rounded-lg p-4">
                                <p className="text-slate-400 text-sm">Projected Revenue</p>
                                <p className="text-2xl font-bold text-green-400 mt-1">₹2,85,000</p>
                                <p className="text-xs text-green-400 mt-1">+16% increase</p>
                            </div>
                            <div className="bg-dark-bg-secondary rounded-lg p-4">
                                <p className="text-slate-400 text-sm">Expected Orders</p>
                                <p className="text-2xl font-bold text-blue-400 mt-1">2,150</p>
                                <p className="text-xs text-blue-400 mt-1">+72% increase</p>
                            </div>
                            <div className="bg-dark-bg-secondary rounded-lg p-4">
                                <p className="text-slate-400 text-sm">Customer Growth</p>
                                <p className="text-2xl font-bold text-purple-400 mt-1">+325</p>
                                <p className="text-xs text-purple-400 mt-1">+8.4% growth</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
