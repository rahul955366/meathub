// MEATHUB - Admin Dashboard

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp,
  UserCheck,
  AlertCircle,
  Calendar,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { adminApi, DashboardStatsResponse, OrderSummaryResponse } from '../../api/adminApi';
import { butcherApi, ButcherResponse } from '../../api/butcherApi';
import { toast } from 'sonner';

interface AdminDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

const COLORS = ['#C85A3E', '#8B9D83', '#F4A261', '#2A9D8F', '#D4A574'];

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { currentUser } = useApp();
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummaryResponse | null>(null);
  const [butchers, setButchers] = useState<ButcherResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.role === 'ADMIN') {
      loadDashboardData();
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, summaryData, butchersData] = await Promise.all([
        adminApi.getDashboardStats().catch(() => null),
        adminApi.getOrderSummary().catch(() => null),
        butcherApi.getAllButchers().catch(() => []),
      ]);
      setStats(statsData);
      setOrderSummary(summaryData);
      setButchers(butchersData);
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (butcherId: number) => {
    try {
      setApprovingId(butcherId);
      await butcherApi.approveButcher(butcherId);
      toast.success('Butcher approved successfully');
      await loadDashboardData();
    } catch (error: any) {
      console.error('Failed to approve butcher:', error);
      toast.error(error.message || 'Failed to approve butcher');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (butcherId: number) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      setRejectingId(butcherId);
      await butcherApi.rejectButcher(butcherId, rejectReason);
      toast.success('Butcher rejected');
      setRejectReason('');
      setShowRejectDialog(false);
      await loadDashboardData();
    } catch (error: any) {
      console.error('Failed to reject butcher:', error);
      toast.error(error.message || 'Failed to reject butcher');
    } finally {
      setRejectingId(null);
    }
  };

  const pendingButchers = butchers.filter(b => b.status === 'PENDING');

  // Prepare chart data
  const revenueData = orderSummary?.revenueByCategory 
    ? Object.entries(orderSummary.revenueByCategory).map(([name, revenue]) => ({
        name: name.charAt(0) + name.slice(1).toLowerCase(),
        revenue: revenue,
      }))
    : [];

  const categoryData = orderSummary?.revenueByCategory
    ? Object.entries(orderSummary.revenueByCategory).map(([name, value]) => ({
        name: name.charAt(0) + name.slice(1).toLowerCase(),
        value: value,
      }))
    : [];

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Access denied - Admin only</p>
          <Button onClick={() => onNavigate('home')}>Go to Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Complete overview of MEATHUB operations</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Users</p>
                <Users className="h-5 w-5 text-primary" />
              </div>
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <p className="text-3xl font-semibold">
                    {stats?.totalUsers?.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {stats?.pendingApprovals ? `${stats.pendingApprovals} pending` : 'All approved'}
                  </p>
                </>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <Package className="h-5 w-5 text-secondary" />
              </div>
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <p className="text-3xl font-semibold">
                    {stats?.totalOrders?.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {stats?.todayOrders ? `${stats.todayOrders} today` : 'No orders today'}
                  </p>
                </>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <p className="text-3xl font-semibold">
                    {stats?.totalRevenue 
                      ? `₹${(stats.totalRevenue / 100000).toFixed(1)}L`
                      : '₹0'
                    }
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {stats?.todayRevenue ? `₹${stats.todayRevenue.toLocaleString()} today` : 'No revenue today'}
                  </p>
                </>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Active Butchers</p>
                <UserCheck className="h-5 w-5 text-secondary" />
              </div>
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <p className="text-3xl font-semibold">
                    {stats?.totalButchers || butchers.filter(b => b.status === 'APPROVED').length}
                  </p>
                  <p className="text-sm text-orange-600 mt-1">
                    {pendingButchers.length} pending approval
                  </p>
                </>
              )}
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Revenue by Category</h3>
              {loading || revenueData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <p className="text-muted-foreground">No revenue data available</p>
                  )}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#6B655E" />
                    <YAxis stroke="#6B655E" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="revenue" fill="#C85A3E" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            {/* Category Distribution */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Sales by Category</h3>
              {loading || categoryData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <p className="text-muted-foreground">No category data available</p>
                  )}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

          {/* Recent Activity & Approvals */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pending Approvals */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Pending Butcher Approvals</h3>
                <Badge variant="destructive">{pendingButchers.length}</Badge>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : pendingButchers.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingButchers.map((butcher) => (
                    <div key={butcher.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{butcher.businessName}</p>
                        <p className="text-sm text-muted-foreground">{butcher.ownerName}</p>
                        <p className="text-sm text-muted-foreground">{butcher.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied {new Date(butcher.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(butcher.id)}
                          disabled={approvingId === butcher.id}
                        >
                          {approvingId === butcher.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Approve'
                          )}
                        </Button>
                        <Dialog open={showRejectDialog && rejectingId === butcher.id} onOpenChange={setShowRejectDialog}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRejectingId(butcher.id);
                                setShowRejectDialog(true);
                              }}
                            >
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Butcher Application</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">
                                  Rejection Reason
                                </label>
                                <Input
                                  placeholder="Enter reason for rejection"
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setShowRejectDialog(false);
                                    setRejectReason('');
                                  }}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleReject(butcher.id)}
                                  disabled={rejectingId === butcher.id || !rejectReason.trim()}
                                  className="flex-1"
                                >
                                  {rejectingId === butcher.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : null}
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Subscriptions Overview */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Active Subscriptions</h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Active</p>
                      <p className="text-2xl font-semibold">
                        {stats?.activeSubscriptions?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>

                  {orderSummary?.ordersByStatus && (
                    <div className="space-y-2 pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Orders by Status</p>
                      {Object.entries(orderSummary.ordersByStatus).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground capitalize">{status.toLowerCase()}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
