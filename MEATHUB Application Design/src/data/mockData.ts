// MEATHUB - Mock Data representing Backend API Responses
// This simulates responses from the 14 microservices

import { 
  MeatProduct, 
  Order, 
  User, 
  Subscription, 
  GymPlan, 
  PetProduct,
  Address 
} from '../types';

// Mock Users
export const mockUsers: Record<string, User> = {
  user1: {
    id: 'user1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    role: 'USER',
    totalOrders: 24,
    createdAt: '2024-01-15',
    addresses: [
      {
        id: 'addr1',
        line1: '123, MG Road',
        line2: 'Near City Mall',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        landmark: 'Opposite ICICI Bank',
        isDefault: true
      }
    ]
  },
  butcher1: {
    id: 'butcher1',
    name: 'Mohammed Ali',
    email: 'ali@meathub.com',
    phone: '+91 98765 12345',
    role: 'BUTCHER',
    totalOrders: 0,
    createdAt: '2024-03-01',
    addresses: [],
    isApproved: true,
    approvalStatus: 'APPROVED'
  },
  admin1: {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@meathub.com',
    phone: '+91 98765 00000',
    role: 'ADMIN',
    totalOrders: 0,
    createdAt: '2023-01-01',
    addresses: []
  }
};

// Mock Chicken Products
export const chickenProducts: MeatProduct[] = [
  {
    id: 'ch1',
    name: 'Chicken Breast',
    category: 'CHICKEN',
    cutType: 'Boneless',
    description: 'Premium quality chicken breast, perfect for grilling and healthy meals',
    price: 320,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500',
    inStock: true,
    nutritionInfo: {
      protein: 31,
      fat: 3.6,
      calories: 165,
      carbs: 0
    },
    tags: ['High Protein', 'Low Fat', 'Gym Special']
  },
  {
    id: 'ch2',
    name: 'Chicken Curry Cut',
    category: 'CHICKEN',
    cutType: 'With Bone',
    description: 'Traditional curry cut with bone, perfect for rich curries',
    price: 240,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500',
    inStock: true,
    nutritionInfo: {
      protein: 27,
      fat: 15,
      calories: 239,
      carbs: 0
    },
    tags: ['Traditional', 'Family Favorite']
  },
  {
    id: 'ch3',
    name: 'Chicken Wings',
    category: 'CHICKEN',
    cutType: 'With Bone',
    description: 'Juicy chicken wings, great for starters and BBQ',
    price: 280,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500',
    inStock: true,
    nutritionInfo: {
      protein: 30,
      fat: 18,
      calories: 290,
      carbs: 0
    },
    tags: ['BBQ Special', 'Party Favorite']
  },
  {
    id: 'ch4',
    name: 'Chicken Thighs',
    category: 'CHICKEN',
    cutType: 'Boneless',
    description: 'Tender and juicy boneless thighs, versatile for any recipe',
    price: 300,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1562967916-7fd14e87af8b?w=500',
    inStock: true,
    nutritionInfo: {
      protein: 26,
      fat: 10,
      calories: 209,
      carbs: 0
    },
    tags: ['Juicy', 'Versatile']
  }
];

// Mock Mutton Products
export const muttonProducts: MeatProduct[] = [
  {
    id: 'mt1',
    name: 'Mutton Curry Cut',
    category: 'MUTTON',
    cutType: 'With Bone',
    description: 'Premium quality mutton curry cut, slow-cooked to perfection',
    price: 680,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500',
    inStock: true,
    nutritionInfo: {
      protein: 25,
      fat: 21,
      calories: 294,
      carbs: 0
    },
    tags: ['Premium', 'Traditional']
  },
  {
    id: 'mt2',
    name: 'Mutton Boneless',
    category: 'MUTTON',
    cutType: 'Boneless',
    description: 'Tender boneless mutton pieces, perfect for special dishes',
    price: 780,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3?w=500',
    inStock: true,
    nutritionInfo: {
      protein: 27,
      fat: 24,
      calories: 310,
      carbs: 0
    },
    tags: ['Premium', 'Tender', 'Special Occasion']
  }
];

// Mock Fish Products
export const fishProducts: MeatProduct[] = [
  {
    id: 'fs1',
    name: 'Pomfret',
    category: 'FISH',
    cutType: 'Whole',
    description: 'Fresh pomfret, cleaned and ready to cook',
    price: 450,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1559667842-0bbf9de0f71e?w=500',
    inStock: true,
    nutritionInfo: {
      protein: 19,
      fat: 4,
      calories: 115,
      carbs: 0
    },
    tags: ['Fresh', 'Omega-3']
  },
  {
    id: 'fs2',
    name: 'Salmon',
    category: 'FISH',
    cutType: 'Fillet',
    description: 'Premium salmon fillets, rich in omega-3',
    price: 850,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500',
    inStock: true,
    nutritionInfo: {
      protein: 20,
      fat: 13,
      calories: 208,
      carbs: 0
    },
    tags: ['Premium', 'Omega-3', 'Heart Healthy']
  }
];

// Mock Prawns Products
export const prawnsProducts: MeatProduct[] = [
  {
    id: 'pr1',
    name: 'Tiger Prawns',
    category: 'PRAWNS',
    cutType: 'Large',
    description: 'Fresh tiger prawns, cleaned and deveined',
    price: 720,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500',
    inStock: true,
    nutritionInfo: {
      protein: 24,
      fat: 1,
      calories: 99,
      carbs: 0
    },
    tags: ['Premium', 'Low Fat']
  }
];

