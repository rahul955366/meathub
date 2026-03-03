'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import {
    LayoutDashboard, PackageCheck, WarehouseIcon,
    ChevronRight, LogOut, Menu, X, Calendar
} from 'lucide-react';

const NAV = [
    { href: '/butcher/menu', label: "Today's Menu", Icon: Calendar }, // Reused Calendar or similar
    { href: '/butcher/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { href: '/butcher/orders', label: 'Orders', Icon: PackageCheck },
    { href: '/butcher/inventory', label: 'Inventory', Icon: WarehouseIcon },
    { href: '/butcher/sunday-preview', label: 'Sunday Preview', Icon: Calendar },
];

export default function ButcherLayout({ children }: { children: React.ReactNode }) {
    const { token } = useAppContext();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [checkingRole, setCheckingRole] = useState(true);

    // Protect all butcher routes – must be logged in AND have butcher role
    useEffect(() => {
        async function verifyRole() {
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const { getMe } = await import('@/lib/api');
                const me = await getMe(token);
                if (!me || !me.is_butcher) {
                    console.error("Access Denied: You do not have butcher privileges.");
                    router.push('/');
                } else {
                    setCheckingRole(false);
                }
            } catch (err) {
                console.error("Role verification failed:", err);
                router.push('/');
            }
        }
        verifyRole();
    }, [token, router]);

    if (!token || checkingRole) return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#0a0a0f]">
            {/* ── Sidebar ── */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-[#12121a] border-r border-white/5
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-black text-sm">M</div>
                    <div>
                        <p className="text-white font-bold text-sm">MeatHub</p>
                        <p className="text-white/40 text-xs">Butcher Portal</p>
                    </div>
                    <button className="ml-auto lg:hidden text-white/40" onClick={() => setSidebarOpen(false)}>
                        <X size={18} />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV.map(({ href, label, Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all group"
                        >
                            <Icon size={18} />
                            <span className="text-sm font-medium">{label}</span>
                            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </nav>

                {/* Bottom actions */}
                <div className="px-3 py-4 border-t border-white/5">
                </div>
            </aside>

            {/* ── Mobile overlay ── */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── Main content ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[#12121a] lg:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white">
                        <Menu size={20} />
                    </button>
                    <span className="text-white font-semibold text-sm">Butcher Portal</span>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
