import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, Shield, Eye, EyeOff, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface LoginPageProps {
    onLogin: (user: any) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // TODO: Replace with actual API call to backend
            // const response = await fetch('http://localhost:8000/auth/admin/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email, password })
            // })

            // Mock login for demo (REPLACE THIS IN PRODUCTION!)
            await new Promise(resolve => setTimeout(resolve, 1500))

            if (email === 'admin@meathub.com' && password === 'admin123') {
                const userData = {
                    id: '1',
                    email,
                    name: 'Admin User',
                    role: 'ADMIN',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
                }

                const token = 'mock-admin-token-' + Date.now()

                localStorage.setItem('adminToken', token)
                localStorage.setItem('adminUser', JSON.stringify(userData))

                toast.success('Welcome back, Admin! 🎉')
                onLogin(userData)
            } else {
                toast.error('Invalid credentials. Please try again.')
            }
        } catch (error) {
            console.error('Login failed:', error)
            toast.error('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen animated-gradient flex items-center justify-center p-4 relative overflow-hidden">
            {/* Floating Particles Background */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/10 rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        transition={{
                            duration: Math.random() * 10 + 20,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    />
                ))}
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple mb-6 shadow-glow-blue"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Shield className="w-12 h-12 text-white" />
                    </motion.div>

                    <h1 className="text-5xl font-bold mb-2">
                        <span className="gradient-text">MEATHUB</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent-blue" />
                        <p className="text-xl text-accent-blue font-semibold">Admin Portal</p>
                        <Sparkles className="w-5 h-5 text-accent-purple" />
                    </div>
                    <p className="text-slate-400 mt-2">Command Center for Excellence</p>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="glass rounded-2xl p-8 shadow-soft"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Secure Admin Access
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all"
                                    placeholder="admin@meathub.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 bg-dark-bg-secondary border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-purple hover:to-accent-blue text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-glow-blue"
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                'Sign In to Admin Portal'
                            )}
                        </motion.button>
                    </form>

                    {/* Demo Credentials */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 p-4 bg-accent-blue/10 border border-accent-blue/30 rounded-lg"
                    >
                        <p className="text-xs font-medium text-accent-blue mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Demo Credentials (Development Only)
                        </p>
                        <div className="space-y-1">
                            <p className="text-xs text-slate-400">
                                <span className="text-slate-300">Email:</span> admin@meathub.com
                            </p>
                            <p className="text-xs text-slate-400">
                                <span className="text-slate-300">Password:</span> admin123
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center text-slate-500 text-sm mt-6"
                >
                    © 2024 MEATHUB. All rights reserved. | Secured by Enterprise-Grade Encryption
                </motion.p>
            </div>
        </div>
    )
}
