# 🎯 COMPLETE MULTI-PORTAL IMPLEMENTATION

## Overview
This document contains ALL the code needed for the 3-portal system. Copy each file exactly as shown.

---

## 📦 PART 1: ADMIN PORTAL - CORE FILES

### 1. index.html
**Location:** `admin-portal/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MEATHUB Admin</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 2. main.tsx
**Location:** `admin-portal/src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 3. index.css
**Location:** `admin-portal/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #0f172a;
  color: #f1f5f9;
}

* {
  box-sizing: border-box;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1e293b;
}

::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
```

### 4. App.tsx
**Location:** `admin-portal/src/App.tsx`

```typescript
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ComplaintsPage from './pages/ComplaintsPage'
import RefundsPage from './pages/RefundsPage'
import UsersPage from './pages/UsersPage'
import ButchersPage from './pages/ButchersPage'
import Sidebar from './components/Sidebar'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
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
  }, [])

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLogin={(userData) => {
          setIsAuthenticated(true)
          setUser(userData)
        }} />
        <Toaster position="top-right" richColors />
      </>
    )
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-900">
        <Sidebar user={user} onLogout={() => {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminUser')
          setIsAuthenticated(false)
          setUser(null)
        }} />
        
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage user={user} />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/refunds" element={<RefundsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/butchers" element={<ButchersPage />} />
          </Routes>
        </main>
      </div>
      
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}

export default App
```

---

## 📝 PART 2: ADMIN PORTAL - PAGES

### LoginPage.tsx
**Location:** `admin-portal/src/pages/LoginPage.tsx`

```typescript
import { useState } from 'react'
import { Lock, Mail, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface LoginPageProps {
  onLogin: (user: any) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:8000/auth/admin/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // })

      // Mock login for demo
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (email === 'admin@meathub.com' && password === 'admin123') {
        const userData = {
          id: '1',
          email,
          name: 'Admin User',
          role: 'ADMIN'
        }
        
        const token = 'mock-admin-token-' + Date.now()
        
        localStorage.setItem('adminToken', token)
        localStorage.setItem('adminUser', JSON.stringify(userData))
        
        toast.success('Welcome back, Admin!')
        onLogin(userData)
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">MEATHUB</h1>
          <p className="text-blue-300 text-lg">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@meathub.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-300 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-slate-400">Email: admin@meathub.com</p>
            <p className="text-xs text-slate-400">Password: admin123</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-6">
          © 2024 MEATHUB. All rights reserved.
        </p>
      </div>
    </div>
  )
}
```

---

**Continue in next file for remaining pages...**

This is Part 1 of the complete implementation. See:
- `ADMIN_PORTAL_CODE_PART2.md` for Dashboard, Orders, Analytics
- `ADMIN_PORTAL_CODE_PART3.md` for Components & AI Assistant
- `BUTCHER_PORTAL_CODE.md` for complete Butcher Portal
- `DEPLOYMENT_GUIDE.md` for final setup

**Total Implementation: 50+ files across 3 portals**
