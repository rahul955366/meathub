import { Butcher, MeatItem, VillageSource, Order, UserProfile, Subscription, GymSubscription, PetSubscription, OrderItem } from '../types';

export interface AuthUser {
    id: number;
    username: string;
    is_butcher: boolean;
    butcher_id: number | null;
    email: string;
    is_staff: boolean;
}

export interface NearbyButcher {
    id: number;
    shop_name: string;
    distance_km: number;
    latitude: number;
    longitude: number;
    address: string;
    image_url: string;
    rating: string | null;
    delivery_time: number;
    is_official: boolean;
    hygiene_score?: number;
    hygiene_score_display?: number;
    live_stream_url?: string;
    is_busy?: boolean;
    active_orders?: number;
}

export interface OfficialItem {
    id: number;
    name: string;
    price: string;
    category: string;
    image_url: string;
    butcher_name: string;
    butcher_id: number;
    live_stream_url?: string | null;
}

const isServer = typeof window === 'undefined';
const API_URL = isServer
    ? (process.env.INTERNAL_API_URL || 'http://localhost:8000')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

// ── Auth Failure Interceptor ─────────────────────────────────
type AuthFailureCallback = () => void;
let onAuthFailure: AuthFailureCallback | null = null;

export function registerAuthFailureCallback(callback: AuthFailureCallback) {
    onAuthFailure = callback;
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
    try {
        const url = `${API_URL}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            if (res.status === 401 && onAuthFailure) {
                console.warn(`AUTH EXPIRED: ${url}. Triggering logout protocol.`);
                onAuthFailure();
                return null;
            }
            if (res.status === 429) {
                console.warn(`RATE LIMIT EXCEEDED: ${url}. Retrying later.`);
                return null;
            }

            const errorBody = await res.text();

            // Handle 404 naturally as null return to avoid scary console errors for expected 'not found' cases
            if (res.status === 404) {
                console.warn(`RESOURCE NOT FOUND (404): ${url}`);
                return null;
            }

            try {
                const parsedError = JSON.parse(errorBody);
                console.error(`API Error ${res.status} for ${url}:`, parsedError);
            } catch (e) {
                console.error(`API Error ${res.status} for ${url}:`, errorBody);
            }
            return null;
        }

        const data = await res.json();

        // Handle DRF Pagination — fetch ALL pages automatically
        if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) {
            let allResults = [...data.results];
            let nextUrl = data.next;
            while (nextUrl) {
                try {
                    const nextRes = await fetch(nextUrl, {
                        ...options,
                        headers: { 'Content-Type': 'application/json', ...options.headers },
                        cache: 'no-store',
                    });
                    if (!nextRes.ok) break;
                    const nextData = await nextRes.json();
                    allResults = [...allResults, ...nextData.results];
                    nextUrl = nextData.next;
                } catch { break; }
            }
            return allResults as T;
        }

        return data as T;
    } catch (error) {
        console.error(`Network Error for ${endpoint}:`, error);
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

export async function getNearbyButchers(lat: number, lng: number, radius: number = 5): Promise<NearbyButcher[]> {
    const data = await request<NearbyButcher[]>(`/butchers/nearby/?lat=${lat}&lng=${lng}&radius=${radius}`);
    return data || [];
}

export async function getOfficialItems(): Promise<OfficialItem[]> {
    const data = await request<OfficialItem[]>(`/official-items/`);
    return data || [];
}

export async function getMeatItem(id: string): Promise<MeatItem | null> {
    return request<MeatItem>(`/items/${id}/`);
}

// ── Private / Authenticated Data ─────────────────────────────
export async function getMe(token: string): Promise<AuthUser | null> {
    return request<AuthUser>('/auth/me/', {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function requestPasswordReset(email: string): Promise<boolean> {
    const data = await request('/auth/password-reset/request/', {
        method: 'POST',
        body: JSON.stringify({ email })
    });
    return data !== null;
}

export async function confirmPasswordReset(payload: any): Promise<boolean> {
    const data = await request('/auth/password-reset/confirm/', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    return data !== null;
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
    const data = await request(endpoint, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ active }),
    });
    return data !== null;
}

export async function skipSubscriptionDelivery(token: string, type: 'general' | 'gym' | 'pet', id: number, date: string): Promise<boolean> {
    const endpoint = type === 'general' ? `/subscriptions/${id}/` : type === 'gym' ? `/gym-subscriptions/${id}/` : `/pet-subscriptions/${id}/`;

    // Fetch current subscription to get existing skip_dates
    const current = await request<any>(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!current) return false;

    const skip_dates = [...(current.skip_dates || []), date];

    const data = await request(endpoint, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ skip_dates }),
    });
    return data !== null;
}

export async function createOrder(token: string | null, payload: {
    butcher_id: number;
    delivery_address: string;
    delivery_phone: string;
    payment_method: string;
    payment_id?: string;
    sunday_special?: boolean;
    sunday_slot?: string;
    items: { meat_item_id: number; quantity: number; price: number }[];
})
    : Promise<{ success: boolean; order_id?: number; is_official?: boolean; error?: string }> {
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

export async function createSubscription(token: string, payload: Partial<Subscription>): Promise<boolean> {
    const data = await request<Subscription>('/subscriptions/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
    });
    return data !== null;
}

export async function createGymSubscription(token: string, payload: Partial<GymSubscription>): Promise<boolean> {
    const data = await request<GymSubscription>('/gym-subscriptions/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
    });
    return data !== null;
}

export async function createPetSubscription(token: string, payload: Partial<PetSubscription>): Promise<boolean> {
    const data = await request<PetSubscription>('/pet-subscriptions/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
    });
    return data !== null;
}

// ── Reviews ──────────────────────────────────────────────────

export async function createReview(token: string, payload: {
    order: number;
    butcher: number;
    rating: number;
    comment?: string;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await fetch(`${API_URL}/api/reviews/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const data = await res.json();
            return { success: false, error: data.detail || 'Review submission failed' };
        }

        return { success: true };
    } catch (e) {
        console.error("Review creation network error:", e);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

export async function getReviews(butcherId: number): Promise<any[]> {
    const data = await request<any[]>(`/reviews/?butcher=${butcherId}`);
    return data || [];
}

// ── Payment Gateway ──────────────────────────────────────────

export async function createPaymentOrder(token: string, amount: number) {
    return request<{ success: boolean; razorpay_order_id: string; razorpay_key: string }>(
        '/payment/create-order/',
        {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ amount }),
        }
    );
}

