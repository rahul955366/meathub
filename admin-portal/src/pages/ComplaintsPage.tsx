import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    AlertCircle,
    Search,
    MessageSquare,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    User,
    Calendar
} from 'lucide-react'

interface Complaint {
    id: string
    customerName: string
    email: string
    orderId: string
    subject: string
    description: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'new' | 'in-progress' | 'resolved' | 'closed'
    date: string
    assignedTo?: string
}

const MOCK_COMPLAINTS: Complaint[] = [
    {
        id: 'C001',
        customerName: 'John Doe',
        email: 'john@example.com',
        orderId: '#12345',
        subject: 'Product Quality Issue',
        description: 'The chicken received was not fresh as expected',
        priority: 'high',
        status: 'new',
        date: '2024-12-23',
    },
    {
        id: 'C002',
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        orderId: '#12344',
        subject: 'Late Delivery',
        description: 'Order was delivered 2 hours late',
        priority: 'medium',
        status: 'in-progress',
        date: '2024-12-22',
        assignedTo: 'Support Team A',
    },
    {
        id: 'C003',
        customerName: 'Bob Johnson',
        email: 'bob@example.com',
        orderId: '#12343',
        subject: 'Wrong Item Delivered',
        description: 'Received mutton instead of chicken',
        priority: 'urgent',
        status: 'new',
        date: '2024-12-23',
    },
    {
        id: 'C004',
        customerName: 'Alice Brown',
        email: 'alice@example.com',
        orderId: '#12342',
        subject: 'Packaging Issue',
        description: 'Package was damaged during delivery',
        priority: 'low',
        status: 'resolved',
        date: '2024-12-21',
        assignedTo: 'Support Team B',
    },
]

const PRIORITY_CONFIG = {
    low: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: AlertCircle },
    medium: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: AlertTriangle },
    high: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: AlertTriangle },
    urgent: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertCircle },
}

const STATUS_CONFIG = {
    'new': { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Clock },
    'in-progress': { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: MessageSquare },
    'resolved': { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle2 },
    'closed': { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: XCircle },
}

export default function ComplaintsPage() {
    const [complaints] = useState<Complaint[]>(MOCK_COMPLAINTS)
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState<string>('all')

    const filteredComplaints = complaints.filter(complaint => {
        const matchesSearch =
            complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.id.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter = filter === 'all' || complaint.status === filter

        return matchesSearch && matchesFilter
    })

    const stats = {
        total: complaints.length,
        new: complaints.filter(c => c.status === 'new').length,
        inProgress: complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-accent-pink" />
                    Complaints Management
                </h1>
                <p className="text-slate-400 mt-1">Handle customer complaints and improve satisfaction</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Complaints', value: stats.total, color: 'from-pink-500 to-rose-400', icon: AlertCircle },
                    { label: 'New', value: stats.new, color: 'from-purple-500 to-pink-400', icon: Clock },
                    { label: 'In Progress', value: stats.inProgress, color: 'from-blue-500 to-cyan-400', icon: MessageSquare },
                    { label: 'Resolved', value: stats.resolved, color: 'from-green-500 to-emerald-400', icon: CheckCircle2 },
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

            {/* Search & Filter */}
            <div className="glass rounded-xl p-4 border border-slate-700/50">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search complaints..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-pink"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-pink"
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            {/* Complaints List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List */}
                <div className="lg:col-span-1 space-y-3">
                    {filteredComplaints.map((complaint, index) => {
                        const PriorityIcon = PRIORITY_CONFIG[complaint.priority].icon
                        return (
                            <motion.div
                                key={complaint.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedComplaint(complaint)}
                                className={`glass rounded-lg p-4 border cursor-pointer transition-all ${selectedComplaint?.id === complaint.id
                                        ? 'border-accent-pink shadow-glow-purple'
                                        : 'border-slate-700/50 hover:border-slate-600/50'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-white">{complaint.subject}</p>
                                        <p className="text-xs text-slate-400 mt-1">{complaint.id} • {complaint.orderId}</p>
                                    </div>
                                    <span className={`p-1.5 rounded-lg ${PRIORITY_CONFIG[complaint.priority].color.split(' ')[0]}`}>
                                        <PriorityIcon className="w-4 h-4" />
                                    </span>
                                </div>
                                <p className="text-sm text-slate-300 mb-3 line-clamp-2">{complaint.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className={`px-2 py-1 rounded text-xs font-medium border ${STATUS_CONFIG[complaint.status].color}`}>
                                        {complaint.status}
                                    </span>
                                    <span className="text-xs text-slate-400">{complaint.date}</span>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Detail View */}
                <div className="lg:col-span-2">
                    {selectedComplaint ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass rounded-xl p-6 border border-slate-700/50"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedComplaint.subject}</h2>
                                    <p className="text-slate-400 mt-1">{selectedComplaint.id}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${PRIORITY_CONFIG[selectedComplaint.priority].color}`}>
                                    {selectedComplaint.priority.toUpperCase()}
                                </span>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm text-slate-400">Customer</p>
                                        <p className="text-white font-medium">{selectedComplaint.customerName}</p>
                                        <p className="text-sm text-slate-400">{selectedComplaint.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm text-slate-400">Submitted</p>
                                        <p className="text-white">{selectedComplaint.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm text-slate-400">Related Order</p>
                                        <p className="text-accent-blue font-medium">{selectedComplaint.orderId}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-dark-bg-secondary rounded-lg p-4 mb-6">
                                <p className="text-sm font-medium text-white mb-2">Description</p>
                                <p className="text-slate-300">{selectedComplaint.description}</p>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all">
                                    Mark as Resolved
                                </button>
                                <button className="flex-1 py-3 bg-dark-bg-secondary border border-slate-700 text-white font-medium rounded-lg hover:bg-slate-700/50 transition-all">
                                    Assign to Team
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="glass rounded-xl p-12 border border-slate-700/50 text-center">
                            <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">Select a complaint to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
