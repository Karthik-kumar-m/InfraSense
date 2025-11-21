import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { StatCard } from './StatCard';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Download,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getAnalytics } from '../utils/api';
import { toast } from 'sonner';

interface AnalyticsDashboardProps {
  onBack: () => void;
}

export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      console.log('[AnalyticsDashboard] Loading analytics...');
      const data = await getAnalytics();
      console.log('[AnalyticsDashboard] Analytics data:', data);
      setStats(data);
    } catch (error: any) {
      console.error('[AnalyticsDashboard] Error loading analytics:', error);
      toast.error('Failed to load analytics: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  // Transform category breakdown for chart
  const categoryData = Object.entries(stats.categoryBreakdown || {}).map(([category, count]) => ({
    category,
    count
  }));

  // Transform priority breakdown for pie chart
  const priorityData = Object.entries(stats.priorityBreakdown || {}).map(([name, value]) => ({
    name,
    value,
    color: name === 'high' || name === 'critical' ? '#fca5a5' : name === 'medium' ? '#fed7aa' : '#d1fae5'
  }));

  // Mock data for trends (since we don't have historical data yet)
  const issuesTrendData = [
    { month: 'Jun', reported: 0, resolved: 0 },
    { month: 'Jul', reported: 0, resolved: 0 },
    { month: 'Aug', reported: 0, resolved: 0 },
    { month: 'Sep', reported: 0, resolved: 0 },
    { month: 'Oct', reported: 0, resolved: 0 },
    { month: 'Nov', reported: stats.totalIssues || 0, resolved: stats.resolvedIssues || 0 },
  ];

  const staffWorkload = [
    { name: 'Unassigned', assigned: stats.openIssues || 0, completed: 0, avgTime: 'N/A', load: 0 },
  ];

  // Heatmap data - rooms with most issues (grouped from recent issues)
  const heatmapData = (stats.recentIssues || [])
    .reduce((acc: any[], issue: any) => {
      const location = `${issue.room}, ${issue.building}`;
      const existing = acc.find(item => item.room === location);
      if (existing) {
        existing.count++;
      } else {
        acc.push({
          room: location,
          count: 1,
          severity: issue.priority === 'high' || issue.priority === 'critical' ? 'high' : 
                   issue.priority === 'medium' ? 'medium' : 'low'
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getLoadColor = (load: number) => {
    if (load >= 75) return 'bg-red-500';
    if (load >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-foreground">Analytics Dashboard</h2>
                <p className="text-sm text-muted-foreground">Insights and trends overview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Issues"
            value={stats.totalIssues || 0}
            icon={AlertCircle}
            trend={{ value: '+8% this month', isPositive: true }}
          />
          <StatCard
            title="Resolved"
            value={stats.resolvedIssues || 0}
            icon={CheckCircle}
            trend={{ value: '+12% this month', isPositive: true }}
          />
          <StatCard
            title="Resolution Rate"
            value="83%"
            icon={TrendingUp}
            trend={{ value: '+5% from last month', isPositive: true }}
          />
          <StatCard
            title="Avg Resolution"
            value="2.5 hrs"
            icon={Clock}
            trend={{ value: '-0.3 hrs', isPositive: true }}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Issues Trend */}
          <Card className="p-6">
            <h3 className="text-foreground mb-6">Issues Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={issuesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="reported" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  name="Reported"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6">
            <h3 className="text-foreground mb-6">Issues by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Priority Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-foreground mb-6">Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Heatmap - Frequent Rooms */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-foreground mb-4">Heatmap - Frequent Issue Locations</h3>
            <div className="space-y-3">
              {heatmapData.map((item, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(item.severity)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="mb-1">{item.room}</p>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-current/20 rounded-full flex-1 max-w-xs overflow-hidden">
                          <div 
                            className="h-full bg-current rounded-full" 
                            style={{ width: `${(item.count / 12) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl">{item.count}</p>
                      <p className="text-xs opacity-70">issues</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Staff Workload */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-foreground">Staff Workload Balance</h3>
            <p className="text-sm text-muted-foreground">Current assignments and performance</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm text-muted-foreground">Staff Member</th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Currently Assigned</th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Completed (Month)</th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Avg Resolution Time</th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Workload</th>
                </tr>
              </thead>
              <tbody>
                {staffWorkload.map((staff, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="text-foreground">{staff.name}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground">{staff.assigned}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground">{staff.completed}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground">{staff.avgTime}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-xs">
                          <Progress value={staff.load} className="h-2" />
                        </div>
                        <span className="text-sm text-foreground w-12 text-right">{staff.load}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}