// MEATHUB - Floating Order Tracker (Zepto/Uber/Rapido style)
// Enhanced with AI Order Narration 🥇

import React, { useState, useEffect } from 'react';
import { Order } from '../../../types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Clock, Truck, X, Maximize2, Sparkles } from 'lucide-react';
import { aiApi } from '../../../api/aiApi';

interface FloatingOrderTrackerProps {
  order: Order;
  onViewDetails: () => void;
  onClose?: () => void;
}

export function FloatingOrderTracker({ order, onViewDetails, onClose }: FloatingOrderTrackerProps) {
  const estimatedTime = new Date(order.trackingInfo.estimatedArrival);
  const now = new Date();
  const minutesRemaining = Math.max(0, Math.floor((estimatedTime.getTime() - now.getTime()) / (1000 * 60)));
  const [narration, setNarration] = useState<string | null>(null);
  const [loadingNarration, setLoadingNarration] = useState(false);

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
        // Fallback to default message
        setNarration(null);
      } finally {
        setLoadingNarration(false);
      }
    };

    fetchNarration();
  }, [order.status, order.id]);

  if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 md:w-80 shadow-2xl rounded-lg overflow-hidden border-2 border-primary/30 bg-card">
      {/* Mini Map Area */}
      <div className="relative h-28 bg-gradient-to-br from-primary/10 to-secondary/10">
        {/* Mock Map - In production, integrate Google Maps or Mapbox */}
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-1 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Live Tracking</p>
          </div>
        </div>
        
        {/* Route Line */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full h-0.5 bg-primary/40 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
          </div>
        </div>

        {/* Close Button */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1.5 right-1.5 h-6 w-6 bg-white/95 hover:bg-white"
            onClick={onClose}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Order Info */}
      <div className="p-2.5 space-y-1.5 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold">Order #{order.id}</p>
            {/* 🥇 AI Narration - Makes waiting feel shorter */}
            {narration ? (
              <p className="text-xs text-muted-foreground mt-0.5 flex items-start gap-1">
                <Sparkles className="h-2.5 w-2.5 mt-0.5 text-primary flex-shrink-0" />
                <span>{narration}</span>
              </p>
            ) : loadingNarration ? (
              <p className="text-xs text-muted-foreground mt-0.5">Updating...</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {order.status === 'OUT_FOR_DELIVERY' ? 'On the way' : 'Preparing'}
              </p>
            )}
          </div>
          <Badge variant="outline" className="text-xs px-1.5 py-0.5 ml-2">
            <Clock className="h-2.5 w-2.5 mr-1" />
            {minutesRemaining}m
          </Badge>
        </div>

        {/* Delivery Person Info */}
        {order.status === 'OUT_FOR_DELIVERY' && order.trackingInfo.deliveryPersonName && (
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
              <Truck className="h-2.5 w-2.5 text-primary" />
            </div>
            <span className="text-muted-foreground text-xs">
              {order.trackingInfo.deliveryPersonName}
            </span>
          </div>
        )}

        {/* View Details Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs h-7"
          onClick={onViewDetails}
        >
          View Details
          <Maximize2 className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}

