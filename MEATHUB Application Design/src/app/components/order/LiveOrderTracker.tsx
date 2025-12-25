// MEATHUB - Live Order Status Tracker (Zepto/Blinkit style)
// Enhanced with AI Order Narration 🥇

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  Scissors, 
  Phone,
  MapPin,
  Sparkles
} from 'lucide-react';
import { aiApi } from '../../../api/aiApi';

interface LiveOrderTrackerProps {
  order: Order;
  onViewDetails: () => void;
}

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  PLACED: <CheckCircle2 className="h-5 w-5" />,
  CUTTING: <Scissors className="h-5 w-5" />,
  PACKED: <Package className="h-5 w-5" />,
  OUT_FOR_DELIVERY: <Truck className="h-5 w-5" />,
  DELIVERED: <CheckCircle2 className="h-5 w-5" />,
  CANCELLED: <CheckCircle2 className="h-5 w-5" />
};

const statusColors: Record<OrderStatus, string> = {
  PLACED: 'bg-blue-500',
  CUTTING: 'bg-orange-500',
  PACKED: 'bg-purple-500',
  OUT_FOR_DELIVERY: 'bg-green-500',
  DELIVERED: 'bg-emerald-500',
  CANCELLED: 'bg-red-500'
};

const statusLabels: Record<OrderStatus, string> = {
  PLACED: 'Order Placed',
  CUTTING: 'Being Cut Fresh',
  PACKED: 'Packed',
  OUT_FOR_DELIVERY: 'On the Way',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

export function LiveOrderTracker({ order, onViewDetails }: LiveOrderTrackerProps) {
  const [narration, setNarration] = useState<string | null>(null);
  const [loadingNarration, setLoadingNarration] = useState(false);

  const currentStatusIndex = order.trackingInfo.timeline.findIndex(
    t => t.status === order.status
  );
  const progress = ((currentStatusIndex + 1) / order.trackingInfo.timeline.length) * 100;

  const estimatedTime = new Date(order.trackingInfo.estimatedArrival);
  const now = new Date();
  const minutesRemaining = Math.max(0, Math.floor((estimatedTime.getTime() - now.getTime()) / (1000 * 60)));

  // 🥇 HIGH-IMPACT FEATURE: Get AI narration for order status
  useEffect(() => {
    const fetchNarration = async () => {
      if (order.status === 'DELIVERED' || order.status === 'CANCELLED') return;
      
      try {
        setLoadingNarration(true);
        const orderData = {
          id: order.id,
          orderNumber: `ORD${order.id}`,
          status: order.status,
          items: order.items,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt || order.createdAt
        };
        const response = await aiApi.narrateOrder(orderData);
        setNarration(response.narration);
      } catch (error) {
        console.error('Failed to fetch narration:', error);
        setNarration(null);
      } finally {
        setLoadingNarration(false);
      }
    };

    fetchNarration();
  }, [order.status, order.id]);

  return (
    <Card className="p-4 md:p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 shadow-lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-2 rounded-lg ${statusColors[order.status]} text-white`}>
                {statusIcons[order.status]}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {statusLabels[order.status]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Order #{order.id}
                </p>
              </div>
            </div>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {order.status === 'DELIVERED' ? (
              'Completed'
            ) : (
              <>
                <Clock className="h-3 w-3 mr-1" />
                {minutesRemaining} mins
              </>
            )}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          {/* 🥇 AI Narration - Makes waiting feel shorter */}
          {narration ? (
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <Sparkles className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <span>{narration}</span>
            </p>
          ) : loadingNarration ? (
            <p className="text-xs text-muted-foreground">Getting update...</p>
          ) : (
          <p className="text-xs text-muted-foreground">
            {order.trackingInfo.timeline.find(t => t.status === order.status)?.message}
          </p>
          )}
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between py-2">
          {order.trackingInfo.timeline.slice(0, 5).map((event, index) => (
            <div key={event.status} className="flex flex-col items-center gap-1 flex-1">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  event.completed 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {event.completed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
              <p className={`text-xs text-center hidden md:block ${
                event.completed ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {event.status.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
              </p>
            </div>
          ))}
        </div>

        {/* Order Items Preview */}
        <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item, idx) => (
              <img
                key={idx}
                src={item.imageUrl}
                alt={item.productName}
                className="w-12 h-12 rounded-lg object-cover border-2 border-card"
              />
            ))}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </p>
            <p className="text-xs text-muted-foreground">
              ₹{order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Delivery Info */}
        {order.status === 'OUT_FOR_DELIVERY' && order.trackingInfo.deliveryPersonName && (
          <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {order.trackingInfo.deliveryPersonName}
                </p>
                <p className="text-xs text-muted-foreground">Delivery Partner</p>
              </div>
            </div>
            {order.trackingInfo.deliveryPersonPhone && (
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={onViewDetails}
            className="flex-1 bg-primary hover:bg-primary-dark"
          >
            View Details
          </Button>
          {order.videos.length > 0 && (
            <Button 
              variant="outline"
              className="flex-1"
            >
              Watch Videos
            </Button>
          )}
        </div>

        {/* Delivery Address */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p>Delivering to:</p>
            <p className="text-foreground">
              {order.deliveryAddress.line1}, {order.deliveryAddress.city}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
