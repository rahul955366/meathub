export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
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
}

export interface OrderItem {
    id: number;
    meat_item: number;
    meat_item_name: string;
    quantity: number;
    price_at_order: string;
    subtotal: number;
}

export interface Order {
    id: number;
    user: number;
    user_email: string;
    butcher: number;
    butcher_name: string;
    total_amount: string;
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    payment_method: 'COD' | 'UPI' | 'CARD';
    delivery_address: string;
    delivery_phone: string;
    created_at: string;
    items: OrderItem[];
    is_cancellable: boolean;
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
}
