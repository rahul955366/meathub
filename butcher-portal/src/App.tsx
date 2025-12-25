import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import Navigation from './components/Navigation'

interface Butcher {
    id: string
    name: string
    shopName: string
    email: string
    phone: string
    status: 'pending' | 'approved'
    avatar?: string
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [butcher, setButcher] = useState<Butcher | null>(null)

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('butcherToken')
        const butcherData = localStorage.getItem('butcherData')

        if (token && butcherData) {
            const parsed = JSON.parse(butcherData)
            if (parsed.role === 'BUTCHER') {
                setIsAuthenticated(true)
                setButcher(parsed)
            }
        }
    }, [])

    const handleLogin = (data: Butcher) => {
        setIsAuthenticated(true)
        setButcher(data)
    }

    const handleLogout = () => {
        localStorage.removeItem('butcherToken')
        localStorage.removeItem('butcherData')
        setIsAuthenticated(false)
        setButcher(null)
    }

    if (!isAuthenticated) {
        return (
            <>
                <LoginPage onLogin={handleLogin} />
                <Toaster position="top-center" richColors />
            </>
        )
    }

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-warm-cream pb-20">
                {/* Main Content */}
                <main className="p-4">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage butcher={butcher!} />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/profile" element={<ProfilePage butcher={butcher!} onLogout={handleLogout} />} />
                    </Routes>
                </main>

                {/* Bottom Navigation */}
                <Navigation />
            </div>

            <Toaster position="top-center" richColors />
        </BrowserRouter>
    )
}

export default App
