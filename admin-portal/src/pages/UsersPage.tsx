import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Users as UsersIcon,
    Search,
    UserCheck,
    UserX,
    Crown,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShoppingBag,
    MoreVertical
} from 'lucide-react'

interface User {
    id: string
    name: string
    email: string
    phone: string
    role: 'CUSTOMER' | 'BUTCHER' | 'ADMIN'
    status: 'active' | 'inactive' | 'suspended'
    joinDate: string
    totalOrders: number
    totalSpent: number
    location: string
    avatar?: string
}

const MOCK_USERS: User[] = [
    {
        id: 'U001',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        role: 'CUSTOMER',
        status: 'active',
        joinDate: '2024-01-15',
        totalOrders: 24,
        totalSpent: 45600,
        location: 'Mumbai, MH'
    },
    {
        id: 'U002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+91 9876543211',
        role: 'CUSTOMER',
        status: 'active',
        joinDate: '2024-02-20',
        totalOrders: 18,
        totalSpent: 32400,
        location: 'Delhi, DL'
    },
    {
        id: 'U003',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+91 9876543212',
        role: 'BUTCHER',
        status: 'active',
        joinDate: '2024-03-10',
        totalOrders: 156,
        totalSpent: 0,
        location: 'Bangalore, KA'
    },
    {
        id: 'U004',
        name: 'Alice Brown',
        email: 'alice@example.com',
        phone: '+91 9876543213',
        role: 'CUSTOMER',
        status: 'inactive',
        joinDate: '2024-04-05',
        totalOrders: 5,
        totalSpent: 8900,
        location: 'Pune, MH'
    },
    {
        id: 'U005',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        phone: '+91 9876543214',
        role: 'ADMIN',
        status: 'active',
        joinDate: '2024-01-01',
        totalOrders: 0,
        totalSpent: 0,
        location: 'Mumbai, MH'
    },
]

const ROLE_CONFIG = {
    CUSTOMER: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: UsersIcon },
    BUTCHER: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: ShoppingBag },
    ADMIN: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Crown },
}

const STATUS_CONFIG = {
    active: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: UserCheck },
    inactive: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: UserX },
    suspended: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: UserX },
}

export default function UsersPage() {
    const [users] = useState<User[]>(MOCK_USERS)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter

        return matchesSearch && matchesRole && matchesStatus
    })

    const stats = {
        total: users.length,
        customers: users.filter(u => u.role === 'CUSTOMER').length,
        butchers: users.filter(u => u.role === 'BUTCHER').length,
        active: users.filter(u => u.status === 'active').length,
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
                    <UsersIcon className="w-8 h-8 text-cyan-400" />
                    User Management
                </h1>
                <p className="text-slate-400 mt-1">Manage all users, customers, and butchers</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: stats.total, color: 'from-cyan-500 to-blue-400', icon: UsersIcon },
                    { label: 'Customers', value: stats.customers, color: 'from-blue-500 to-indigo-400', icon: UsersIcon },
                    { label: 'Butchers', value: stats.butchers, color: 'from-orange-500 to-amber-400', icon: ShoppingBag },
                    { label: 'Active', value: stats.active, color: 'from-green-500 to-emerald-400', icon: UserCheck },
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

            {/* Search & Filters */}
            <div className="glass rounded-xl p-4 border border-slate-700/50">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                        <option value="all">All Roles</option>
                        <option value="CUSTOMER">Customers</option>
                        <option value="BUTCHER">Butchers</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user, index) => {
                    const RoleIcon = ROLE_CONFIG[user.role].icon
                    const StatusIcon = STATUS_CONFIG[user.status].icon

                    return (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            className="glass rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all cursor-pointer"
                            onClick={() => setSelectedUser(user)}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-lg ring-2 ring-cyan-400/30"
                                    />
                                    <div>
                                        <h3 className="font-bold text-white">{user.name}</h3>
                                        <p className="text-xs text-slate-400">{user.id}</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 hover:bg-slate-700/30 rounded-lg"
                                >
                                    <MoreVertical className="w-4 h-4 text-slate-400" />
                                </motion.button>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-300">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-300">{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-300">{user.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-300">Joined {user.joinDate}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            {user.role === 'CUSTOMER' && (
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-dark-bg-secondary rounded-lg p-2">
                                        <p className="text-xs text-slate-400">Orders</p>
                                        <p className="text-lg font-bold text-white">{user.totalOrders}</p>
                                    </div>
                                    <div className="bg-dark-bg-secondary rounded-lg p-2">
                                        <p className="text-xs text-slate-400">Spent</p>
                                        <p className="text-lg font-bold text-white">₹{(user.totalSpent / 1000).toFixed(1)}k</p>
                                    </div>
                                </div>
                            )}

                            {/* Badges */}
                            <div className="flex items-center gap-2">
                                <span className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${ROLE_CONFIG[user.role].color}`}>
                                    <RoleIcon className="w-3 h-3" />
                                    {user.role}
                                </span>
                                <span className={`flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${STATUS_CONFIG[user.status].color}`}>
                                    <StatusIcon className="w-3 h-3" />
                                    {user.status}
                                </span>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedUser(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass rounded-xl p-6 max-w-2xl w-full border border-slate-700"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`}
                                    alt={selectedUser.name}
                                    className="w-16 h-16 rounded-xl ring-2 ring-cyan-400/30"
                                />
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedUser.name}</h3>
                                    <p className="text-slate-400">{selectedUser.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${ROLE_CONFIG[selectedUser.role].color}`}>
                                    {selectedUser.role}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[selectedUser.status].color}`}>
                                    {selectedUser.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Phone</p>
                                <p className="text-white">{selectedUser.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Location</p>
                                <p className="text-white">{selectedUser.location}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Join Date</p>
                                <p className="text-white">{selectedUser.joinDate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">User ID</p>
                                <p className="text-white">{selectedUser.id}</p>
                            </div>
                        </div>

                        {selectedUser.role === 'CUSTOMER' && (
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-dark-bg-secondary rounded-lg p-4">
                                    <p className="text-sm text-slate-400 mb-2">Total Orders</p>
                                    <p className="text-3xl font-bold text-white">{selectedUser.totalOrders}</p>
                                </div>
                                <div className="bg-dark-bg-secondary rounded-lg p-4">
                                    <p className="text-sm text-slate-400 mb-2">Total Spent</p>
                                    <p className="text-3xl font-bold text-white">₹{selectedUser.totalSpent.toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg">
                                View Orders
                            </button>
                            <button className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg">
                                Send Message
                            </button>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-6 py-3 bg-dark-bg-secondary border border-slate-700 text-white rounded-lg"
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
