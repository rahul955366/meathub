import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Package,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp
} from 'lucide-react'

interface Order {
    id: string
    customerName: string
    email: string
    items: number
    total: number
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    date: string
    paymentMethod: string
}

const MOCK_ORDERS: Order[] = [
    { id: '#12345', customerName: 'John Doe', email: 'john@example.com', items: 3, total: 2499, status: 'delivered', date: '2024-12-23', paymentMethod: 'Card' },
    { id: '#12344', customerName: 'Jane Smith', email: 'jane@example.com', items: 2, total: 1899, status: 'processing', date: '2024-12-23', paymentMethod: 'UPI' },
    { id: '#12343', customerName: 'Bob Johnson', email: 'bob@example.com', items: 5, total: 3299, status: 'shipped', date: '2024-12-22', paymentMethod: 'Card' },
    { id: '#12342', customerName: 'Alice Brown', email: 'alice@example.com', items: 1, total: 1599, status: 'pending', date: '2024-12-22', paymentMethod: 'COD' },
    { id: '#12341', customerName: 'Charlie Wilson', email: 'charlie@example.com', items: 4, total: 2799, status: 'delivered', date: '2024-12-21', paymentMethod: 'Card' },
    { id: '#12340', customerName: 'Diana Davis', email: 'diana@example.com', items: 2, total: 1999, status: 'cancelled', date: '2024-12-21', paymentMethod: 'UPI' },
]

const STATUS_CONFIG = {
    pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
    processing: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: TrendingUp },
    shipped: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Package },
    delivered: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
    cancelled: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
}

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [orders] = useState<Order[]>(MOCK_ORDERS)

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Package className="w-8 h-8 text-accent-blue" />
                        Orders Management
                    </h1>
                    <p className="text-slate-400 mt-1">View and manage all customer orders</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-lg font-medium shadow-glow-blue"
                >
                    <Download className="w-5 h-5" />
                    Export Orders
                </motion.button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', value: stats.total, color: 'from-accent-blue to-cyan-400', icon: Package },
                    { label: 'Pending', value: stats.pending, color: 'from-yellow-500 to-orange-400', icon: Clock },
                    { label: 'Processing', value: stats.processing, color: 'from-blue-500 to-indigo-400', icon: TrendingUp },
                    { label: 'Delivered', value: stats.delivered, color: 'from-green-500 to-emerald-400', icon: CheckCircle },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass rounded-lg p-4 border border-slate-700/50"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="glass rounded-xl p-4 border border-slate-700/50">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by order ID, customer name, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="glass rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-dark-bg-secondary border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredOrders.map((order, index) => {
                                const StatusIcon = STATUS_CONFIG[order.status].icon
                                return (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-slate-700/20 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-accent-blue">{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-white">{order.customerName}</p>
                                                <p className="text-xs text-slate-400">{order.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-white">{order.items} items</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold text-white">
                                                ₹{order.total.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[order.status].color}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                            {order.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 hover:bg-accent-blue/20 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-5 h-5 text-accent-blue" />
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between">
                    <p className="text-sm text-slate-400">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white hover:bg-slate-700/50 transition-colors">
                            Previous
                        </button>
                        <button className="px-4 py-2 bg-accent-blue text-white rounded-lg font-medium">
                            1
                        </button>
                        <button className="px-4 py-2 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white hover:bg-slate-700/50 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
