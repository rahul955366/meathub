// MEATHUB - Gym AI Assistant (Specialized for Gym & Fitness)
// Trained for bulking, cutting, diet suggestions, and timing notifications

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Brain, 
  Send, 
  Dumbbell, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Bell,
  Zap,
  ChefHat,
  MessageCircle,
  Loader2,
  X
} from 'lucide-react';
import { aiApi } from '../../../api/aiApi';
import { toast } from 'sonner';
import { useApp } from '../../../context/AppContext';

interface GymAIAssistantProps {
  userGoal?: 'BULKING' | 'CUTTING' | 'MAINTAIN';
  currentPlan?: {
    quantity: number;
    deliveryTime: string;
    productName: string;
  };
}

interface GymAIMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  timestamp: string;
  type?: 'DIET' | 'TRAINING' | 'NOTIFICATION' | 'GENERAL';
}

export function GymAIAssistant({ userGoal, currentPlan }: GymAIAssistantProps) {
  const { currentUser } = useApp();
  const [messages, setMessages] = useState<GymAIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: GymAIMessage = {
      id: '1',
      role: 'ASSISTANT',
      content: `Hey! I'm your Gym AI Coach 💪\n\nI can help you with:\n• Bulking & Cutting strategies\n• Diet planning & meal timing\n• Training advice\n• Protein intake optimization\n• Reminders for your daily protein delivery\n\nWhat's your fitness goal today?`,
      timestamp: new Date().toISOString(),
      type: 'GENERAL'
    };
    setMessages([welcomeMessage]);
  }, []);

  // Set up notifications for protein delivery time
  useEffect(() => {
    if (currentPlan && notificationsEnabled) {
      const scheduleNotification = () => {
        const [hours, minutes] = currentPlan.deliveryTime.split(':').map(Number);
        const now = new Date();
        const deliveryTime = new Date();
        deliveryTime.setHours(hours, minutes, 0, 0);
        
        // If delivery time has passed today, schedule for tomorrow
        if (deliveryTime < now) {
          deliveryTime.setDate(deliveryTime.getDate() + 1);
        }
        
        const timeUntilDelivery = deliveryTime.getTime() - now.getTime();
        
        // Schedule notification 30 minutes before delivery
        const notificationTime = timeUntilDelivery - (30 * 60 * 1000);
        
        if (notificationTime > 0) {
          setTimeout(() => {
            if (notificationsEnabled) {
              toast.info(`🍗 Your ${currentPlan.quantity}g ${currentPlan.productName} will arrive in 30 minutes!`, {
                duration: 5000
              });
              // Add AI message about meal timing
              addAIMessage(`⏰ Reminder: Your ${currentPlan.quantity}g ${currentPlan.productName} is arriving soon! This is the perfect time to prepare your post-workout meal. For optimal muscle recovery, consume within 30 minutes of your workout.`, 'NOTIFICATION');
            }
          }, notificationTime);
        }
      };

      scheduleNotification();
      const interval = setInterval(scheduleNotification, 24 * 60 * 60 * 1000); // Check daily
      
      return () => clearInterval(interval);
    }
  }, [currentPlan, notificationsEnabled]);

  const addAIMessage = (content: string, type: GymAIMessage['type'] = 'GENERAL') => {
    const message: GymAIMessage = {
      id: Date.now().toString(),
      role: 'ASSISTANT',
      content,
      timestamp: new Date().toISOString(),
      type
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: GymAIMessage = {
      id: Date.now().toString(),
      role: 'USER',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build gym-specific context
      const context = `You are a specialized Gym & Fitness AI Coach for MeatHub. 
      
USER CONTEXT:
- Current Goal: ${userGoal || 'Not specified'}
- Daily Protein: ${currentPlan?.quantity || 'Not set'}g of ${currentPlan?.productName || 'protein'}
- Delivery Time: ${currentPlan?.deliveryTime || 'Not set'}

YOUR EXPERTISE:
- Bulking strategies (calorie surplus, macro ratios, meal timing)
- Cutting strategies (calorie deficit, fat loss, muscle preservation)
- Diet planning (protein intake, carb cycling, meal prep)
- Training advice (workout splits, recovery, progressive overload)
- Nutrition timing (pre/post workout, protein distribution)
- Supplement guidance (when needed, what to avoid)

RESPONSE STYLE:
- Be encouraging and motivational
- Provide specific, actionable advice
- Reference their current protein subscription
- Suggest meal timing based on their delivery schedule
- Use emojis sparingly for engagement
- Keep responses concise but informative

USER QUESTION: ${input}`;

      const aiResponse = await aiApi.chat({
        message: input, // Send user's actual question, not the full context
        language: 'en',
        context: 'GYM', // Specify this is Gym AI context
        userContext: {
          goal: userGoal || 'BULKING',
          dailyProtein: currentPlan?.quantity || 250,
          deliveryTime: currentPlan?.deliveryTime || '06:00',
          productName: currentPlan?.productName || 'protein'
        }
      });

      const responseText = aiResponse.response || aiResponse.message || 'I received your message.';
      
      // Determine message type based on content
      let messageType: GymAIMessage['type'] = 'GENERAL';
      const lowerContent = responseText.toLowerCase();
      if (lowerContent.includes('diet') || lowerContent.includes('meal') || lowerContent.includes('food') || lowerContent.includes('nutrition')) {
        messageType = 'DIET';
      } else if (lowerContent.includes('workout') || lowerContent.includes('training') || lowerContent.includes('exercise') || lowerContent.includes('gym')) {
        messageType = 'TRAINING';
      } else if (lowerContent.includes('remind') || lowerContent.includes('time') || lowerContent.includes('schedule')) {
        messageType = 'NOTIFICATION';
      }

      const aiMessage: GymAIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ASSISTANT',
        content: responseText,
        timestamp: new Date().toISOString(),
        type: messageType
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      // Handle 401 - user needs to login
      if (error?.status === 401) {
        const errorMessage: GymAIMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ASSISTANT',
          content: "Please login to use the Gym AI Assistant. I can help you with bulking, cutting, diet planning, and training advice once you're logged in! 💪",
          timestamp: new Date().toISOString(),
          type: 'GENERAL'
        };
        setMessages(prev => [...prev, errorMessage]);
        toast.info('Please login to chat with AI');
      } else {
        const errorMessage: GymAIMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ASSISTANT',
          content: error?.status === 0 
            ? "I'm having trouble connecting right now. Please check if the services are running and try again."
            : "I'm having trouble right now. Please try again in a moment.",
          timestamp: new Date().toISOString(),
          type: 'GENERAL'
        };
        setMessages(prev => [...prev, errorMessage]);
        
        if (error?.status !== 0 && error?.status !== 401) {
          toast.error('Failed to get AI response');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      label: 'Bulking Plan', 
      prompt: 'Create a bulking meal plan for me with my daily protein subscription',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    { 
      label: 'Cutting Plan', 
      prompt: 'Help me create a cutting diet plan while maintaining muscle',
      icon: TrendingDown,
      color: 'text-blue-400'
    },
    { 
      label: 'Meal Timing', 
      prompt: 'When should I eat my protein for optimal muscle growth?',
      icon: Clock,
      color: 'text-purple-400'
    },
    { 
      label: 'Training Tips', 
      prompt: 'Give me workout advice for my fitness goals',
      icon: Dumbbell,
      color: 'text-orange-400'
    },
  ];

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary shadow-2xl hover:scale-110 transition-all z-50"
        size="icon"
      >
        <Brain className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 bg-white/25 backdrop-blur-xl border-2 border-white/40 shadow-2xl z-50 flex flex-col max-h-[600px] dark-theme">
      {/* Header */}
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Gym AI Coach</h3>
            <p className="text-xs text-white/70">Your Fitness Expert</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className="h-8 w-8 text-white hover:bg-white/20"
            title={notificationsEnabled ? 'Notifications ON' : 'Notifications OFF'}
          >
            <Bell className={`h-4 w-4 ${notificationsEnabled ? 'text-green-400' : 'text-white/40'}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(true)}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-white/20">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(action.prompt);
                  setTimeout(() => handleSend(), 100);
                }}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs h-auto py-2"
                disabled={loading}
              >
                <Icon className={`h-3 w-3 mr-1 ${action.color}`} />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[300px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'USER'
                  ? 'bg-primary/30 text-white'
                  : message.type === 'DIET'
                  ? 'bg-green-500/20 border border-green-500/40 text-white'
                  : message.type === 'TRAINING'
                  ? 'bg-blue-500/20 border border-blue-500/40 text-white'
                  : message.type === 'NOTIFICATION'
                  ? 'bg-purple-500/20 border border-purple-500/40 text-white'
                  : 'bg-white/10 border border-white/20 text-white'
              }`}
            >
              {message.role === 'ASSISTANT' && (
                <div className="flex items-center gap-2 mb-1">
                  {message.type === 'DIET' && <ChefHat className="h-3 w-3 text-green-400" />}
                  {message.type === 'TRAINING' && <Dumbbell className="h-3 w-3 text-blue-400" />}
                  {message.type === 'NOTIFICATION' && <Bell className="h-3 w-3 text-purple-400" />}
                  {!message.type && <Brain className="h-3 w-3 text-primary" />}
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs text-white/50 mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-white/70">Gym AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/20">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about bulking, cutting, diet, training..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleSend();
              }
            }}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1"
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            size="icon"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

