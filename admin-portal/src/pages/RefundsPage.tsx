import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    DollarSign,
    Search,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Download,
    CreditCard
} from 'lucide-react'

interface Refund {
    id: string
    orderId: string
    customerName: string
    email: string
    amount: number
    reason: string
    status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected'
    requestDate: string
    paymentMethod: string
    accountNumber?: string
}

const MOCK_REFUNDS: Refund[] = [
    {
        id: 'R001',
        orderId: '#12345',
        customerName: 'John Doe',
        email: 'john@example.com',
        amount: 2499,
        reason: 'Product quality issue',
        status: 'pending',
        requestDate: '2024-12-23',
        paymentMethod: 'Card',
        accountNumber: '****1234'
    },
    {
        id: 'R002',
        orderId: '#12344',
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        amount: 1899,
        reason: 'Wrong item delivered',
        status: 'approved',
        requestDate: '2024-12-22',
        paymentMethod: 'UPI',
        accountNumber: 'jane@upi'
    },
    {
        id: 'R003',
        orderId: '#12343',
        customerName: 'Bob Johnson',
        email: 'bob@example.com',
        amount: 3299,
        reason: 'Order cancelled',
        status: 'processing',
        requestDate: '2024-12-21',
        paymentMethod: 'Card',
        accountNumber: '****5678'
    },
    {
        id: 'R004',
        orderId: '#12342',
        customerName: 'Alice Brown',
        email: 'alice@example.com',
        amount: 1599,
        reason: 'Duplicate charge',
        status: 'completed',
        requestDate: '2024-12-20',
        paymentMethod: 'UPI',
        accountNumber: 'alice@upi'
    },
    {
        id: 'R005',
        orderId: '#12341',
        customerName: 'Charlie Wilson',
        email: 'charlie@example.com',
        amount: 2799,
        reason: 'Changed mind',
        status: 'rejected',
        requestDate: '2024-12-19',
        paymentMethod: 'COD'
    },
]

const STATUS_CONFIG = {
    pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
    approved: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: CheckCircle },
    processing: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: AlertCircle },
    completed: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
    rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
}

export default function RefundsPage() {
    const [refunds] = useState<Refund[]>(MOCK_REFUNDS)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null)

    const filteredRefunds = refunds.filter(refund => {
        const matchesSearch =
            refund.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            refund.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            refund.customerName.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || refund.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const stats = {
        total: refunds.length,
        pending: refunds.filter(r => r.status === 'pending').length,
        approved: refunds.filter(r => r.status === 'approved').length,
        completed: refunds.filter(r => r.status === 'completed').length,
        totalAmount: refunds.reduce((sum, r) => sum + r.amount, 0),
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
                        <DollarSign className="w-8 h-8 text-orange-400" />
                        Refunds Processing
                    </h1>
                    <p className="text-slate-400 mt-1">Manage customer refund requests efficiently</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium"
                >
                    <Download className="w-5 h-5" />
                    Export Report
                </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                    { label: 'Total Requests', value: stats.total, color: 'from-orange-500 to-amber-400', icon: DollarSign },
                    { label: 'Pending', value: stats.pending, color: 'from-yellow-500 to-orange-400', icon: Clock },
                    { label: 'Approved', value: stats.approved, color: 'from-blue-500 to-cyan-400', icon: CheckCircle },
                    { label: 'Completed', value: stats.completed, color: 'from-green-500 to-emerald-400', icon: CheckCircle },
                    { label: 'Total Amount', value: `₹${stats.totalAmount.toLocaleString()}`, color: 'from-purple-500 to-pink-400', icon: CreditCard, isAmount: true },
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
                                <p className="text-slate-400 text-xs">{stat.label}</p>
                                <p className={`${stat.isAmount ? 'text-xl' : 'text-2xl'} font-bold text-white mt-1`}>
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="glass rounded-xl p-4 border border-slate-700/50">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by refund ID, order ID, or customer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Refunds Table */}
            <div className="glass rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-dark-bg-secondary border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Refund ID</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Reason</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredRefunds.map((refund, index) => {
                                const StatusIcon = STATUS_CONFIG[refund.status].icon
                                return (
                                    <motion.tr
                                        key={refund.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-slate-700/20 transition-colors cursor-pointer"
                                        onClick={() => setSelectedRefund(refund)}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-orange-400">{refund.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-accent-blue">{refund.orderId}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-white">{refund.customerName}</p>
                                                <p className="text-xs text-slate-400">{refund.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-white">₹{refund.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-300">{refund.reason}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[refund.status].color}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-300">{refund.requestDate}</td>
                                        <td className="px-6 py-4">
                                            {refund.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4 text-red-400" />
                                                    </motion.button>
                                                </div>
                                            )}
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
                        Showing {filteredRefunds.length} of {refunds.length} refunds
                    </p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white hover:bg-slate-700/50 transition-colors">
                            Previous
                        </button>
                        <button className="px-4 py-2 bg-orange-400 text-white rounded-lg font-medium">1</button>
                        <button className="px-4 py-2 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white hover:bg-slate-700/50 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail Modal (if selected) */}
            {selectedRefund && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setSelectedRefund(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass rounded-xl p-6 max-w-2xl w-full mx-4 border border-slate-700"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">Refund Details - {selectedRefund.id}</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-400">Order ID</p>
                                    <p className="text-white font-medium">{selectedRefund.orderId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Amount</p>
                                    <p className="text-white font-bold">₹{selectedRefund.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Customer</p>
                                    <p className="text-white font-medium">{selectedRefund.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Payment Method</p>
                                    <p className="text-white">{selectedRefund.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Account</p>
                                    <p className="text-white">{selectedRefund.accountNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Request Date</p>
                                    <p className="text-white">{selectedRefund.requestDate}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-2">Reason</p>
                                <p className="text-white bg-dark-bg-secondary p-3 rounded-lg">{selectedRefund.reason}</p>
                            </div>
                            <div className="flex gap-3 mt-6">
                                {selectedRefund.status === 'pending' && (
                                    <>
                                        <button className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg">
                                            Approve Refund
                                        </button>
                                        <button className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg">
                                            Reject Request
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => setSelectedRefund(null)}
                                    className="px-6 py-3 bg-dark-bg-secondary border border-slate-700 text-white rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    )
}
