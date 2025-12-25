// MEATHUB - Order Detail Page with Real-time Updates

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useWebSocket } from '../../hooks/useWebSocket';
import { orderApi } from '../../api/orderApi';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock,
  MapPin,
  Phone,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { OrderResponse as Order } from '../../api/orderApi';

interface OrderDetailPageProps {
  onNavigate: (page: string, data?: any) => void;
  orderId: number;
}

export function OrderDetailPage({ onNavigate, orderId }: OrderDetailPageProps) {
  const { currentUser } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // WebSocket for real-time updates
  const { isConnected, lastMessage } = useWebSocket({
    orderId,
    enabled: !!orderId,
    onMessage: (data) => {
      setOrder(data);
      toast.success('Order status updated!', { duration: 2000 });
    },
    onError: () => {
      console.warn('WebSocket disconnected, falling back to polling');
    },
  });

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  useEffect(() => {
    if (lastMessage) {
      setOrder(lastMessage);
    }
  }, [lastMessage]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getOrderById(orderId);
      setOrder(data);
    } catch (error: any) {
      console.error('Failed to load order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDING: { variant: 'secondary' as const, label: 'Pending' },
      CONFIRMED: { variant: 'default' as const, label: 'Confirmed' },
      CUTTING: { variant: 'default' as const, label: 'Cutting' },
      PACKED: { variant: 'default' as const, label: 'Packed' },
      OUT_FOR_DELIVERY: { variant: 'default' as const, label: 'Out for Delivery' },
      DELIVERED: { variant: 'default' as const, label: 'Delivered' },
      CANCELLED: { variant: 'destructive' as const, label: 'Cancelled' },
    };
    return variants[status] || { variant: 'secondary' as const, label: status };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'OUT_FOR_DELIVERY':
        return <Truck className="h-5 w-5" />;
      case 'CANCELLED':
        return <Clock className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Order not found</p>
            <Button onClick={() => onNavigate('orders')} className="mt-4">
              Back to Orders
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(order.status);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => onNavigate('orders')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            {isConnected && (
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Updates
              </Badge>
            )}
          </div>

          {/* Order Status Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold mb-2">Order #{order.orderNumber}</h1>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={statusBadge.variant} className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                {statusBadge.label}
              </Badge>
            </div>

            {/* Order Items */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.meatItemName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-semibold">₹{item.subtotal}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-4 flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-semibold">₹{order.totalAmount}</span>
              </div>
            </div>
          </Card>

          {/* Delivery Information */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Delivery Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                </div>
              </div>
              {order.deliveryPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{order.deliveryPhone}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Tracking Timeline */}
          {order.status !== 'CANCELLED' && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Order Timeline</h3>
              <div className="space-y-4">
                {[
                  { status: 'PENDING', label: 'Order Placed', date: order.createdAt },
                  { status: 'CONFIRMED', label: 'Order Confirmed', date: order.confirmedAt },
                  { status: 'CUTTING', label: 'Cutting in Progress', date: null },
                  { status: 'PACKED', label: 'Packed', date: null },
                  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', date: null },
                  { status: 'DELIVERED', label: 'Delivered', date: order.deliveredAt },
                ].map((step, index) => {
                  const isCompleted = ['PENDING', 'CONFIRMED', 'CUTTING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED']
                    .indexOf(order.status) >= index;
                  const isCurrent = step.status === order.status;

                  return (
                    <div key={step.status} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isCurrent ? 'text-primary' : ''}`}>
                          {step.label}
                        </p>
                        {step.date && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(step.date).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

