// MEATHUB - Gym Page (HRX-Style Premium Design)
// Subscription-only page for gym enthusiasts

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { gymApi, GymPlan, CreateGymPlanRequest, ProteinQuantity } from '../../api/gymApi';
import { productApi } from '../../api/productApi';
import { mapMeatItemToProduct } from '../../api/mappers';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  ArrowLeft, 
  Dumbbell, 
  Loader2, 
  Plus, 
  Pause, 
  Play,
  Calendar,
  Clock,
  X,
  TrendingUp,
  Zap,
  Target,
  Flame,
  CheckCircle2,
  Star,
  ShoppingCart,
  Info
} from 'lucide-react';
import { GymAIAssistant } from '../components/ai/GymAIAssistant';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { MeatProduct } from '../../types';

interface GymPageProps {
  onNavigate: (page: string, data?: any) => void;
}

const PROTEIN_QUANTITIES: { value: ProteinQuantity; label: string; grams: number }[] = [
  { value: 'SMALL', label: '250g Daily', grams: 250 },
  { value: 'MEDIUM', label: '500g Daily', grams: 500 },
];

export function GymPage({ onNavigate }: GymPageProps) {
  const { isAuthenticated, currentUser, setShowAuthModal } = useApp();
  const [plans, setPlans] = useState<GymPlan[]>([]);
  const [products, setProducts] = useState<MeatProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MeatProduct | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProductForDescription, setSelectedProductForDescription] = useState<MeatProduct | null>(null);
  
  // Plan creation form state - Default to 250g
  const [quantity, setQuantity] = useState<ProteinQuantity>('SMALL');
  const [deliveryTime, setDeliveryTime] = useState('06:00');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [userGoal, setUserGoal] = useState<'BULKING' | 'CUTTING' | 'MAINTAIN'>('BULKING');

  useEffect(() => {
    if (isAuthenticated) {
      loadPlans();
    }
      loadProducts();
  }, [isAuthenticated]);

  const loadPlans = async () => {
    try {
      setSubLoading(true);
      const data = await gymApi.getMyPlans();
      setPlans(data);
    } catch (error: any) {
      // Silently handle auth errors - user might not be logged in
      if (error?.status === 401 || error?.status === 403) {
        setPlans([]);
      } else {
        console.log('Gym plans not available yet');
        setPlans([]);
      }
    } finally {
      setSubLoading(false);
    }
  };

  // Nutritional info for different meat types (per 100g)
  const getNutritionInfo = (product: MeatProduct): { protein: number; carbs: number; fat: number } => {
    const name = product.name.toLowerCase();
    const category = product.category.toLowerCase();
    
    // Chicken
    if (category === 'chicken' || name.includes('chicken')) {
      if (name.includes('breast')) return { protein: 31, carbs: 0, fat: 3.6 };
      if (name.includes('thigh')) return { protein: 26, carbs: 0, fat: 10 };
      if (name.includes('leg')) return { protein: 27, carbs: 0, fat: 5 };
      return { protein: 27, carbs: 0, fat: 4 };
    }
    
    // Mutton/Lamb
    if (category === 'mutton' || name.includes('mutton') || name.includes('lamb')) {
      if (name.includes('lean') || name.includes('boneless')) return { protein: 25, carbs: 0, fat: 8 };
      return { protein: 20, carbs: 0, fat: 15 };
    }
    
    // Fish
    if (category === 'fish' || name.includes('fish')) {
      if (name.includes('salmon') || name.includes('tuna')) return { protein: 25, carbs: 0, fat: 12 };
      if (name.includes('rohu') || name.includes('pomfret')) return { protein: 20, carbs: 0, fat: 5 };
      return { protein: 22, carbs: 0, fat: 4 };
    }
    
    // Prawns
    if (category === 'prawns' || name.includes('prawn')) {
      return { protein: 24, carbs: 0, fat: 1 };
    }
    
    // Default high protein
    return { protein: 25, carbs: 0, fat: 5 };
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const items = await productApi.getAvailableItems();
      // Filter ONLY high-protein items: Chicken breasts, chicken with bones, thighs, and other high-protein meats
      const highProteinItems = items.filter(item => {
        const name = item.name.toLowerCase();
        const category = item.category.toUpperCase();
        
        // Chicken items only
        if (category === 'CHICKEN') {
          return (
            name.includes('breast') ||
            name.includes('thigh') ||
            name.includes('leg') ||
            name.includes('bone') ||
            name.includes('curry cut') ||
            name === 'chicken'
          );
        }
        
        // Other high-protein meats only (no fatty cuts)
        if (category === 'FISH' || category === 'PRAWNS') {
          return true; // All fish and prawns are high protein
        }
        
        // Mutton only if lean/boneless
        if (category === 'MUTTON') {
          return name.includes('lean') || name.includes('boneless');
        }
        
        return false;
      });
      
      const mapped = highProteinItems.map(item => {
        const product = mapMeatItemToProduct(item);
        // Add nutrition info
        const nutrition = getNutritionInfo(product);
        return {
          ...product,
          nutritionInfo: {
            protein: nutrition.protein,
            carbs: nutrition.carbs,
            fat: nutrition.fat,
            calories: (nutrition.protein * 4) + (nutrition.carbs * 4) + (nutrition.fat * 9)
          }
        };
      });
      
      // Limit to top 8-10 products to avoid clutter
      setProducts(mapped.slice(0, 10));
    } catch (error: any) {
      console.log('Products not available yet');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toast.info('Please login to create a subscription');
      return;
    }

    if (!currentUser?.addresses || currentUser.addresses.length === 0) {
      toast.error('Please add a delivery address first');
      onNavigate('profile');
      return;
    }

    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }
    
    const productToUse = selectedProduct;

    // For gym page, we need a butcher - use first available or show error
    if (!productToUse.butcherId) {
      toast.error('Please select a butcher first from homepage');
      onNavigate('home');
      return;
    }

    try {
      const request: CreateGymPlanRequest = {
        butcherId: productToUse.butcherId,
        meatItemId: parseInt(productToUse.id),
        meatItemName: productToUse.name,
        dailyQuantityKg: quantity,
        deliveryTime,
        deliveryAddress: deliveryAddress || currentUser.addresses[0].line1,
        deliveryPhone: deliveryPhone || currentUser.phone || '',
        notes,
      };

      await gymApi.createPlan(request);
      toast.success('🎉 Subscription created successfully! Daily protein delivery starts tomorrow.');
      setShowCreateDialog(false);
      setShowProductDetail(false);
      loadPlans();
      resetForm();
    } catch (error: any) {
      console.error('Failed to create plan:', error);
      toast.error(error?.message || 'Failed to create subscription');
    }
  };

  const handlePause = async (id: number) => {
    try {
      await gymApi.pausePlan(id);
      toast.success('Subscription paused');
      loadPlans();
    } catch (error) {
      toast.error('Failed to pause subscription');
    }
  };

  const handleResume = async (id: number) => {
    try {
      await gymApi.resumePlan(id);
      toast.success('Subscription resumed');
      loadPlans();
    } catch (error) {
      toast.error('Failed to resume subscription');
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setQuantity('SMALL'); // Default to 250g
    setDeliveryTime('06:00');
    setDeliveryAddress('');
    setDeliveryPhone('');
    setNotes('');
  };

  const getQuantityGrams = (quantity: ProteinQuantity): number => {
    const qty = PROTEIN_QUANTITIES.find(q => q.value === quantity);
    return qty?.grams || 500;
  };

  const handleProductClick = (product: MeatProduct) => {
    // Only show description, don't open subscription dialog
    setSelectedProductForDescription(product);
  };

  // Get detailed description for each product
  const getProductDescription = (product: MeatProduct): {
    description: string;
    weightGain: string;
    weightLoss: string;
    cookingTips: string;
  } => {
    const name = product.name.toLowerCase();
    const category = product.category.toLowerCase();
    
    // Chicken Breast
    if (name.includes('breast')) {
      return {
        description: "Chicken breast is the leanest part of the chicken, packed with high-quality protein and minimal fat. Perfect for muscle building and weight management.",
        weightGain: "For weight gain: Consume 500g daily with complex carbs (rice, sweet potato). Add healthy fats (avocado, olive oil) to increase calories. Best eaten post-workout with carbs for muscle recovery and growth.",
        weightLoss: "For weight loss: Consume 250g daily with vegetables and minimal carbs. High protein keeps you full longer, boosts metabolism. Eat 30-60g protein per meal. Great for cutting phase.",
        cookingTips: "Grill, bake, or steam to preserve protein. Avoid deep frying. Marinate with lemon, herbs, and spices. Cook to 165°F internal temperature. Meal prep in batches for convenience."
      };
    }
    
    // Chicken Thighs
    if (name.includes('thigh')) {
      return {
        description: "Chicken thighs contain more fat than breast but are richer in flavor. Good balance of protein and healthy fats for sustained energy.",
        weightGain: "For weight gain: Excellent choice! Higher calorie content helps with bulking. Consume 500g daily with rice and vegetables. The extra fat provides sustained energy for intense workouts.",
        weightLoss: "For weight loss: Use in moderation (250g). Remove skin to reduce fat. Higher fat content means more calories, so pair with low-carb vegetables. Good for keto diets.",
        cookingTips: "Remove skin for lower fat. Bake or grill with spices. Thighs stay moist when cooked properly. Great for curries and stews. Cook thoroughly to 165°F."
      };
    }
    
    // Chicken with Bones (Curry Cut, Legs)
    if (name.includes('bone') || name.includes('curry') || name.includes('leg')) {
      return {
        description: "Bone-in chicken provides collagen and minerals from bones. Traditional cuts that are flavorful and nutrient-dense.",
        weightGain: "For weight gain: Consume 500g daily. Bones add collagen for joint health during heavy lifting. Cook in curries or stews with vegetables. Rich flavor helps with meal satisfaction.",
        weightLoss: "For weight loss: Use 250g portions. Remove skin before cooking. Bone-in cuts are satisfying and help control portions. Slow-cook for tender, flavorful meals without excess oil.",
        cookingTips: "Slow-cook or pressure cook for tenderness. Remove skin to reduce fat. Great for curries, stews, and soups. Bones add flavor and nutrients. Cook until meat falls off bone."
      };
    }
    
    // Fish
    if (category === 'fish' || name.includes('fish')) {
      if (name.includes('salmon') || name.includes('tuna')) {
        return {
          description: "Fatty fish like salmon and tuna are rich in omega-3 fatty acids and high-quality protein. Excellent for heart health and muscle recovery.",
          weightGain: "For weight gain: Consume 500g daily. High in healthy fats and protein. Omega-3s reduce inflammation from intense training. Great post-workout meal with carbs.",
          weightLoss: "For weight loss: Perfect choice! 250g daily provides lean protein and healthy fats that keep you full. Omega-3s boost metabolism. Low calorie, high nutrition.",
          cookingTips: "Grill or bake to preserve omega-3s. Don't overcook - fish should be flaky. Season with herbs and lemon. Avoid deep frying. Fresh is best for maximum nutrition."
        };
      }
      return {
        description: "Lean fish like rohu and pomfret are excellent sources of protein with minimal fat. Perfect for high-protein, low-calorie meals.",
        weightGain: "For weight gain: Consume 500g daily with rice and vegetables. Add healthy fats (coconut oil, ghee) to increase calories. High protein supports muscle growth.",
        weightLoss: "For weight loss: Ideal choice! 250g daily provides maximum protein with minimal calories. Keeps you full, boosts metabolism. Perfect for cutting phase.",
        cookingTips: "Steam, grill, or shallow fry. Avoid deep frying. Fresh fish cooks quickly. Season with spices and herbs. Great in curries or grilled with vegetables."
      };
    }
    
    // Prawns
    if (category === 'prawns' || name.includes('prawn')) {
      return {
        description: "Prawns are extremely lean with high protein content and minimal fat. One of the best protein sources per calorie.",
        weightGain: "For weight gain: Consume 500g daily with carbs (rice, pasta). Very lean, so add healthy fats (butter, olive oil) to increase calories. High protein supports muscle building.",
        weightLoss: "For weight loss: Perfect! 250g daily gives maximum protein with almost zero fat. Extremely low calorie, high satiety. Excellent for strict cutting diets.",
        cookingTips: "Cook quickly - don't overcook or they become rubbery. Grill, sauté, or steam. Season with garlic, lemon, and herbs. Great in salads, stir-fries, or curries."
      };
    }
    
    // Lean Mutton
    if ((category === 'mutton' || name.includes('mutton')) && (name.includes('lean') || name.includes('boneless'))) {
      return {
        description: "Lean mutton provides high-quality protein with moderate fat. Rich in iron and B-vitamins essential for energy and muscle function.",
        weightGain: "For weight gain: Consume 500g daily. Rich in iron prevents fatigue during bulking. Higher fat content than chicken but provides sustained energy. Great for strength training.",
        weightLoss: "For weight loss: Use 250g portions. Trim visible fat before cooking. Higher calorie than chicken, so pair with vegetables. Good source of iron for energy during cutting.",
        cookingTips: "Trim all visible fat. Slow-cook or pressure cook for tenderness. Marinate with yogurt and spices. Great in curries and stews. Cook thoroughly to break down connective tissue."
      };
    }
    
    // Default Chicken
    if (category === 'chicken') {
      return {
        description: "Chicken is a versatile, high-protein meat perfect for fitness goals. Excellent source of complete protein with all essential amino acids.",
        weightGain: "For weight gain: Consume 500g daily with complex carbohydrates. High protein supports muscle growth. Pair with rice, potatoes, or whole grains for optimal bulking.",
        weightLoss: "For weight loss: Consume 250g daily with vegetables. High protein keeps you full and boosts metabolism. Low in calories, perfect for cutting phase.",
        cookingTips: "Grill, bake, or steam for healthiest preparation. Remove skin to reduce fat. Season with herbs and spices. Meal prep in advance for consistency."
      };
    }
    
    // Default
    return {
      description: "High-quality protein source essential for muscle building and recovery. Perfect for achieving your fitness goals.",
      weightGain: "For weight gain: Consume 500g daily with carbohydrates and healthy fats. High protein supports muscle growth and recovery.",
      weightLoss: "For weight loss: Consume 250g daily with vegetables. High protein keeps you satiated and boosts metabolism.",
      cookingTips: "Cook using healthy methods like grilling, baking, or steaming. Season well and avoid excessive oil for best results."
    };
  };


  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Full Background - Man Lifting Weights (Bright & Visible) */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1920&h=1080&fit=crop&q=90')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(1.1) contrast(1.1)'
        }}
      >
        {/* Lighter overlay to keep dark aesthetic but show man clearly */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Subtle gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
         {/* Header - Transparent Glass - More Visible */}
         <div className="bg-white/20 backdrop-blur-xl border-b-2 border-white/40 shadow-lg">
           <div className="container mx-auto px-4 py-6">
             <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
                 className="text-white hover:text-primary hover:bg-white/20 backdrop-blur-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
                 Back
            </Button>
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-xl border-2 border-white/50 flex items-center justify-center shadow-xl">
                   <Dumbbell className="h-6 w-6 text-white drop-shadow-lg" />
                 </div>
                 <div>
                   <h1 className="text-2xl font-bold text-white drop-shadow-2xl">MEATHUB GYM</h1>
                   <p className="text-xs text-primary font-bold drop-shadow-lg">Premium Protein Subscription</p>
                 </div>
               </div>
             </div>
           </div>
         </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
             {/* Hero Section */}
             <div className="text-center mb-12">
               <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/25 backdrop-blur-xl border-2 border-white/50 mb-6 shadow-xl">
                 <Zap className="h-5 w-5 text-primary animate-pulse" />
                 <span className="text-sm font-bold text-white drop-shadow-2xl">DAILY PROTEIN SUBSCRIPTION</span>
              </div>
               <h2 className="text-6xl font-black text-white mb-4 drop-shadow-2xl">
                 <span className="bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
                   Daily Protein Delivery
                 </span>
               </h2>
               <p className="text-2xl text-white mb-4 font-bold drop-shadow-2xl">
                 Subscribe for 250g or 500g daily protein at your preferred time
               </p>
               <p className="text-lg text-white/90 mb-8 font-medium drop-shadow-lg">
                 Choose from chicken breasts, thighs, or other high-protein meats
               </p>
               <div className="flex items-center justify-center gap-8 text-sm">
                 <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/25 backdrop-blur-xl border-2 border-white/40 shadow-lg">
                   <CheckCircle2 className="h-5 w-5 text-green-400 drop-shadow-lg" />
                   <span className="text-white font-bold drop-shadow-lg">250g or 500g Daily</span>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/25 backdrop-blur-xl border-2 border-white/40 shadow-lg">
                   <CheckCircle2 className="h-5 w-5 text-blue-400 drop-shadow-lg" />
                   <span className="text-white font-bold drop-shadow-lg">Your Preferred Time</span>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/25 backdrop-blur-xl border-2 border-white/40 shadow-lg">
                   <CheckCircle2 className="h-5 w-5 text-purple-400 drop-shadow-lg" />
                   <span className="text-white font-bold drop-shadow-lg">Pause Anytime</span>
                 </div>
            </div>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT PANEL - High Protein Meat Products */}
              <div className="lg:col-span-2 space-y-6">
                 {/* Section Header */}
                 <div className="mb-6">
                   <h3 className="text-2xl font-bold text-white drop-shadow-2xl mb-2">Select Your Protein</h3>
                   <p className="text-sm text-white/80 drop-shadow-md">Choose from high-protein meats for daily delivery</p>
                 </div>

                 {/* Meat Products - Transparent Glass Boxes (iPhone Style) */}
                 <div>
                   {loading ? (
                     <div className="flex items-center justify-center py-20">
                       <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     </div>
                   ) : products.length === 0 ? (
                     <div className="p-12 text-center bg-white/25 backdrop-blur-xl rounded-2xl border-2 border-white/40 shadow-xl">
                       <p className="text-white font-bold drop-shadow-lg">No products available</p>
                     </div>
                   ) : (
                     <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 md:gap-4">
                           {products.map((product) => (
                             <div
                               key={product.id}
                               onClick={() => handleProductClick(product)}
                               className="cursor-pointer group"
                             >
                               {/* Transparent Glass Box - More Visible */}
                               <div className="bg-white/25 backdrop-blur-xl rounded-2xl p-3 border-2 border-white/40 shadow-xl hover:bg-white/35 hover:border-white/60 transition-all group-hover:scale-105 group-hover:shadow-2xl">
                                 <div className="relative w-full aspect-square rounded-full overflow-hidden bg-white/30 border-2 border-white/50 group-hover:border-primary transition-all shadow-lg group-hover:shadow-xl">
                                   <img
                                     src={product.imageUrl || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop'}
                                     alt={product.name}
                                     className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                   />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                     <div className="absolute bottom-2 left-0 right-0 text-center text-white">
                                       <p className="text-xs font-semibold px-2 truncate">{product.name}</p>
                                       <p className="text-xs">₹{product.price}/{product.unit}</p>
                                     </div>
                                   </div>
                                   <Badge className="absolute top-1 right-1 bg-green-500 text-white border-0 text-[10px] px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                     <Flame className="h-2.5 w-2.5 mr-0.5" />
                                     Protein
                                   </Badge>
                                 </div>
                                 <p className="text-xs text-center mt-2 font-bold truncate text-white drop-shadow-lg">{product.name}</p>
                                 <p className="text-xs text-center text-primary font-bold drop-shadow-lg">₹{product.price}/{product.unit}</p>
                               </div>
                             </div>
                           ))}
                     </div>
                   )}
                 </div>

                 {/* Product Description Section */}
                 {selectedProductForDescription && (
                   <div className="mt-8 bg-white/25 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/40 shadow-xl">
                     <div className="flex items-start gap-4 mb-4">
                       <img
                         src={selectedProductForDescription.imageUrl || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=150&h=150&fit=crop'}
                         alt={selectedProductForDescription.name}
                         className="w-24 h-24 rounded-lg object-cover border-2 border-white/50"
                       />
                       <div className="flex-1">
                         <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-2">{selectedProductForDescription.name}</h3>
                         {selectedProductForDescription.nutritionInfo && (
                           <div className="flex items-center gap-4 text-sm">
                             <div className="flex items-center gap-1">
                               <span className="text-green-400 font-bold">{selectedProductForDescription.nutritionInfo.protein}g</span>
                               <span className="text-white/80">Protein</span>
                             </div>
                             <div className="flex items-center gap-1">
                               <span className="text-blue-400 font-bold">{selectedProductForDescription.nutritionInfo.carbs}g</span>
                               <span className="text-white/80">Carbs</span>
                             </div>
                             <div className="flex items-center gap-1">
                               <span className="text-orange-400 font-bold">{selectedProductForDescription.nutritionInfo.fat}g</span>
                               <span className="text-white/80">Fat</span>
                             </div>
                             <span className="text-white/60">per 100g</span>
                           </div>
                         )}
                       </div>
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => setSelectedProductForDescription(null)}
                         className="text-white hover:bg-white/20"
                       >
                         <X className="h-5 w-5" />
                       </Button>
                     </div>

                     {(() => {
                       const desc = getProductDescription(selectedProductForDescription);
                       return (
                         <div className="space-y-6">
                           {/* General Description */}
              <div>
                             <h4 className="text-lg font-bold text-white mb-2 drop-shadow-md">About This Product</h4>
                             <p className="text-white/90 leading-relaxed drop-shadow-md">{desc.description}</p>
                           </div>

                           {/* Weight Gain */}
                           <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4">
                             <div className="flex items-center gap-2 mb-2">
                               <TrendingUp className="h-5 w-5 text-green-400" />
                               <h4 className="text-lg font-bold text-white drop-shadow-md">For Weight Gain & Muscle Building</h4>
                             </div>
                             <p className="text-white/90 leading-relaxed drop-shadow-md">{desc.weightGain}</p>
                           </div>

                           {/* Weight Loss */}
                           <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4">
                             <div className="flex items-center gap-2 mb-2">
                               <Target className="h-5 w-5 text-blue-400" />
                               <h4 className="text-lg font-bold text-white drop-shadow-md">For Weight Loss & Cutting</h4>
                             </div>
                             <p className="text-white/90 leading-relaxed drop-shadow-md">{desc.weightLoss}</p>
                           </div>

                           {/* Cooking Tips */}
                           <div className="bg-orange-500/20 border border-orange-500/40 rounded-lg p-4">
                             <div className="flex items-center gap-2 mb-2">
                               <Flame className="h-5 w-5 text-orange-400" />
                               <h4 className="text-lg font-bold text-white drop-shadow-md">Cooking Tips</h4>
                             </div>
                             <p className="text-white/90 leading-relaxed drop-shadow-md">{desc.cookingTips}</p>
                           </div>

                           {/* Subscribe Button */}
                           <div className="pt-4 border-t border-white/20">
                             <Button
                               onClick={() => {
                                 setSelectedProduct(selectedProductForDescription);
                                 // Pre-fill form with user data
                                 if (currentUser?.addresses?.[0]) {
                                   setDeliveryAddress(currentUser.addresses[0].line1);
                                 }
                                 if (currentUser?.phone) {
                                   setDeliveryPhone(currentUser.phone);
                                 }
                                 setShowProductDetail(true);
                               }}
                               className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-6 text-lg"
                               size="lg"
                             >
                               <CheckCircle2 className="h-5 w-5 mr-2" />
                               Subscribe for Daily Delivery
                             </Button>
              </div>
            </div>
                       );
                     })()}
                   </div>
                 )}

                 {/* Empty State - Click a product to see description */}
                 {!selectedProductForDescription && products.length > 0 && (
                   <div className="mt-8 bg-white/15 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/30 shadow-lg text-center">
                     <Info className="h-12 w-12 mx-auto mb-4 text-white/60" />
                     <p className="text-white/80 text-lg font-semibold drop-shadow-md mb-2">Select a product above</p>
                     <p className="text-white/60 text-sm drop-shadow-md">Click on any meat item to see detailed description, weight gain/loss tips, and cooking instructions</p>
                   </div>
                 )}

              </div>

               {/* RIGHT PANEL - Active Subscriptions */}
               <div className="space-y-6">
                 <Card className="bg-white/25 backdrop-blur-xl border-2 border-white/40 p-6 shadow-xl">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-xl border-2 border-white/50 flex items-center justify-center shadow-lg">
                       <Target className="h-5 w-5 text-white drop-shadow-lg" />
                     </div>
                     <div>
                       <h3 className="font-bold text-white text-lg drop-shadow-2xl">My Subscriptions</h3>
                       <p className="text-xs text-white/90 font-semibold drop-shadow-lg">{plans.length} active plan{plans.length !== 1 ? 's' : ''}</p>
                     </div>
                   </div>

              {!isAuthenticated ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400 mb-4">Login to view subscriptions</p>
                      <Button onClick={() => setShowAuthModal(true)} className="w-full">
                        Login
                      </Button>
                    </div>
              ) : subLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : plans.length === 0 ? (
                     <div className="text-center py-8">
                       <Dumbbell className="h-12 w-12 mx-auto mb-4 text-white/40" />
                       <p className="text-white/80 mb-2 drop-shadow-md">No active subscriptions</p>
                       <p className="text-xs text-white/60 mb-4 drop-shadow-md">
                         Subscribe to get daily protein delivery
                       </p>
                     </div>
              ) : (
                     <div className="space-y-3 max-h-96 overflow-y-auto">
                  {plans.map((plan) => (
                         <Card key={plan.id} className="bg-white/25 backdrop-blur-xl border-2 border-white/40 p-4 shadow-lg">
                           <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                               <h4 className="font-bold text-white drop-shadow-lg">{plan.meatItemName}</h4>
                               <p className="text-xs text-white/90 font-semibold drop-shadow-md">
                                {getQuantityGrams(plan.dailyQuantityKg)}g daily • {plan.deliveryTime}
                              </p>
                            </div>
                             <Badge className={plan.active ? 'bg-green-500 text-white shadow-lg' : 'bg-white/30 text-white border-2 border-white/50'}>
                                {plan.active ? 'Active' : 'Paused'}
                              </Badge>
                            </div>
                           {plan.nextDeliveryDate && (
                             <div className="flex items-center gap-2 text-xs text-white/90 mb-2 font-semibold drop-shadow-md">
                               <Calendar className="h-3 w-3" />
                               <span>Next: {new Date(plan.nextDeliveryDate).toLocaleDateString()}</span>
                            </div>
                          )}
                           <div className="flex gap-2 mt-3">
                          {plan.active ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePause(plan.id)}
                                 className="flex-1 border-white/50 text-white hover:bg-white/30 backdrop-blur-sm font-semibold"
                            >
                                 <Pause className="h-3 w-3 mr-1" />
                              Pause
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleResume(plan.id)}
                                 className="flex-1 font-semibold"
                            >
                                 <Play className="h-3 w-3 mr-1" />
                              Resume
                            </Button>
                          )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
                 </Card>

                 {/* Info Card - Transparent Glass - More Visible */}
                 <Card className="bg-white/25 backdrop-blur-xl border-2 border-white/40 p-6 shadow-xl">
                   <div className="flex items-start gap-3">
                     <Info className="h-5 w-5 text-primary mt-0.5 drop-shadow-lg" />
                     <div className="space-y-2 text-sm text-white/90">
                       <p className="font-bold text-white drop-shadow-lg">Why Subscribe?</p>
                       <ul className="space-y-1 text-xs font-semibold drop-shadow-md">
                         <li>• Fresh protein delivered daily</li>
                         <li>• Early morning delivery (6 AM)</li>
                         <li>• Pause anytime for vacations</li>
                         <li>• Consistent gains, no hassle</li>
                       </ul>
                     </div>
                </div>
                </Card>
                            </div>
                          </div>
                  </div>
        </div>
      </div>

      {/* Product Detail Dialog */}
      <AlertDialog open={showProductDetail} onOpenChange={setShowProductDetail}>
        <AlertDialogContent className="max-w-md bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Subscribe to {selectedProduct?.name}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Set up your daily protein subscription
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            {selectedProduct && (
              <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
                <img
                  src={selectedProduct.imageUrl || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop'}
                  alt={selectedProduct.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              <div>
                  <h4 className="font-semibold text-white">{selectedProduct.name}</h4>
                  <p className="text-sm text-slate-400">{selectedProduct.category}</p>
                  <p className="text-lg font-bold text-primary mt-1">₹{selectedProduct.price}/{selectedProduct.unit}</p>
                </div>
              </div>
            )}
            <div>
               <label className="text-sm font-medium mb-2 block text-white">Daily Quantity (250g - 500g limit)</label>
              <Select value={quantity} onValueChange={(value: any) => setQuantity(value)}>
                 <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                 <SelectContent className="bg-slate-800 border-slate-700">
                  {PROTEIN_QUANTITIES.map((qty) => (
                     <SelectItem key={qty.value} value={qty.value} className="text-white">
                       {qty.label} - {qty.grams}g daily
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <p className="text-xs text-slate-400 mt-1">
                 Maximum 500g per day. Choose your preferred daily amount.
               </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-white">Delivery Time</label>
              <Input
                type="time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <p className="text-xs text-slate-400 mt-1">
                Default: 6:00 AM (Early morning delivery)
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-white">Delivery Address</label>
              <Input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter delivery address"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-white">Phone</label>
              <Input
                value={deliveryPhone}
                onChange={(e) => setDeliveryPhone(e.target.value)}
                placeholder="Enter phone number"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-white">Notes (Optional)</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..."
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCreatePlan} 
              disabled={!selectedProduct}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Subscribe Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Gym AI Assistant - Specialized for Gym & Fitness */}
      <GymAIAssistant 
        userGoal={userGoal}
        currentPlan={plans.length > 0 ? {
          quantity: getQuantityGrams(plans[0].dailyQuantityKg),
          deliveryTime: plans[0].deliveryTime,
          productName: plans[0].meatItemName
        } : undefined}
      />
    </div>
  );
}
