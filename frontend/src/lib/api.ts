const isServer = typeof window === 'undefined';
const API_URL = isServer
    ? (process.env.INTERNAL_API_URL || 'http://localhost:8000')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

export async function getButchers() {
    try {
        const res = await fetch(`${API_URL}/api/butchers/`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error("Fetch error for butchers:", e);
        return [];
    }
}

export async function getMeatItems() {
    try {
        const res = await fetch(`${API_URL}/api/items/`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error("Fetch error for items:", e);
        return [];
    }
}

export async function getVillageSources() {
    try {
        const res = await fetch(`${API_URL}/api/village-sources/`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error("Fetch error for sources:", e);
        return [];
    }
}

export async function getButcher(id: string) {
    try {
        const res = await fetch(`${API_URL}/api/butchers/${id}/`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export async function getMeatItem(id: string) {
    try {
        const res = await fetch(`${API_URL}/api/items/${id}/`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

// ── Order Placement ──────────────────────────────────────────
export async function createOrder(token: string, payload: {
    butcher_id: number;
    delivery_address: string;
    delivery_phone: string;
    payment_method: string;
    items: { meat_item_id: number; quantity: number; price: number }[];
}) {
    try {
        const res = await fetch(`${API_URL}/api/create-order/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({ error: 'Order failed' }));
            return { success: false, ...error };
        }
        const data = await res.json();
        return { success: true, ...data };
    } catch (e) {
        console.error("Order creation error:", e);
        return { success: false, error: 'Network error' };
    }
}

// ── User Profile ─────────────────────────────────────────────
export async function getUserProfile(token: string) {
    try {
        const res = await fetch(`${API_URL}/api/profiles/`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.length > 0 ? data[0] : null;
    } catch (e) {
        return null;
    }
}

// ── Orders History ───────────────────────────────────────────
export async function getOrders(token: string) {
    try {
        const res = await fetch(`${API_URL}/api/orders/`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        return [];
    }
}
