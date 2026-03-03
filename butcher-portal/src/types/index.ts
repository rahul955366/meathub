export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff?: boolean;
    is_superuser?: boolean;
    is_butcher?: boolean;
}

export interface Address {
    id: number;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    is_default: boolean;
}

export interface UserProfile {
    id: number;
    user: User;
    first_name: string;
    last_name: string;
    full_name: string;
    phone: string;
    bio?: string;
    profile_image_url?: string;
    gender?: string;
    date_of_birth?: string;
    preferred_butcher_id?: number;
    addresses?: Address[];
    referral_code?: string;
    loyalty_points: number;
    created_at: string;
}

export interface Butcher {
    id: number;
    shop_name: string;
    address: string;
    phone_number: string;
    description: string;
    latitude?: number;
    longitude?: number;
    service_radius_km: number;
    image_url?: string;
    opening_time: string;
    closing_time: string;
    is_available: boolean;
    is_official: boolean;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    hygiene_score?: number;
    average_rating?: number;
    active_orders?: number;
    is_busy?: boolean;
    village_source?: string | object;
    live_stream_url?: string;
}

export interface MeatItem {
    id: number;
    butcher: number;
    butcher_name: string;
    name: string;
    description: string;
    price: string; // Decimal from backend comes as string usually
    quantity: number;
    category: string;
    image_url?: string;
    status: 'AVAILABLE' | 'SOLD_OUT' | 'HIDDEN';
    is_in_stock: boolean;
    created_at: string;
    // Phase 14 macro & classification fields
    protein_g?: number | null;
    fat_g?: number | null;
    calories?: number | null;
    is_gym_approved?: boolean;
    is_pet_suitable?: boolean;
    product_type?: string;
    village_source?: string;
}

export interface OrderItem {
    id: number;
    meat_item: number;
    meat_item_name: string;
    quantity: number;
    price_at_order: string;
    subtotal: number;
}

export interface OrderStatusEntry {
    status: string;
    timestamp: string;
    message: string;
}

export interface Order {
    id: number;
    user: number | null;
    user_email: string;
    butcher: number;
    butcher_name: string;
    butcher_is_official: boolean;
    butcher_lat?: number;
    butcher_lng?: number;
    total_amount: string;
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    payment_method: 'COD' | 'UPI' | 'CARD';
    payment_status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    delivery_address: string;
    delivery_phone: string;
    cutting_video_url?: string;
    status_history: OrderStatusEntry[];
    created_at: string;
    items: OrderItem[];
    is_cancellable: boolean;
    is_sunday_special?: boolean;
    sunday_slot?: string;
}

export interface Review {
    id: number;
    order: number;
    user: number | null;
    user_name: string;
    butcher: number;
    rating: number;
    comment: string;
    created_at: string;
}

export interface CartItem {
    id: number;
    meat_item_id: number; // Mapping to backend ID
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
    butcher_id: number;
    category?: string;
    selectedCut?: string; // Frontend specific
}

export interface VillageSource {
    id: number;
    name: string;
    location: string;
}

export interface Subscription {
    id: number;
    user: number;
    butcher: number;
    butcher_name: string;
    meat_item: number;
    meat_item_name: string;
    quantity_kg: string;
    period: string;
    delivery_option: 'SUNDAY_ONLY' | 'WEDNESDAY_SUNDAY';
    primary_day_of_week: string;
    delivery_time?: string;
    is_sunday_special: boolean;
    active: boolean;
    next_run_date: string;
    delivery_address: string;
    delivery_phone: string;
    subscription_price: string;
    skip_dates?: string[];
    created_at: string;
}

export interface GymSubscription {
    id: number;
    user: number;
    butcher: number;
    meat_item: number;
    meat_item_name: string;
    daily_quantity: string;
    delivery_time: string;
    active: boolean;
    next_delivery_date: string;
    delivery_address: string;
    delivery_phone: string;
    training_goal?: 'CUT' | 'BULK' | 'MAINTAIN';
    skip_dates?: string[];
}

export interface PetSubscription {
    id: number;
    user: number;
    pet_type: 'DOG' | 'CAT';
    product_name: string;
    quantity_kg: string;
    schedule_type: 'DAILY' | 'WEEKLY' | 'BI-WEEKLY' | 'MONTHLY';
    active: boolean;
    next_delivery_date: string;
    delivery_address: string;
    skip_dates?: string[];
}
