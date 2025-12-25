// MEATHUB - AI Assistant (Natural, Non-chatbot style)

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  CheckCircle,
  Package,
  Clock,
  ChefHat,
  Languages
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AIAssistantMessage } from '../../../types';
import { toast } from 'sonner';
import { aiApi } from '../../../api/aiApi';

export function AIAssistant() {
  const { showAIAssistant, setShowAIAssistant, currentUser } = useApp();
  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: '1',
      role: 'ASSISTANT',
      content: `Hello ${currentUser?.name || 'there'}! 👋 I'm your MEATHUB assistant. I can help you with:\n\n• Placing orders\n• Tracking deliveries\n• Recipe suggestions\n• Managing subscriptions\n• Cooking tips\n\nWhat would you like to do today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 🥈 Enhanced quick actions - AI can DO THINGS
  const quickActions = [
    { icon: Package, label: 'Track Order', action: 'track' },
    { icon: ChefHat, label: 'Cooking Help', action: 'recipe' },
    { icon: Clock, label: 'Order Meat', action: 'order' },
    { icon: Languages, label: 'Change Language', action: 'language' }
  ];

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: AIAssistantMessage = {
      id: Date.now().toString(),
      role: 'USER',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // 🥈 Call actionable AI API - AI can DO THINGS, not just talk
      const response = await aiApi.chat({
        message: userInput,
        language: 'en'
      });

      // Handle response - check both 'response' and 'message' fields
      const responseText = response.response || response.message || 'I received your message.';

      const aiMessage: AIAssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ASSISTANT',
        content: responseText,
        timestamp: new Date().toISOString(),
        // 🥈 Handle actionable results - AI can place orders, cancel orders, etc.
        action: response.actionResult ? {
          type: (response.detectedIntent || response.intent || 'DATA_FETCHED') as any,
          success: true,
          data: response.actionResult
        } : undefined
      };

      setMessages(prev => [...prev, aiMessage]);

      // Show success toast for actionable intents
      if (response.detectedIntent === 'ORDER_MEAT' || response.detectedIntent === 'CANCEL_ORDER') {
        toast.success('Action completed!');
      }
    } catch (error: any) {
      // Handle 401 - user needs to login
      if (error?.status === 401) {
        const errorMessage: AIAssistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ASSISTANT',
          content: "Please login to use the AI Assistant. I can help you order meat, track orders, get cooking tips, and more once you're logged in! 😊",
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
        toast.info('Please login to chat with AI');
        return;
      }
      
      // Handle AI errors gracefully
      const errorMessage: AIAssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ASSISTANT',
        content: error?.status === 0 
          ? "I'm having trouble connecting right now. Please check if the services are running and try again."
          : "I'm having trouble right now. Please try again in a moment.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Only show toast for non-network errors
      if (error?.status !== 0) {
        toast.error('Failed to get AI response. Please try again.');
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    
    switch (action) {
      case 'track':
        message = 'Where is my order?';
        break;
      case 'recipe':
        message = 'How do I cook chicken curry?';
        break;
      case 'order':
        message = 'Order half kg chicken curry cut';
        break;
      case 'language':
        message = 'Change language to Hindi';
        break;
    }

    // Auto-send quick action messages
    setInput(message);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const generateAIResponse = (userInput: string): AIAssistantMessage => {
    const lowerInput = userInput.toLowerCase();
    let content = '';
    let action = undefined;

    if (lowerInput.includes('track') || lowerInput.includes('order status')) {
      content = "I can see you have an active order (ORD-2024-001234). It's currently being cut fresh by our butcher. Your order will be ready for delivery in about 45 minutes!\n\nWould you like to see the live video of your meat being cut?";
      action = {
        type: 'TRACKING_UPDATE' as const,
        success: true
      };
    } else if (lowerInput.includes('recipe') || lowerInput.includes('cook')) {
      content = "Based on your order of Chicken Breast and Mutton Curry Cut, here are some suggestions:\n\n🍗 **Chicken Breast**\n• Grilled Lemon Herb Chicken (20 mins)\n• Pan-seared with Garlic Butter (15 mins)\n• Healthy Chicken Salad (10 mins)\n\n🍖 **Mutton Curry Cut**\n• Rich Mutton Curry (45 mins slow cook)\n• Spicy Mutton Biryani (1 hour)\n• Mutton Rogan Josh (50 mins)\n\nWould you like detailed instructions for any of these?";
      action = {
        type: 'RECIPE_SUGGESTION' as const,
        success: true
      };
    } else if (lowerInput.includes('cancel')) {
      content = "I understand you want to cancel your order. However, your order is already being cut by our butcher. We can't cancel it at this stage, but I can help you with future orders.\n\nWould you like to speak with our support team?";
      action = {
        type: 'ORDER_CANCELLED' as const,
        success: false
      };
    } else if (lowerInput.includes('subscribe') || lowerInput.includes('subscription')) {
      content = "Great choice! Subscriptions save you 10% and ensure you never run out of fresh meat.\n\nI can set up:\n• Daily delivery\n• Weekly (specific days)\n• Sunday special\n• Custom schedule\n\nWhat works best for you?";
      action = {
        type: 'SUBSCRIPTION_UPDATED' as const,
        success: true
      };
    } else if (lowerInput.includes('language') || lowerInput.includes('hindi')) {
      content = "I can help you switch to Hindi or other languages. Our app supports:\n• हिंदी (Hindi)\n• తెలుగు (Telugu)\n• தமிழ் (Tamil)\n• ಕನ್ನಡ (Kannada)\n\nWhich language would you prefer?";
    } else {
      content = "I'm here to help! I can assist you with:\n\n• **Order Management** - Place, track, or modify orders\n• **Recipes & Cooking** - Get cooking tips and recipe suggestions\n• **Subscriptions** - Set up regular deliveries\n• **Product Info** - Learn about cuts, nutrition, and quality\n\nWhat would you like to know more about?";
    }

    return {
      id: Date.now().toString(),
      role: 'ASSISTANT',
      content,
      timestamp: new Date().toISOString(),
      action
    };
  };

  if (!showAIAssistant) {
    return (
      <button
        onClick={() => setShowAIAssistant(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary hover:bg-primary-dark text-primary-foreground rounded-full shadow-lg flex items-center justify-center group hover:scale-110 transition-all"
      >
        <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-40 w-full max-w-md h-[600px] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-xs text-primary-foreground/80">Always here to help</p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowAIAssistant(false)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b bg-accent/50">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.action)}
              className="justify-start"
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 ${
                  message.role === 'USER'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {message.action && (
                  <Badge 
                    variant={message.action.success ? 'default' : 'destructive'}
                    className="mt-2"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {message.action.type.replace(/_/g, ' ')}
                  </Badge>
                )}
                
                <p className="text-xs opacity-60 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim()}
            className="bg-primary hover:bg-primary-dark"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
