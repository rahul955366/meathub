import { useState } from 'react'
import { User, Lock, LogIn } from 'lucide-react'
import { toast } from 'sonner'

interface LoginPageProps {
    onLogin: (butcher: any) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Mock login (replace with real API)
            await new Promise(resolve => setTimeout(resolve, 1000))

            if (email === 'butcher@meathub.com' && password === 'butcher123') {
                const butcherData = {
                    id: 'B001',
                    name: 'Rajesh Kumar',
                    shopName: 'Fresh Meat Corner',
                    email,
                    phone: '+91 9876543210',
                    role: 'BUTCHER',
                    status: 'approved'
                }

                localStorage.setItem('butcherToken', 'butcher-token-' + Date.now())
                localStorage.setItem('butcherData', JSON.stringify(butcherData))

                toast.success('Welcome! 👋')
                onLogin(butcherData)
            } else {
                toast.error('Wrong email or password!')
            }
        } catch (error) {
            toast.error('Login failed. Try again!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-warm-brown to-warm-orange flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-white rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-xl">
                        <span className="text-5xl">🥩</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">MEATHUB</h1>
                    <p className="text-2xl text-orange-100">Butcher Portal</p>
                </div>

                {/* Login Card */}
                <div className="card bg-white">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xl font-semibold text-gray-700 mb-2">
                                📧 Email
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-14 pr-4 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-warm-orange focus:border-warm-orange"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xl font-semibold text-gray-700 mb-2">
                                🔒 Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-14 pr-4 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-warm-orange focus:border-warm-orange"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-warm-brown to-warm-orange text-white text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3"
                        >
                            <LogIn className="w-7 h-7" />
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Demo Info */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                        <p className="text-lg font-semibold text-blue-800 mb-2">📝 Demo Login:</p>
                        <p className="text-base text-blue-700">Email: butcher@meathub.com</p>
                        <p className="text-base text-blue-700">Password: butcher123</p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-white text-lg mt-6">
                    © 2024 MEATHUB
                </p>
            </div>
        </div>
    )
}