export async function verifyPayment(token: string, details: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    return request<{ success: boolean; payment_id: string }>(
        '/payment/verify/',
        {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(details),
        }
    );
}

// ── AI Assistant ──────────────────────────────────────────────

export async function getContextualAI(token: string, context: string, message: string): Promise<{ response: string } | null> {
    const res = await fetch(`${API_URL}/api/contextual-ai/`, {
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

// ── Butcher Inventory (for Butcher Portal) ────────────────────

export async function fetchButcherItems(token: string): Promise<MeatItem[]> {
    const data = await request<MeatItem[]>('/items/?mine=true', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data || [];
}

// ── Pet Food Products ─────────────────────────────────────────

export async function fetchPetFoodProducts(): Promise<any[]> {
    const data = await request<any[]>('/pet-food-products/');
    return Array.isArray(data) ? data : [];
}

// ── Waste Collections ─────────────────────────────────────────

export async function fetchWasteCollections(): Promise<any[]> {
    const data = await request<any[]>('/waste-collection/');
    return Array.isArray(data) ? data : [];
}

// ── Order Management ──────────────────────────────────────────

export async function updateOrderStatus(token: string, orderId: number, status: string): Promise<boolean> {
    const data = await request(`/orders/${orderId}/update-status/`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
    });
    return data !== null;
}

export async function updateMeatItem(token: string, itemId: number, payload: Record<string, unknown>): Promise<boolean> {
    const data = await request(`/items/${itemId}/`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
    });
    return data !== null;
}

export async function uploadOrderVideo(token: string, orderId: number, videoUrl: string): Promise<boolean> {
    const data = await request(`/orders/${orderId}/upload-video/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ video_url: videoUrl })
    });
    return data !== null;
}

export async function getOrderHistory(token: string, orderId: number): Promise<any[]> {
    const data = await request<any[]>(`/orders/${orderId}/history/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data || [];
}
