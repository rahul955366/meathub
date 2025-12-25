import { Link, useLocation } from 'react-router-dom'
import { Home, Package, User } from 'lucide-react'

export default function Navigation() {
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-warm-brown shadow-2xl">
            <div className="max-w-4xl mx-auto px-4">
                <div className="grid grid-cols-3 gap-2 py-3">
                    {/* Home */}
                    <Link
                        to="/dashboard"
                        className={`flex flex-col items-center gap-2 py-3 rounded-xl transition-all ${isActive('/dashboard')
                                ? 'bg-warm-brown text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Home className="w-10 h-10" />
                        <span className="text-lg font-bold">Home</span>
                    </Link>

                    {/* Orders */}
                    <Link
                        to="/orders"
                        className={`flex flex-col items-center gap-2 py-3 rounded-xl transition-all ${isActive('/orders')
                                ? 'bg-warm-brown text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Package className="w-10 h-10" />
                        <span className="text-lg font-bold">Orders</span>
                    </Link>

                    {/* Profile */}
                    <Link
                        to="/profile"
                        className={`flex flex-col items-center gap-2 py-3 rounded-xl transition-all ${isActive('/profile')
                                ? 'bg-warm-brown text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <User className="w-10 h-10" />
                        <span className="text-lg font-bold">Profile</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
