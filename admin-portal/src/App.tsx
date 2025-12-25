import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

// Pages
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ComplaintsPage from './pages/ComplaintsPage'
import RefundsPage from './pages/RefundsPage'
import UsersPage from './pages/UsersPage'
import ButchersPage from './pages/ButchersPage'

// Layout
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import AdminAI from './components/ai/AdminAI'

// Types
interface User {
    id: string
    email: string
    name: string
    role: string
    avatar?: string
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check authentication on mount
        checkAuth()
    }, [])

    const checkAuth = () => {
        try {
            const token = localStorage.getItem('adminToken')
            const userData = localStorage.getItem('adminUser')

            if (token && userData) {
                const parsedUser = JSON.parse(userData)

                // Verify role is ADMIN
                if (parsedUser.role === 'ADMIN') {
                    setIsAuthenticated(true)
                    setUser(parsedUser)
                } else {
                    // Not an admin, redirect to customer portal
                    window.location.href = 'http://localhost:5173'
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = (userData: User) => {
        setIsAuthenticated(true)
        setUser(userData)
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        setIsAuthenticated(false)
        setUser(null)
    }

    // Loading screen
    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg-primary flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading Admin Portal...</p>
                </motion.div>
            </div>
        )
    }

    // Login screen
    if (!isAuthenticated) {
        return (
            <>
                <LoginPage onLogin={handleLogin} />
                <Toaster position="top-right" richColors theme="dark" />
            </>
        )
    }

    // Main application
    return (
        <BrowserRouter>
            <div className="flex h-screen bg-dark-bg-primary overflow-hidden">
                {/* Sidebar */}
                <Sidebar user={user!} onLogout={handleLogout} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <TopBar user={user!} />

                    {/* Page Content with Animation */}
                    <main className="flex-1 overflow-y-auto p-6">
                        <AnimatePresence mode="wait">
                            <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<DashboardPage user={user!} />} />
                                <Route path="/orders" element={<OrdersPage />} />
                                <Route path="/analytics" element={<AnalyticsPage />} />
                                <Route path="/complaints" element={<ComplaintsPage />} />
                                <Route path="/refunds" element={<RefundsPage />} />
                                <Route path="/users" element={<UsersPage />} />
                                <Route path="/butchers" element={<ButchersPage />} />
                                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                            </Routes>
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* Admin AI Assistant - Available on all pages */}
            <AdminAI />

            {/* Toast Notifications */}
            <Toaster position="top-right" richColors theme="dark" />
        </BrowserRouter>
    )
}

export default App
