// MEATHUB - Subscription Calendar Component

import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface DeliveryDate {
  date: Date;
  subscriptions: Array<{
    id: number;
    name: string;
    quantity: string;
    time?: string;
  }>;
}

interface SubscriptionCalendarProps {
  deliveries: DeliveryDate[];
  month?: number;
  year?: number;
}

export function SubscriptionCalendar({ deliveries, month, year }: SubscriptionCalendarProps) {
  const currentDate = new Date();
  const displayMonth = month ?? currentDate.getMonth();
  const displayYear = year ?? currentDate.getFullYear();

  const firstDay = new Date(displayYear, displayMonth, 1);
  const lastDay = new Date(displayYear, displayMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const getDeliveriesForDate = (date: number): DeliveryDate['subscriptions'] => {
    const targetDate = new Date(displayYear, displayMonth, date);
    const delivery = deliveries.find(d => 
      d.date.getDate() === targetDate.getDate() &&
      d.date.getMonth() === targetDate.getMonth() &&
      d.date.getFullYear() === targetDate.getFullYear()
    );
    return delivery?.subscriptions || [];
  };

  const isToday = (date: number) => {
    const today = new Date();
    return date === today.getDate() &&
           displayMonth === today.getMonth() &&
           displayYear === today.getFullYear();
  };

  const isPast = (date: number) => {
    const checkDate = new Date(displayYear, displayMonth, date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">
          {monthNames[displayMonth]} {displayYear}
        </h2>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1;
          const dayDeliveries = getDeliveriesForDate(date);
          const hasDeliveries = dayDeliveries.length > 0;

          return (
            <div
              key={date}
              className={`aspect-square border rounded-md p-1 ${
                isToday(date)
                  ? 'bg-primary/10 border-primary'
                  : isPast(date)
                  ? 'bg-muted/50 opacity-60'
                  : hasDeliveries
                  ? 'bg-green-50 border-green-200'
                  : 'border-border'
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${
                isToday(date) ? 'text-primary' : 'text-foreground'
              }`}>
                {date}
              </div>
              {hasDeliveries && (
                <div className="space-y-0.5">
                  {dayDeliveries.slice(0, 2).map((sub, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-[10px] px-1 py-0 h-4 w-full truncate"
                      title={sub.name}
                    >
                      {sub.name}
                    </Badge>
                  ))}
                  {dayDeliveries.length > 2 && (
                    <div className="text-[10px] text-muted-foreground">
                      +{dayDeliveries.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary/10 border border-primary rounded" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded" />
          <span>Delivery Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted/50 border border-border rounded" />
          <span>Past</span>
        </div>
      </div>
    </Card>
  );
}

