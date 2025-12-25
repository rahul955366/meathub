import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Beef,
    Search,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Mail,
    Phone,
    MapPin,
    Shield,
    Star,
    Package
} from 'lucide-react'

interface Butcher {
    id: string
    name: string
    email: string
    phone: string
    shopName: string
    location: string
    experience: number
    certifications: string[]
    status: 'pending' | 'approved' | 'rejected' | 'suspended'
    applicationDate: string
    approvedDate?: string
    rating?: number
    totalOrders?: number
    documentsVerified: boolean
    avatar?: string
}

const MOCK_BUTCHERS: Butcher[] = [
    {
        id: 'B001',
        name: 'Rajesh Kumar',
        email: 'rajesh@butchershop.com',
        phone: '+91 9876543210',
        shopName: 'Fresh Meat Corner',
        location: 'Mumbai, MH',
        experience: 15,
        certifications: ['FSSAI Certified', 'Halal Certified'],
        status: 'pending',
        applicationDate: '2024-12-20',
        documentsVerified: true
    },
    {
        id: 'B002',
        name: 'Mohammed Ali',
        email: 'ali@meatshop.com',
        phone: '+91 9876543211',
        shopName: 'Premium Meats',
        location: 'Delhi, DL',
        experience: 10,
        certifications: ['FSSAI Certified'],
        status: 'approved',
        applicationDate: '2024-11-15',
        approvedDate: '2024-11-20',
        rating: 4.8,
        totalOrders: 234,
        documentsVerified: true
    },
    {
        id: 'B003',
        name: 'Suresh Patil',
        email: 'suresh@qualitymeats.com',
        phone: '+91 9876543212',
        shopName: 'Quality Meat Hub',
        location: 'Pune, MH',
        experience: 8,
        certifications: ['FSSAI Certified', 'ISO Certified'],
        status: 'pending',
        applicationDate: '2024-12-22',
        documentsVerified: false
    },
    {
        id: 'B004',
        name: 'Abdul Rahman',
        email: 'abdul@freshcuts.com',
        phone: '+91 9876543213',
        shopName: 'Fresh Cuts',
        location: 'Bangalore, KA',
        experience: 12,
        certifications: ['FSSAI Certified', 'Halal Certified'],
        status: 'approved',
        applicationDate: '2024-10-10',
        approvedDate: '2024-10-15',
        rating: 4.6,
        totalOrders: 189,
        documentsVerified: true
    },
    {
        id: 'B005',
        name: 'Prakash Sharma',
        email: 'prakash@meatsupply.com',
        phone: '+91 9876543214',
        shopName: 'Meat Supply Co.',
        location: 'Hyderabad, TS',
        experience: 5,
        certifications: ['FSSAI Certified'],
        status: 'rejected',
        applicationDate: '2024-12-10',
        documentsVerified: false
    },
]

const STATUS_CONFIG = {
    pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
    approved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
    rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
    suspended: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: AlertCircle },
}

