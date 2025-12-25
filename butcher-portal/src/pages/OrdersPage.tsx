import { useState } from 'react'
import { Package, Truck, CheckCircle, Clock } from 'lucide-react'

const allOrders = [
    { id: 'ORD-001', customer: 'John Doe', items: ['Chicken 1kg', 'Mutton 500g'], amount: 850, status: 'new', date: 'Today' },
    { id: 'ORD-002', customer: 'Jane Smith', items: ['Fish 2kg'], amount: 600, status: 'processing', date: 'Today' },
    { id: 'ORD-003', customer: 'Bob Johnson', items: ['Chicken 2kg'], amount: 580, status: 'new', date: 'Today' },
    { id: 'ORD-004', customer: 'Alice Brown', items: ['Mutton 1kg', 'Fish 1kg'], amount: 1200, status: 'ready', date: 'Yesterday' },
    { id: 'ORD-005', customer: 'Charlie Wilson', items: ['Chicken 3kg'], amount: 870, status: 'delivered', date: 'Yesterday' },
]

const STATUS_CONFIG = {
    new: { label: '🆕 NEW', color: 'bg-green-500', icon: Package },
    processing: { label: '⚡ PROCESSING', color: 'bg-blue-500', icon: Clock },
    ready: { label: '✅ READY', color: 'bg-yellow-500', icon: CheckCircle },
    delivered: { label: '🚚 DELIVERED', color: 'bg-gray-500', icon: Truck },
}

export default function OrdersPage() {
    const [filter, setFilter] = useState<string>('all')

    const filteredOrders = filter === 'all'
        ? allOrders
        : allOrders.filter(o => o.status === filter)

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="card bg-gradient-to-r from-warm-brown to-warm-orange text-white">
                <h1 className="text-4xl font-bold">📦 All Orders</h1>
            </div>

            {/* Filter Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => setFilter('all')}
                    className={`py-4 px-6 text-xl font-bold rounded-xl transition-all ${filter === 'all'
                            ? 'bg-warm-brown text-white shadow-lg'
                            : 'bg-white text-gray-700 border-2 border-gray-300'
                        }`}
                >
                    All Orders
                </button>
                <button
                    onClick={() => setFilter('new')}
                    className={`py-4 px-6 text-xl font-bold rounded-xl transition-all ${filter === 'new'
                            ? 'bg-green-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 border-2 border-gray-300'
                        }`}
                >
                    🆕 New
                </button>
                <button
                    onClick={() => setFilter('processing')}
                    className={`py-4 px-6 text-xl font-bold rounded-xl transition-all ${filter === 'processing'
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 border-2 border-gray-300'
                        }`}
                >
                    ⚡ Processing
                </button>
                <button
                    onClick={() => setFilter('ready')}
                    className={`py-4 px-6 text-xl font-bold rounded-xl transition-all ${filter === 'ready'
                            ? 'bg-yellow-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 border-2 border-gray-300'
                        }`}
                >
                    ✅ Ready
                </button>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.map((order) => {
                    const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
                    const StatusIcon = statusConfig.icon

                    return (
                        <div key={order.id} className={`card bg-white border-l-8 ${order.status === 'new' ? 'border-green-500' :
                                order.status === 'processing' ? 'border-blue-500' :
                                    order.status === 'ready' ? 'border-yellow-500' :
                                        'border-gray-500'
                            }`}>
                            {/* Status Badge */}
                            <div className="flex items-center justify-between mb-4">
                                <span className={`badge ${statusConfig.color} text-white`}>
                                    {statusConfig.label}
                                </span>
                                <span className="text-xl text-gray-500">{order.date}</span>
                            </div>

                            {/* Order Info */}
                            <div className="mb-4">
                                <p className="text-xl text-gray-500 mb-1">{order.id}</p>
                                <h3 className="text-3xl font-bold text-gray-800 mb-3">👤 {order.customer}</h3>

                                {/* Items */}
                                <div className="space-y-2 mb-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <span className="text-gray-800 text-xl">•</span>
                                            <span className="text-xl text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Amount */}
                                <p className="text-4xl font-bold text-green-600">₹{order.amount}</p>
                            </div>

                            {/* Action Buttons */}
                            {order.status === 'new' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <CheckCircle className="w-6 h-6" />
                                        Accept
                                    </button>
                                    <button className="py-4 bg-red-500 hover:bg-red-600 text-white text-xl font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                        ❌ Reject
                                    </button>
                                </div>
                            )}

                            {order.status === 'processing' && (
                                <button className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white text-xl font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                    <CheckCircle className="w-6 h-6" />
                                    Mark as Ready
                                </button>
                            )}

                            {order.status === 'ready' && (
                                <div className="py-4 bg-yellow-100 text-yellow-800 text-xl font-bold rounded-xl text-center border-2 border-yellow-300">
                                    ⏳ Waiting for Pickup
                                </div>
                            )}

                            {order.status === 'delivered' && (
                                <div className="py-4 bg-gray-100 text-gray-600 text-xl font-bold rounded-xl text-center border-2 border-gray-300">
                                    ✅ Completed
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
                <div className="card bg-white text-center py-12">
                    <div className="text-7xl mb-4">📭</div>
                    <p className="text-3xl font-bold text-gray-600">No Orders Found</p>
                </div>
            )}
        </div>
    )
}
