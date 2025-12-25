// MEATHUB - WebSocket Hook for Real-time Order Tracking

import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: 'order_update' | 'status_change' | 'error';
  data: any;
}

interface UseWebSocketOptions {
  orderId: number | null;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
  enabled?: boolean;
}

export function useWebSocket({ 
  orderId, 
  onMessage, 
  onError, 
  onClose,
  enabled = true 
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!orderId || !enabled) {
      return;
    }

    // Use SockJS for fallback support
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//localhost:8084/ws/orders/${orderId}`;
    
    // Try native WebSocket first, fallback to SockJS
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected for order:', orderId);
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message.data);
          if (onMessage) {
            onMessage(message.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) {
          onError(error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        if (onClose) {
          onClose();
        }

        // Attempt reconnection
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 1000 * reconnectAttempts.current); // Exponential backoff
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      // Fallback: Use polling instead
      console.warn('Falling back to polling for order updates');
    }
  }, [orderId, enabled, onMessage, onError, onClose]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (orderId && enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [orderId, enabled, connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    connect,
    disconnect,
  };
}