export default function ButchersPage() {
    const [butchers] = useState<Butcher[]>(MOCK_BUTCHERS)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [selectedButcher, setSelectedButcher] = useState<Butcher | null>(null)

    const filteredButchers = butchers.filter(butcher => {
        const matchesSearch =
            butcher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            butcher.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            butcher.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || butcher.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const stats = {
        total: butchers.length,
        pending: butchers.filter(b => b.status === 'pending').length,
        approved: butchers.filter(b => b.status === 'approved').length,
        rejected: butchers.filter(b => b.status === 'rejected').length,
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
                    <Beef className="w-8 h-8 text-rose-400" />
                    Butcher Management & Approval
                </h1>
                <p className="text-slate-400 mt-1">Review and approve butcher applications</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Butchers', value: stats.total, color: 'from-rose-500 to-pink-400', icon: Beef },
                    { label: 'Pending Approval', value: stats.pending, color: 'from-yellow-500 to-orange-400', icon: Clock },
                    { label: 'Approved', value: stats.approved, color: 'from-green-500 to-emerald-400', icon: CheckCircle },
                    { label: 'Rejected', value: stats.rejected, color: 'from-red-500 to-rose-400', icon: XCircle },
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
                            placeholder="Search by name, shop, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Butchers List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredButchers.map((butcher, index) => {
                    const StatusIcon = STATUS_CONFIG[butcher.status].icon

                    return (
                        <motion.div
                            key={butcher.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-4">
                                <img
                                    src={butcher.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${butcher.name}`}
                                    alt={butcher.name}
                                    className="w-16 h-16 rounded-xl ring-2 ring-rose-400/30"
                                />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{butcher.name}</h3>
                                            <p className="text-sm text-slate-400">{butcher.shopName}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[butcher.status].color}`}>
                                            <StatusIcon className="w-3 h-3 inline mr-1" />
                                            {butcher.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-300">{butcher.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-300">{butcher.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-300">{butcher.location}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="bg-dark-bg-secondary rounded-lg p-2 text-center">
                                    <p className="text-xs text-slate-400">Experience</p>
                                    <p className="text-sm font-bold text-white">{butcher.experience}y</p>
                                </div>
                                {butcher.rating && (
                                    <div className="bg-dark-bg-secondary rounded-lg p-2 text-center">
                                        <p className="text-xs text-slate-400">Rating</p>
                                        <p className="text-sm font-bold text-white flex items-center justify-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            {butcher.rating}
                                        </p>
                                    </div>
                                )}
                                {butcher.totalOrders && (
                                    <div className="bg-dark-bg-secondary rounded-lg p-2 text-center">
                                        <p className="text-xs text-slate-400">Orders</p>
                                        <p className="text-sm font-bold text-white">{butcher.totalOrders}</p>
                                    </div>
                                )}
                            </div>

                            {/* Certifications */}
                            <div className="mb-4">
                                <p className="text-xs text-slate-400 mb-2">Certifications:</p>
                                <div className="flex flex-wrap gap-2">
                                    {butcher.certifications.map((cert, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                                            {cert}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Documents Verification */}
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className={`w-4 h-4 ${butcher.documentsVerified ? 'text-green-400' : 'text-yellow-400'}`} />
                                <span className="text-sm text-slate-300">
                                    Documents: {butcher.documentsVerified ? 'Verified' : 'Pending Verification'}
                                </span>
                            </div>

                            {/* Actions */}
                            {butcher.status === 'pending' ? (
                                <div className="flex gap-3">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all">
                                        <CheckCircle className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-rose-600 transition-all">
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setSelectedButcher(butcher)}
                                    className="w-full py-2 bg-dark-bg-secondary border border-slate-700 text-white rounded-lg hover:bg-slate-700/50 transition-all"
                                >
                                    View Details
                                </button>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            {/* Detail Modal */}
            {selectedButcher && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedButcher(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass rounded-xl p-6 max-w-3xl w-full border border-slate-700 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-start gap-4 mb-6">
                            <img
                                src={selectedButcher.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedButcher.name}`}
                                alt={selectedButcher.name}
                                className="w-20 h-20 rounded-xl ring-2 ring-rose-400/30"
                            />
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white">{selectedButcher.name}</h3>
                                <p className="text-lg text-slate-400">{selectedButcher.shopName}</p>
                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium border ${STATUS_CONFIG[selectedButcher.status].color}`}>
                                    {selectedButcher.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Email</p>
                                <p className="text-white">{selectedButcher.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Phone</p>
                                <p className="text-white">{selectedButcher.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Location</p>
                                <p className="text-white">{selectedButcher.location}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Experience</p>
                                <p className="text-white">{selectedButcher.experience} years</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Application Date</p>
                                <p className="text-white">{selectedButcher.applicationDate}</p>
                            </div>
                            {selectedButcher.approvedDate && (
                                <div>
                                    <p className="text-sm text-slate-400 mb-1">Approved Date</p>
                                    <p className="text-white">{selectedButcher.approvedDate}</p>
                                </div>
                            )}
                        </div>

                        {selectedButcher.status === 'approved' && (
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-dark-bg-secondary rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        <p className="text-sm text-slate-400">Rating</p>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{selectedButcher.rating}</p>
                                </div>
                                <div className="bg-dark-bg-secondary rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="w-5 h-5 text-cyan-400" />
                                        <p className="text-sm text-slate-400">Total Orders</p>
                                    </div>
                                    <p className="text-3xl font-bold text-white">{selectedButcher.totalOrders}</p>
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <p className="text-sm text-slate-400 mb-3">Certifications</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedButcher.certifications.map((cert, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-sm rounded-lg border border-blue-500/30">
                                        {cert}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {selectedButcher.status === 'approved' && (
                                <button className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg">
                                    Suspend Account
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedButcher(null)}
                                className="px-8 py-3 bg-dark-bg-secondary border border-slate-700 text-white rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    )
}
