// MEATHUB - Butcher Dashboard

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { orderApi, OrderResponse } from '../../api/orderApi';
import { mediaApi, MediaUploadRequest } from '../../api/mediaApi';
import { mapOrderResponse } from '../../api/mappers';
import { toast } from 'sonner';

interface ButcherDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Stats {
  todayOrders: number;
  weeklyOrders: number;
  monthlyOrders: number;
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
}

export function ButcherDashboard({ onNavigate }: ButcherDashboardProps) {
  const { currentUser, logout } = useApp();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    todayOrders: 0,
    weeklyOrders: 0,
    monthlyOrders: 0,
    todayRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  // Load orders and calculate stats
  useEffect(() => {
    if (currentUser && currentUser.role === 'BUTCHER' && currentUser.approvalStatus === 'APPROVED') {
      loadOrders();
    }
  }, [currentUser]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await orderApi.getButcherOrders();
      setOrders(fetchedOrders);
      calculateStats(fetchedOrders);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orderList: OrderResponse[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todayOrders = orderList.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= today && o.status !== 'CANCELLED';
    });

    const weeklyOrders = orderList.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= weekAgo && o.status !== 'CANCELLED';
    });

    const monthlyOrders = orderList.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= monthAgo && o.status !== 'CANCELLED';
    });

    const calculateRevenue = (orderList: OrderResponse[]) => {
      return orderList.reduce((sum, o) => sum + o.totalAmount, 0);
    };

    setStats({
      todayOrders: todayOrders.length,
      weeklyOrders: weeklyOrders.length,
      monthlyOrders: monthlyOrders.length,
      todayRevenue: calculateRevenue(todayOrders),
      weeklyRevenue: calculateRevenue(weeklyOrders),
      monthlyRevenue: calculateRevenue(monthlyOrders),
    });
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      await orderApi.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      await loadOrders(); // Reload orders
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleUploadVideo = async () => {
    if (!selectedOrder || !videoUrl.trim()) {
      toast.error('Please enter a valid video URL');
      return;
    }

    // Validate URL format
    try {
      new URL(videoUrl);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    try {
      setUploadingVideo(true);
      const request: MediaUploadRequest = {
        relatedType: 'ORDER',
        relatedId: selectedOrder.id,
        mediaType: 'VIDEO',
        mediaUrl: videoUrl.trim(),
        description: `Cutting/packing video for order ${selectedOrder.orderNumber}`,
      };
      await mediaApi.uploadMedia(request);
      toast.success('Video uploaded successfully!');
      setVideoUrl('');
      setSelectedOrder(null);
    } catch (error: any) {
      console.error('Failed to upload video:', error);
      toast.error(error.message || 'Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 'bg-orange-500';
      case 'CUTTING':
        return 'bg-blue-500';
      case 'PACKED':
        return 'bg-purple-500';
      case 'OUT_FOR_DELIVERY':
        return 'bg-yellow-500';
      case 'DELIVERED':
        return 'bg-green-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    switch (currentStatus) {
      case 'PENDING':
      case 'CONFIRMED':
        return 'CUTTING';
      case 'CUTTING':
        return 'PACKED';
      case 'PACKED':
        return 'OUT_FOR_DELIVERY';
      default:
        return null;
    }
  };

  if (!currentUser || currentUser.role !== 'BUTCHER') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Access denied</p>
          <Button onClick={() => onNavigate('home')}>Go to Home</Button>
        </Card>
      </div>
    );
  }

  // Check if butcher is approved
  if (currentUser.approvalStatus === 'PENDING') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Approval Pending</h2>
          <p className="text-muted-foreground mb-6">
            Your butcher account is pending admin approval. You'll receive an email once approved.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              logout();
              onNavigate('home');
            }}>
              Logout
            </Button>
            <Button onClick={() => toast.info('Admin will review your application within 24 hours')}>
              Contact Support
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const activeOrders = orders.filter(o => 
    o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
  );
  const completedOrders = orders.filter(o => 
    o.status === 'DELIVERED' || o.status === 'CANCELLED'
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2">Butcher Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {currentUser.name}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Today's Orders</p>
                <Package className="h-5 w-5 text-primary" />
              </div>
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <p className="text-3xl font-semibold">{stats.todayOrders}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {stats.todayOrders > 0 ? `₹${stats.todayRevenue.toLocaleString()} revenue` : 'No orders yet'}
                  </p>
                </>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Weekly Orders</p>
                <DollarSign className="h-5 w-5 text-secondary" />
              </div>
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <p className="text-3xl font-semibold">{stats.weeklyOrders}</p>
                  <p className="text-sm text-green-600 mt-1">
                    ₹{stats.weeklyRevenue.toLocaleString()} revenue
                  </p>
                </>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Monthly Orders</p>
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <p className="text-3xl font-semibold">{stats.monthlyOrders}</p>
                  <p className="text-sm text-green-600 mt-1">
                    ₹{stats.monthlyRevenue.toLocaleString()} revenue
                  </p>
                </>
              )}
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">
                Active Orders ({activeOrders.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            {/* Active Orders */}
            <TabsContent value="active" className="space-y-4">
              {loading ? (
                <Card className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading orders...</p>
                </Card>
              ) : activeOrders.length === 0 ? (
                <Card className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active orders at the moment</p>
                </Card>
              ) : (
                activeOrders.map((order) => {
                  const nextStatus = getNextStatus(order.status);
                  return (
                    <Card key={order.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Order #{order.orderNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            Placed {new Date(order.createdAt).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Delivery: {order.deliveryAddress}
                          </p>
                        </div>
                        <Badge variant="default" className={getStatusBadgeColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">{item.meatItemName}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} kg • ₹{item.price}/kg
                              </p>
                            </div>
                            <p className="font-semibold">₹{item.subtotal}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-lg font-semibold">Total: ₹{order.totalAmount}</p>
                        <div className="flex gap-2">
                          {nextStatus && (
                            <Button
                              onClick={() => handleUpdateStatus(order.id, nextStatus)}
                              disabled={updatingStatus === order.id}
                              className="flex-1"
                            >
                              {updatingStatus === order.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="mr-2 h-4 w-4" />
                              )}
                              Mark as {nextStatus}
                            </Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Video className="mr-2 h-4 w-4" />
                                Upload Video
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Upload Video for Order #{order.orderNumber}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium mb-2 block">
                                    Video URL
                                  </label>
                                  <Input
                                    placeholder="https://example.com/video.mp4"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                  />
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Paste the URL of your uploaded video (YouTube, Vimeo, or direct link)
                                  </p>
                                </div>
                                <Button
                                  onClick={handleUploadVideo}
                                  disabled={uploadingVideo || !videoUrl.trim()}
                                  className="w-full"
                                >
                                  {uploadingVideo ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Uploading...
                                    </>
                                  ) : (
                                    'Upload Video'
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            {/* Completed Orders */}
            <TabsContent value="completed">
              {loading ? (
                <Card className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading orders...</p>
                </Card>
              ) : completedOrders.length === 0 ? (
                <Card className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No completed orders yet</h3>
                  <p className="text-muted-foreground">
                    Completed orders will appear here
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {completedOrders.map((order) => (
                    <Card key={order.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Order #{order.orderNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.status === 'DELIVERED' 
                              ? `Delivered on ${order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : 'N/A'}`
                              : `Cancelled on ${order.cancelledAt ? new Date(order.cancelledAt).toLocaleString() : 'N/A'}`
                            }
                          </p>
                        </div>
                        <Badge variant="default" className={getStatusBadgeColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-sm">
                              {item.meatItemName} - {item.quantity} kg
                            </p>
                          ))}
                        </div>
                        <p className="text-lg font-semibold">₹{order.totalAmount}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Videos */}
            <TabsContent value="videos">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Video Management</h3>
                <p className="text-muted-foreground mb-4">
                  Upload cutting and packing videos for transparency. Videos are linked to specific orders.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  To upload a video, go to an active order and click "Upload Video". You'll need to provide a video URL (YouTube, Vimeo, or direct link).
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">How it works:</p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Upload your video to a hosting service (YouTube, Vimeo, etc.)</li>
                    <li>Copy the video URL</li>
                    <li>Go to an active order and click "Upload Video"</li>
                    <li>Paste the URL and submit</li>
                  </ol>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
