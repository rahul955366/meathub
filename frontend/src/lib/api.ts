import { Butcher, MeatItem, VillageSource, Order, UserProfile, Subscription, GymSubscription, PetSubscription } from '../types';

const isServer = typeof window === 'undefined';
const API_URL = isServer
    ? (process.env.INTERNAL_API_URL || 'http://localhost:8000')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
    try {
        const url = `${API_URL}/api${endpoint}`;
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            cache: 'no-store', // Ensure fresh data
        });

        if (!res.ok) {
            if (res.status === 429) {
                console.warn(`RATE LIMIT EXCEEDED: ${url}. Retrying later.`);
                // We could implement a toast or global state update here if needed
                return null;
            }
            const errorBody = await res.text();
            console.error(`API Error ${res.status} for ${url}:`, errorBody);
            return null;
        }

        return res.json() as Promise<T>;
    } catch (e) {
        console.error(`Network Error for ${endpoint}:`, e);
        return null;
    }
}

// ── Public Data Fetching ─────────────────────────────────────

export async function getButchers(): Promise<Butcher[]> {
    const data = await request<Butcher[]>('/butchers/');
    return data || [];
}

export async function getMeatItems(): Promise<MeatItem[]> {
    const data = await request<MeatItem[]>('/items/');
    return data || [];
}

export async function getVillageSources(): Promise<VillageSource[]> {
    const data = await request<VillageSource[]>('/village-sources/');
    return data || [];
}

export async function getButcher(id: string): Promise<Butcher | null> {
    return request<Butcher>(`/butchers/${id}/`);
}

export async function getNearbyButchers(lat: number, lng: number, radius: number = 5): Promise<any[]> {
    const data = await request<any[]>(`/butchers/nearby/?lat=${lat}&lng=${lng}&radius=${radius}`);
    return data || [];
}

export async function getOfficialItems(): Promise<any[]> {
    const data = await request<any[]>(`/official-items/`);
    return data || [];
}

export async function getMeatItem(id: string): Promise<MeatItem | null> {
    return request<MeatItem>(`/items/${id}/`);
}

// ── Authenticated Requests ───────────────────────────────────

export async function getUserProfile(token: string): Promise<UserProfile | null> {
    // The viewset returns a list, we take the first item
    const data = await request<UserProfile[]>('/profiles/', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data && data.length > 0 ? data[0] : null;
}

export async function getOrders(token: string): Promise<Order[]> {
    const data = await request<Order[]>('/orders/', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data || [];
}

export async function getSubscriptions(token: string): Promise<Subscription[]> {
    const data = await request<Subscription[]>('/subscriptions/', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data || [];
}

export async function getGymSubscriptions(token: string): Promise<GymSubscription[]> {
    const data = await request<GymSubscription[]>('/gym-subscriptions/', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data || [];
}

export async function getPetSubscriptions(token: string): Promise<PetSubscription[]> {
    const data = await request<PetSubscription[]>('/pet-subscriptions/', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data || [];
}

export async function toggleSubscriptionStatus(token: string, type: 'general' | 'gym' | 'pet', id: number, active: boolean): Promise<boolean> {
    const endpoint = type === 'general' ? `/subscriptions/${id}/` : type === 'gym' ? `/gym-subscriptions/${id}/` : `/pet-subscriptions/${id}/`;
    const res = await fetch(`${API_URL}/api${endpoint}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ active }),
    });
    return res.ok;
}

export async function createOrder(token: string | null, payload: {
    butcher_id: number;
    delivery_address: string;
    delivery_phone: string;
    payment_method: string;
    items: { meat_item_id: number; quantity: number; price: number }[];
}): Promise<{ success: boolean; order_id?: number; is_official?: boolean; error?: string }> {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}/api/create-order/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.error || 'Order creation failed' };
        }

        return { success: true, order_id: data.order_id, is_official: data.is_official };
    } catch (e) {
        console.error("Order creation network error:", e);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

// ── Subscriptions ────────────────────────────────────────────

export async function createSubscription(token: string, payload: any): Promise<boolean> {
    const res = await fetch(`${API_URL}/api/subscriptions/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return res.ok;
}

export async function createGymSubscription(token: string, payload: any): Promise<boolean> {
    const res = await fetch(`${API_URL}/api/gym-subscriptions/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return res.ok;
}

export async function createPetSubscription(token: string, payload: any): Promise<boolean> {
    const res = await fetch(`${API_URL}/api/pet-subscriptions/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    return res.ok;
}

// ── AI Assistant ──────────────────────────────────────────────

export async function getContextualAI(token: string, context: string, message: string): Promise<{ response: string } | null> {
    const res = await fetch(`${API_URL}/api/context-ai/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ context, message }),
    });
    if (!res.ok) return null;
    return res.json();
}
