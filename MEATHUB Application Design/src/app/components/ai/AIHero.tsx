// MEATHUB - AI Hero Component (Stylish Right Panel Hero)

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Sparkles, 
  Send, 
  MessageCircle, 
  Zap, 
  ChefHat, 
  Package,
  MapPin,
  Brain,
  Wand2
} from 'lucide-react';
import { aiApi } from '../../../api/aiApi';
import { toast } from 'sonner';

interface AIHeroProps {
  onQuickAction?: (action: string) => void;
}

export function AIHero({ onQuickAction }: AIHeroProps) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Animated sparkle effect
  const [sparkleAnimation, setSparkleAnimation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkleAnimation(true);
      setTimeout(() => setSparkleAnimation(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    try {
      setLoading(true);
      setIsTyping(true);
      setResponse(null);
      
      const aiResponse = await aiApi.chat({
        message: input,
        language: 'en'
      });

      const responseText = aiResponse.response || aiResponse.message || 'I received your message.';
      
      // Simulate typing effect
      setTimeout(() => {
        setResponse(responseText);
        setIsTyping(false);
      }, 500);
      
      setInput('');
    } catch (error: any) {
      // Handle AI errors gracefully
      if (error?.status === 0) {
        // Network error - service not available
        setResponse('AI service is not available right now. Please try again later.');
      } else {
        setResponse('I apologize, but I encountered an error. Please try again.');
      }
      setIsTyping(false);
      // Don't show toast for network errors to avoid spam
      if (error?.status !== 0) {
        toast.error('Failed to get AI response');
      }
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      label: 'Find Butcher', 
      action: 'find-butcher',
      icon: MapPin,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20'
    },
    { 
      label: 'Track Order', 
      action: 'track-order',
      icon: Package,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10 hover:bg-green-500/20'
    },
    { 
      label: 'Cooking Help', 
      action: 'cooking-help',
      icon: ChefHat,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10 hover:bg-orange-500/20'
    },
  ];

  return (
    <Card className="relative overflow-hidden p-0 border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 shadow-xl">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative p-6 space-y-6">
        {/* Hero Header with Animation */}
        <div className="text-center space-y-4">
          {/* Animated Icon */}
          <div className="relative inline-block">
            <div className={`absolute inset-0 rounded-full bg-primary/20 blur-xl transition-all duration-1000 ${
              sparkleAnimation ? 'scale-150 opacity-50' : 'scale-100 opacity-30'
            }`}></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary via-primary/80 to-secondary border-4 border-background shadow-lg">
              <Sparkles className={`h-10 w-10 text-primary-foreground transition-transform duration-500 ${
                sparkleAnimation ? 'scale-110 rotate-12' : 'scale-100'
              }`} />
            </div>
            {/* Floating particles */}
            <div className="absolute -top-2 -right-2">
              <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -left-1">
              <Wand2 className="h-3 w-3 text-purple-400 animate-pulse delay-300" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                MEATHUB AI
              </h3>
              <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                <Brain className="h-3 w-3 mr-1" />
                Powered
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Your intelligent assistant for ordering, tracking & cooking
            </p>
          </div>
        </div>

        {/* Quick Actions - Enhanced */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</p>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.action}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onQuickAction) {
                      onQuickAction(action.action);
                    }
                  }}
                  className={`${action.bgColor} border-0 transition-all duration-300 hover:scale-105 hover:shadow-md group`}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <Icon className={`h-4 w-4 ${action.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-xs font-medium">{action.label}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Chat Input - Enhanced */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ask Me Anything</p>
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Try: 'Order chicken curry cut' or 'Track my order'..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      handleSend();
                    }
                  }}
                  className="pr-10 bg-background/80 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={loading}
                />
                {input && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  </div>
                )}
              </div>
              <Button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                size="icon"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* AI Response - Enhanced */}
          {response && (
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-md animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground leading-relaxed">{response}</p>
                  <p className="text-xs text-muted-foreground">AI Assistant</p>
                </div>
              </div>
            </Card>
          )}

          {/* Loading State - Enhanced */}
          {isTyping && (
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 flex items-center justify-center">
                    <Brain className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">AI is thinking...</p>
                </div>
              </div>
            </Card>
          )}

          {/* Suggestions */}
          {!response && !loading && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Order chicken",
                  "Track order",
                  "Cooking tips"
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="ghost"
                    size="sm"
                    onClick={() => setInput(suggestion)}
                    className="text-xs h-7 bg-background/50 hover:bg-primary/10 border border-primary/10 hover:border-primary/30 transition-all"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats/Features */}
        <div className="pt-4 border-t border-primary/10">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <p className="text-lg font-bold text-primary">24/7</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-primary">AI</p>
              <p className="text-xs text-muted-foreground">Powered</p>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-primary">Fast</p>
              <p className="text-xs text-muted-foreground">Response</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
