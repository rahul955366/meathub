// 🐾 MEATHUB - SUPER FUN PET FOOD PAGE 🐾
// Made with love for kids and pet parents! 🎨

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { petApi, PetProduct, PetSubscription } from '../../api/petApi';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  ArrowLeft,
  Dog,
  Cat,
  Bird,
  Loader2,
  Plus,
  Pause,
  Play,
  Package,
  Calendar,
  Heart,
  Sparkles,
  Star,
  Bone,
  Fish,
  PawPrint,
  MessageCircle
} from 'lucide-react';
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
import { PetAIAssistant } from '../components/ai/PetAIAssistant';

interface PetPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function PetPage({ onNavigate }: PetPageProps) {
  const { isAuthenticated, currentUser, setShowAuthModal } = useApp();
  const [products, setProducts] = useState<PetProduct[]>([]);
  const [subscriptions, setSubscriptions] = useState<PetSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PetProduct | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Subscription form state
  const [petType, setPetType] = useState<'DOG' | 'CAT' | 'BIRD' | 'OTHER'>('DOG');
  const [quantity, setQuantity] = useState('1');
  const [scheduleType, setScheduleType] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    loadProducts();
    if (isAuthenticated) {
      loadSubscriptions();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await petApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load pet products:', error);
      toast.error('Oops! Could not load yummy pet food 😿');
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptions = async () => {
    try {
      setSubLoading(true);
      const data = await petApi.getMySubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setSubLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      toast.info('🐾 Please login to order yummy food for your pet!');
      return;
    }

    if (!currentUser?.addresses || currentUser.addresses.length === 0) {
      toast.error('Please add a delivery address first');
      onNavigate('profile');
      return;
    }

    try {
      await petApi.subscribe({
        petType,
        productId: selectedProduct!.id,
        quantityKg: parseFloat(quantity),
        scheduleType,
        deliveryAddress: deliveryAddress || currentUser.addresses[0].line1,
      });

      toast.success('🎉 Woohoo! Your pet will be so happy!');
      setShowSubscribeDialog(false);
      loadSubscriptions();
      setQuantity('1');
      setScheduleType('WEEKLY');
      setDeliveryAddress('');
    } catch (error: any) {
      console.error('Failed to subscribe:', error);
      toast.error(error?.message || 'Failed to create subscription');
    }
  };

  const handlePause = async (id: number) => {
    try {
      await petApi.pauseSubscription(id);
      toast.success('Subscription paused');
      loadSubscriptions();
    } catch (error) {
      toast.error('Failed to pause subscription');
    }
  };

  const handleResume = async (id: number) => {
    try {
      await petApi.resumeSubscription(id);
      toast.success('Subscription resumed');
      loadSubscriptions();
    } catch (error) {
      toast.error('Failed to resume subscription');
    }
  };

  const getPetIcon = (type: string) => {
    switch (type) {
      case 'DOG': return <Dog className="h-6 w-6" />;
      case 'CAT': return <Cat className="h-6 w-6" />;
      case 'BIRD': return <Bird className="h-6 w-6" />;
      default: return <Package className="h-6 w-6" />;
    }
  };

  const getPetEmoji = (type: string) => {
    switch (type) {
      case 'DOG': return '🐶';
      case 'CAT': return '🐱';
      case 'BIRD': return '🐦';
      default: return '🐾';
    }
  };

  const getProductTypeBadge = (type: string) => {
    const styles: Record<string, { bg: string, emoji: string }> = {
      RAW: { bg: 'bg-gradient-to-r from-green-400 to-green-600 text-white', emoji: '🥩' },
      COOKED: { bg: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white', emoji: '🍖' },
      BONES: { bg: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white', emoji: '🦴' },
      ORGANS: { bg: 'bg-gradient-to-r from-red-400 to-red-600 text-white', emoji: '❤️' },
      MIX: { bg: 'bg-gradient-to-r from-purple-400 to-purple-600 text-white', emoji: '🎨' },
    };
    return styles[type] || { bg: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white', emoji: '🍽️' };
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Fun animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating paw prints */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            <PawPrint className="h-12 w-12 text-purple-400" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* SUPER FUN Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
              className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back Home
            </Button>

            {/* Mega Fun Title */}
            <div className="text-center relative">
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 opacity-30"></div>

              <div className="relative">
                <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                  🐾 PET FOOD PARADISE! 🐾
                </h1>

                <p className="text-3xl font-bold text-purple-600 mb-4">
                  Yummy, Healthy Food for Your Best Friends! 🍖💕
                </p>

                <div className="flex items-center justify-center gap-4 text-2xl mb-6">
                  <span className="animate-bounce">🐶</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🐱</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🐦</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🐹</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🐰</span>
                </div>

                <div className="flex gap-3 justify-center flex-wrap">
                  <Badge className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 text-lg">
                    <Heart className="h-4 w-4 mr-2" />
                    Fresh Daily
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 text-lg">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Super Nutritious
                  </Badge>
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-lg">
                    <Star className="h-4 w-4 mr-2" />
                    Pets Love It!
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
              <TabsTrigger value="products" className="text-lg font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                🍖 Yummy Food
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="text-lg font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                📦 My Orders ({subscriptions.length})
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6 mt-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
                    <Sparkles className="h-8 w-8 absolute top-0 right-0 text-pink-500 animate-ping" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600 animate-pulse">
                    Loading yummy food... 🍖✨
                  </p>
                </div>
              ) : products.length === 0 ? (
                <Card className="p-12 text-center bg-white/70 backdrop-blur-sm border-4 border-purple-200">
                  <div className="text-6xl mb-4">😿</div>
                  <p className="text-2xl font-bold text-purple-600 mb-2">Oh no! No food yet!</p>
                  <p className="text-lg text-muted-foreground">
                    Check back soon for yummy treats! 🍖
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => {
                    const typeBadge = getProductTypeBadge(product.type);
                    const isHovered = hoveredCard === product.id;

                    return (
                      <Card
                        key={product.id}
                        className={`overflow-hidden border-4 border-purple-200 bg-white/90 backdrop-blur-sm transition-all duration-300 cursor-pointer
                          ${isHovered ? 'scale-105 shadow-2xl border-purple-400 rotate-1' : 'hover:scale-102'}
                        `}
                        onMouseEnter={() => setHoveredCard(product.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
                          <img
                            src={product.imageUrl || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop'}
                            alt={product.name}
                            className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}
                          />
                          <Badge className={`absolute top-4 right-4 ${typeBadge.bg} text-lg px-3 py-1.5 font-bold shadow-lg`}>
                            {typeBadge.emoji} {product.type}
                          </Badge>

                          {/* Fun starburst */}
                          {isHovered && (
                            <div className="absolute top-4 left-4 animate-spin-slow">
                              <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                            </div>
                          )}
                        </div>

                        <div className="p-6 space-y-4 bg-gradient-to-b from-white to-purple-50">
                          <div>
                            <h3 className="font-black text-2xl text-purple-700 mb-2">
                              {product.name}
                            </h3>
                            <p className="text-lg text-muted-foreground">
                              {product.description || 'Super yummy pet food! 😋'}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                ₹{Number(product.pricePerKg).toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground font-semibold">per kg</p>
                            </div>
                            <Badge
                              variant={product.isAvailable && (product.availableStockKg || 0) > 0 ? 'default' : 'destructive'}
                              className="text-lg px-4 py-2"
                            >
                              {product.isAvailable && (product.availableStockKg || 0) > 0 ? '✅ Ready!' : '❌ Sold Out'}
                            </Badge>
                          </div>

                          <Button
                            className={`w-full py-6 text-xl font-bold transition-all ${!product.isAvailable
                              ? 'bg-gray-400'
                              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                              }`}
                            onClick={() => {
                              if (!isAuthenticated) {
                                setShowAuthModal(true);
                                return;
                              }
                              setSelectedProduct(product);
                              setDeliveryAddress(currentUser?.addresses[0]?.line1 || '');
                              setShowSubscribeDialog(true);
                            }}
                            disabled={!product.isAvailable}
                          >
                            <Plus className="h-6 w-6 mr-2" />
                            {!product.isAvailable ? 'Out of Stock' : 'Get This Yummy Food! 🎉'}
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Subscriptions Tab */}
            <TabsContent value="subscriptions" className="space-y-4 mt-8">
              {!isAuthenticated ? (
                <Card className="p-16 text-center bg-white/80 backdrop-blur-sm border-4 border-purple-200">
                  <div className="text-7xl mb-6">🔐</div>
                  <p className="text-2xl font-bold text-purple-600 mb-6">Login to see your orders!</p>
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xl px-8 py-6 font-bold"
                  >
                    Login Now
                  </Button>
                </Card>
              ) : subLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
                  <p className="text-2xl font-bold text-purple-600">Loading your orders...</p>
                </div>
              ) : subscriptions.length === 0 ? (
                <Card className="p-16 text-center bg-white/80 backdrop-blur-sm border-4 border-purple-200">
                  <div className="text-7xl mb-6">📦</div>
                  <p className="text-3xl font-bold text-purple-600 mb-4">No orders yet!</p>
                  <p className="text-xl text-muted-foreground mb-8">
                    Order yummy food for your pet! 🐾
                  </p>
                  <Button
                    onClick={() => {
                      const tabs = document.querySelector('[value="products"]') as HTMLElement;
                      tabs?.click();
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-xl px-8 py-6 font-bold"
                  >
                    See Yummy Food 🍖
                  </Button>
                </Card>
              ) : (
                <div className="space-y-6">
                  {subscriptions.map((sub) => (
                    <Card key={sub.id} className="p-8 bg-white/90 backdrop-blur-sm border-4 border-purple-200 hover:border-purple-400 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-5xl">
                              {getPetEmoji(sub.petType)}
                            </div>
                            <div>
                              <h3 className="font-black text-2xl text-purple-700">{sub.productName || 'Pet Food'}</h3>
                              <p className="text-lg text-muted-foreground font-semibold">
                                For {sub.petType} • {sub.quantityKg} kg per delivery
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base">
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <p className="text-purple-600 font-bold mb-1">📅 Schedule</p>
                              <p className="font-black text-lg">{sub.scheduleType}</p>
                            </div>
                            {sub.nextDeliveryDate && (
                              <div className="bg-pink-50 p-3 rounded-lg">
                                <p className="text-pink-600 font-bold mb-1">🚚 Next Delivery</p>
                                <p className="font-black text-lg">
                                  {new Date(sub.nextDeliveryDate).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-blue-600 font-bold mb-1">Status</p>
                              <Badge
                                variant={sub.active ? 'default' : 'secondary'}
                                className="text-base px-3 py-1"
                              >
                                {sub.active ? '✅ Active' : '⏸️ Paused'}
                              </Badge>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-green-600 font-bold mb-1">📍 Address</p>
                              <p className="font-semibold text-sm line-clamp-2">{sub.deliveryAddress}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 ml-6">
                          {sub.active ? (
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={() => handlePause(sub.id)}
                              className="border-2 border-purple-300 hover:bg-purple-50"
                            >
                              <Pause className="h-5 w-5 mr-2" />
                              Pause
                            </Button>
                          ) : (
                            <Button
                              size="lg"
                              onClick={() => handleResume(sub.id)}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            >
                              <Play className="h-5 w-5 mr-2" />
                              Resume
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Subscribe Dialog - FUN VERSION */}
      <AlertDialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
        <AlertDialogContent className="max-w-md bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-300">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-black text-purple-700">
              🎉 Order {selectedProduct?.name}!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-purple-600">
              Your pet will love this! 🐾💕
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-5 py-4">
            <div>
              <label className="text-lg font-bold mb-3 block text-purple-700">🐾 Pet Type</label>
              <Select value={petType} onValueChange={(value: any) => setPetType(value)}>
                <SelectTrigger className="border-2 border-purple-300 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOG" className="text-lg">🐶 Dog</SelectItem>
                  <SelectItem value="CAT" className="text-lg">🐱 Cat</SelectItem>
                  <SelectItem value="BIRD" className="text-lg">🐦 Bird</SelectItem>
                  <SelectItem value="OTHER" className="text-lg">🐾 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-lg font-bold mb-3 block text-purple-700">🍖 How Much? (kg)</label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border-2 border-purple-300 text-lg"
              />
            </div>

            <div>
              <label className="text-lg font-bold mb-3 block text-purple-700">📅 How Often?</label>
              <Select value={scheduleType} onValueChange={(value: any) => setScheduleType(value)}>
                <SelectTrigger className="border-2 border-purple-300 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY" className="text-lg">🌞 Every Day</SelectItem>
                  <SelectItem value="WEEKLY" className="text-lg">📅 Every Week</SelectItem>
                  <SelectItem value="MONTHLY" className="text-lg">🗓️ Every Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-lg font-bold mb-3 block text-purple-700">📍 Where to Deliver?</label>
              <Input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Your address"
                className="border-2 border-purple-300 text-lg"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="text-lg border-2 border-purple-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubscribe}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg font-bold"
            >
              🎉 Order Now!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pet AI Assistant - SUPER FUN! */}
      <PetAIAssistant />
    </div>
  );
}