// Mock Marinated Products
export const marinatedProducts: MeatProduct[] = [
  {
    id: 'mr1',
    name: 'Tandoori Chicken',
    category: 'MARINATED',
    cutType: 'Boneless',
    description: 'Chicken marinated in authentic tandoori spices, ready to cook',
    price: 380,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500',
    inStock: true,
    isMarinated: true,
    marinationType: 'Tandoori',
    nutritionInfo: {
      protein: 30,
      fat: 8,
      calories: 195,
      carbs: 2
    },
    tags: ['Ready to Cook', 'Tandoori', 'Party Special']
  },
  {
    id: 'mr2',
    name: 'Chicken Tikka',
    category: 'MARINATED',
    cutType: 'Boneless',
    description: 'Chicken tikka marinated in yogurt and spices',
    price: 360,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500',
    inStock: true,
    isMarinated: true,
    marinationType: 'Tikka',
    nutritionInfo: {
      protein: 29,
      fat: 7,
      calories: 185,
      carbs: 3
    },
    tags: ['Ready to Cook', 'Tikka', 'Classic']
  }
];

// Mock Gym Products
export const gymProducts: MeatProduct[] = [
  {
    id: 'gm1',
    name: 'Gym Special - Chicken Breast',
    category: 'GYM',
    cutType: 'Boneless',
    description: 'Lean chicken breast, perfect for muscle building',
    price: 340,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1606787364406-a3tirss8aa04?w=500',
    inStock: true,
    nutritionInfo: {
      protein: 31,
      fat: 3.6,
      calories: 165,
      carbs: 0
    },
    tags: ['High Protein', 'Low Fat', 'Muscle Building']
  }
];

// Mock Pet Products
export const petProducts: PetProduct[] = [
  {
    id: 'pt1',
    name: 'Dog Food - Chicken Mince',
    category: 'PET',
    cutType: 'Minced',
    description: 'Fresh chicken mince for dogs, nutrient-rich',
    price: 180,
    unit: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500',
    inStock: true,
    petType: 'DOG',
    preparationType: 'RAW',
    nutritionInfo: {
      protein: 25,
      fat: 12,
      calories: 215,
      carbs: 0
    },
    tags: ['Pet Food', 'Dog', 'Fresh']
  }
];

// All products combined
export const allProducts: MeatProduct[] = [
  ...chickenProducts,
  ...muttonProducts,
  ...fishProducts,
  ...prawnsProducts,
  ...marinatedProducts,
  ...gymProducts,
  ...petProducts
];

// Mock Active Order
export const mockActiveOrder: Order = {
  id: 'ORD-2024-001234',
  userId: 'user1',
  items: [
    {
      productId: 'ch1',
      productName: 'Chicken Breast',
      cutType: 'Boneless',
      quantity: 1,
      price: 320,
      subtotal: 320,
      imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500'
    },
    {
      productId: 'mt1',
      productName: 'Mutton Curry Cut',
      cutType: 'With Bone',
      quantity: 0.5,
      price: 680,
      subtotal: 340,
      imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500'
    }
  ],
  totalAmount: 660,
  status: 'CUTTING',
  deliveryAddress: mockUsers.user1.addresses[0],
  butcherId: 'butcher1',
  butcherName: 'Mohammed Ali',
  orderDate: new Date().toISOString(),
  estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  trackingInfo: {
    currentStatus: 'CUTTING',
    timeline: [
      {
        status: 'PLACED',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        message: 'Order placed successfully',
        completed: true
      },
      {
        status: 'CUTTING',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        message: 'Your meat is being freshly cut',
        completed: true
      },
      {
        status: 'PACKED',
        timestamp: '',
        message: 'Order will be packed soon',
        completed: false
      },
      {
        status: 'OUT_FOR_DELIVERY',
        timestamp: '',
        message: 'Out for delivery',
        completed: false
      },
      {
        status: 'DELIVERED',
        timestamp: '',
        message: 'Delivered',
        completed: false
      }
    ],
    estimatedArrival: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    deliveryPersonName: 'Ramesh',
    deliveryPersonPhone: '+91 98765 99999'
  },
  videos: [
    {
      id: 'vid1',
      orderId: 'ORD-2024-001234',
      type: 'CUTTING',
      videoUrl: '/videos/cutting-video.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1588347818036-8fc58e3efe5a?w=500',
      uploadedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      uploadedBy: 'butcher1'
    }
  ]
};

// Mock Gym Plans
export const gymPlans: GymPlan[] = [
  {
    id: 'gym1',
    name: 'Muscle Builder',
    description: '150g protein daily - Perfect for muscle building',
    dailyProtein: 150,
    products: [
      {
        product: gymProducts[0],
        quantity: 0.5
      }
    ],
    price: 4500,
    duration: 30
  },
  {
    id: 'gym2',
    name: 'Lean Protein',
    description: '100g protein daily - Ideal for weight management',
    dailyProtein: 100,
    products: [
      {
        product: gymProducts[0],
        quantity: 0.35
      }
    ],
    price: 3200,
    duration: 30
  }
];

// Mock Subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub1',
    userId: 'user1',
    productId: 'ch1',
    product: chickenProducts[0],
    type: 'WEEKLY',
    quantity: 1,
    startDate: '2024-11-01',
    status: 'ACTIVE',
    deliveryDays: [0], // Sunday
    nextDelivery: '2024-12-22'
  }
];
