import { User, Phone, Mail, MapPin, DollarSign, Star, LogOut, Shield } from 'lucide-react'

interface ProfilePageProps {
    butcher: {
        name: string
        shopName: string
        email: string
        phone: string
    }
    onLogout: () => void
}

export default function ProfilePage({ butcher, onLogout }: ProfilePageProps) {
    const stats = {
        totalEarnings: 45600,
        totalOrders: 234,
        rating: 4.8,
        monthEarnings: 12400
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="card bg-gradient-to-r from-warm-brown to-warm-orange text-white">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl">
                        🥩
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">{butcher.name}</h1>
                        <p className="text-2xl text-orange-100">{butcher.shopName}</p>
                    </div>
                </div>
            </div>

            {/* Earnings */}
            <div className="grid grid-cols-2 gap-4">
                <div className="card bg-white border-4 border-green-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl text-gray-600 mb-1">Total Earnings</p>
                            <p className="text-4xl font-bold text-gray-800">₹{stats.totalEarnings}</p>
                        </div>
                        <DollarSign className="w-16 h-16 text-green-500" />
                    </div>
                </div>

                <div className="card bg-white border-4 border-blue-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl text-gray-600 mb-1">This Month</p>
                            <p className="text-4xl font-bold text-gray-800">₹{stats.monthEarnings}</p>
                        </div>
                        <DollarSign className="w-16 h-16 text-blue-500" />
                    </div>
                </div>

                <div className="card bg-white border-4 border-purple-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl text-gray-600 mb-1">Total Orders</p>
                            <p className="text-5xl font-bold text-gray-800">{stats.totalOrders}</p>
                        </div>
                        <User className="w-16 h-16 text-purple-500" />
                    </div>
                </div>

                <div className="card bg-white border-4 border-yellow-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl text-gray-600 mb-1">Rating</p>
                            <p className="text-5xl font-bold text-gray-800 flex items-center gap-2">
                                {stats.rating}
                                <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                            </p>
                        </div>
                        <Star className="w-16 h-16 text-yellow-500" />
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="card bg-white">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">📞 Contact Information</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <Mail className="w-10 h-10 text-warm-brown flex-shrink-0" />
                        <div>
                            <p className="text-lg text-gray-600">Email</p>
                            <p className="text-2xl font-semibold text-gray-800">{butcher.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <Phone className="w-10 h-10 text-warm-brown flex-shrink-0" />
                        <div>
                            <p className="text-lg text-gray-600">Phone</p>
                            <p className="text-2xl font-semibold text-gray-800">{butcher.phone}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <MapPin className="w-10 h-10 text-warm-brown flex-shrink-0" />
                        <div>
                            <p className="text-lg text-gray-600">Location</p>
                            <p className="text-2xl font-semibold text-gray-800">Mumbai, Maharashtra</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border-2 border-green-300">
                        <Shield className="w-10 h-10 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="text-lg text-green-700">Account Status</p>
                            <p className="text-2xl font-bold text-green-800">✅ Approved</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Button */}
            <button
                onClick={onLogout}
                className="w-full py-5 bg-red-500 hover:bg-red-600 text-white text-2xl font-bold rounded-xl transition-colors flex items-center justify-center gap-3 shadow-lg"
            >
                <LogOut className="w-7 h-7" />
                Logout
            </button>

            {/* Footer */}
            <div className="text-center text-gray-500 text-lg py-4">
                © 2024 MEATHUB - Butcher Portal
            </div>
        </div>
    )
}
