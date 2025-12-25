import { Package, DollarSign, Clock, CheckCircle } from 'lucide-react'

interface DashboardPageProps {
    butcher: {
        name: string
        shopName: string
        status: string
    }
}

const todayOrders = [
    { id: '1', customer: 'John Doe', items: 'Chicken 1kg, Mutton 500g', amount: 850, status: 'new' },
    { id: '2', customer: 'Jane Smith', items: 'Fish 2kg', amount: 600, status: 'processing' },
    { id: '3', customer: 'Bob Johnson', items: 'Chicken 2kg', amount: 580, status: 'new' },
]

export default function DashboardPage({ butcher }: DashboardPageProps) {
    const stats = {
        todayOrders: 12,
        moneyEarned: 5400,
        pending: 5,
        completed: 7
    }

    // Check if pending approval
    if (butcher.status === 'pending') {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="card bg-yellow-50 border-4 border-yellow-300 text-center py-12">
                    <div className="text-7xl mb-4">⏳</div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Waiting for Admin Approval</h1>
                    <p className="text-2xl text-gray-600 mb-6">Your account is being reviewed</p>
                    <p className="text-xl text-gray-500">You'll be notified soon!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Greeting */}
            <div className="card bg-gradient-to-r from-warm-brown to-warm-orange text-white">
                <h1 className="text-4xl font-bold mb-2">Hello, {butcher.name}! 👋</h1>
                <p className="text-2xl">{butcher.shopName}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="card bg-white border-4 border-green-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl text-gray-600 mb-1">Today's Orders</p>
                            <p className="text-5xl font-bold text-gray-800">{stats.todayOrders}</p>
                        </div>
                        <Package className="w-16 h-16 text-green-500" />
                    </div>
                </div>

                <div className="card bg-white border-4 border-blue-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl text-gray-600 mb-1">Money Earned</p>
                            <p className="text-4xl font-bold text-gray-800">₹{stats.moneyEarned}</p>
                        </div>
                        <DollarSign className="w-16 h-16 text-blue-500" />
                    </div>
                </div>

                <div className="card bg-white border-4 border-orange-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl text-gray-600 mb-1">Pending</p>
                            <p className="text-5xl font-bold text-gray-800">{stats.pending}</p>
                        </div>
                        <Clock className="w-16 h-16 text-orange-500" />
                    </div>
                </div>

                <div className="card bg-white border-4 border-purple-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl text-gray-600 mb-1">Completed</p>
                            <p className="text-5xl font-bold text-gray-800">{stats.completed}</p>
                        </div>
                        <CheckCircle className="w-16 h-16 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Today's Orders */}
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">📦 Today's Orders</h2>
                <div className="space-y-4">
                    {todayOrders.map((order) => (
                        <div key={order.id} className="card bg-white border-l-8 border-green-500">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="badge bg-green-500 text-white">
                                            🆕 NEW
                                        </span>
                                        <span className="text-xl text-gray-500">#{order.id}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">👤 {order.customer}</h3>
                                    <p className="text-xl text-gray-600 mb-2">{order.items}</p>
                                    <p className="text-3xl font-bold text-green-600">₹{order.amount}</p>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-green-500 hover:bg-green-600 text-white text-2xl font-bold rounded-xl transition-colors flex items-center justify-center gap-3">
                                ✅ Accept Order
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
