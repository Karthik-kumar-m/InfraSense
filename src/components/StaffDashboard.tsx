import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { StatCard } from './StatCard';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Logo } from './Logo';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Zap,
  User,
  Bell,
  Settings,
  BarChart3,
  AlertCircle,
  LogOut,
  Users
} from 'lucide-react';
import { getPredictions, getIssues, getAnalytics } from '../utils/api';
import { toast } from 'sonner';

interface Issue {
  id: string;
  title: string;
  category: string;
  room: string;
  building: string;
  status: 'open' | 'assigned' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  studentName: string;
  createdAt: string;
  isPredicted?: boolean;
}

interface Prediction {
  id: string;
  type: string;
  title: string;
  description: string;
  room: string;
  building: string;
  category: string;
  confidence: number;
  priority: string;
  basedOnIssues: number;
  createdAt: string;
}

interface StaffDashboardProps {
  staffName: string;
  onViewIssue: (id: string) => void;
  onViewAllIssues: () => void;
  onViewAnalytics: () => void;
  onViewDepartmentAdmin?: () => void;
  onViewProfile: () => void;
  onLogout?: () => void;
}

export function StaffDashboard({ 
  staffName, 
  onViewIssue, 
  onViewAllIssues, 
  onViewAnalytics,
  onViewDepartmentAdmin,
  onViewProfile,
  onLogout
}: StaffDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0,
    avgResolutionTime: '0 hrs',
  });
  const [urgentIssues, setUrgentIssues] = useState<Issue[]>([]);
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [predictedIssues, setPredictedIssues] = useState<Prediction[]>([]);
  const [trends, setTrends] = useState({
    pending: { value: '+3 from yesterday', isPositive: false },
    inProgress: { value: '+2 from yesterday', isPositive: true },
    resolved: { value: '+12% from last month', isPositive: true },
    avgResolution: { value: '-0.3 hrs', isPositive: true },
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('[StaffDashboard] Loading dashboard data...');
      
      // Load issues
      const issues = await getIssues();
      console.log('[StaffDashboard] Loaded issues:', issues);
      
      // Load analytics
      const analytics = await getAnalytics();
      console.log('[StaffDashboard] Loaded analytics:', analytics);
      
      // Load predictions
      const predictions = await getPredictions();
      console.log('[StaffDashboard] Loaded predictions:', predictions);
      
      // Calculate stats from analytics
      setStats({
        pending: analytics.openIssues || 0,
        inProgress: analytics.inProgressIssues || 0,
        resolved: analytics.resolvedIssues || 0,
        avgResolutionTime: `${analytics.avgResolutionTime || 0} hrs`,
      });
      
      // Store trends for use in StatCards
      const trendsData = analytics.trends || {};
      
      // Format trends for display
      const formattedTrends = {
        pending: trendsData.pending ? {
          value: `${trendsData.pending.value}% from yesterday`,
          isPositive: trendsData.pending.isPositive
        } : { value: '0% from yesterday', isPositive: true },
        inProgress: trendsData.inProgress ? {
          value: `${trendsData.inProgress.value}% in last 24h`,
          isPositive: trendsData.inProgress.isPositive
        } : { value: '0% in last 24h', isPositive: true },
        resolved: trendsData.resolved ? {
          value: `${trendsData.resolved.value}% this week`,
          isPositive: trendsData.resolved.isPositive
        } : { value: '0% this week', isPositive: true },
        avgResolution: trendsData.avgResolution ? {
          value: trendsData.avgResolution.comparison,
          isPositive: trendsData.avgResolution.isPositive
        } : { value: 'No data yet', isPositive: true },
      };
      
      // Set urgent issues (high priority, open or assigned)
      const urgent = issues
        .filter((i: any) => 
          (i.priority === 'high' || i.priority === 'critical') && 
          (i.status === 'open' || i.status === 'assigned')
        )
        .slice(0, 5);
      setUrgentIssues(urgent);
      
      // Set recent issues
      const recent = issues
        .filter((i: any) => i.status !== 'resolved' && i.status !== 'closed')
        .slice(0, 5);
      setRecentIssues(recent);
      
      // Set predictions
      setPredictedIssues(predictions || []);
      
      // Update trends state
      setTrends(formattedTrends);
      
    } catch (error: any) {
      console.error('[StaffDashboard] Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Logo size="sm" />
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={onViewProfile}
                >
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-foreground">Welcome, {staffName}</h2>
                  <p className="text-sm text-muted-foreground">Staff Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onViewAnalytics}>
                <BarChart3 className="w-5 h-5" />
              </Button>
              <Bell className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              <Button variant="ghost" size="icon" onClick={onViewProfile}>
                <User className="w-5 h-5" />
              </Button>
              {onLogout && (
                <Button variant="ghost" size="icon" onClick={onLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Pending Issues"
            value={stats.pending}
            icon={Clock}
            trend={trends.pending}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={TrendingUp}
            trend={trends.inProgress}
          />
          <StatCard
            title="Resolved (Month)"
            value={stats.resolved}
            icon={CheckCircle}
            trend={trends.resolved}
          />
          <StatCard
            title="Avg Resolution"
            value={stats.avgResolutionTime}
            icon={Zap}
            trend={trends.avgResolution}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* System Admin Actions */}
            {onViewDepartmentAdmin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 hover:shadow-lg transition-all cursor-pointer"
                  onClick={onViewDepartmentAdmin}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-indigo-900 mb-2">Department Management</h4>
                      <p className="text-sm text-indigo-700 mb-3">
                        Manage staff members, track performance, and view workload distribution
                      </p>
                      <Button size="sm" variant="outline" className="bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                        Manage Department →
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card 
                  className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 hover:shadow-lg transition-all cursor-pointer"
                  onClick={onViewAnalytics}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-blue-900 mb-2">Analytics & Insights</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        View heatmaps, trends, and predictive analytics across campus
                      </p>
                      <Button size="sm" variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
                        View Analytics →
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* High Priority Alerts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">High Priority Issues</h3>
                <Button variant="outline" size="sm" onClick={onViewAllIssues}>
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {urgentIssues.length > 0 ? (
                  urgentIssues.map((issue) => (
                    <Card 
                      key={issue.id} 
                      className="p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-red-400"
                      onClick={() => onViewIssue(issue.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="text-foreground mb-1">{issue.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {issue.category} • {issue.room}, {issue.building}
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge status={issue.status} />
                                <PriorityBadge priority={issue.priority} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">Reported by</p>
                          <p className="text-sm text-foreground">{issue.studentName}</p>
                          <p className="text-xs text-muted-foreground mt-1">{issue.createdAt}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h4 className="text-foreground mb-2">No High Priority Issues</h4>
                    <p className="text-sm text-muted-foreground">
                      All urgent issues have been addressed. Great work!
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {/* All Pending Issues */}
            <div>
              <h3 className="text-foreground mb-4">All Pending Issues</h3>
              <div className="space-y-4">
                {recentIssues.map((issue) => (
                  <Card 
                    key={issue.id} 
                    className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onViewIssue(issue.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-foreground mb-1">{issue.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {issue.category} • {issue.room}, {issue.building}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge status={issue.status} />
                              <PriorityBadge priority={issue.priority} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{issue.createdAt}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prediction Alerts Widget */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-purple-900 mb-1">AI Predictions</h4>
                  <p className="text-sm text-purple-700">Proactive maintenance alerts</p>
                </div>
              </div>

              <div className="space-y-3">
                {predictedIssues.length > 0 ? (
                  predictedIssues.map((issue) => (
                    <div 
                      key={issue.id}
                      className="p-3 bg-white/60 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors cursor-pointer"
                      onClick={() => onViewIssue(issue.id)}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Zap className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                        <h4 className="text-sm text-purple-900 flex-1">{issue.title}</h4>
                      </div>
                      <p className="text-xs text-purple-700 mb-2">
                        {issue.room}, {issue.building}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-purple-600">
                          {issue.confidence}% confidence
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          issue.priority === 'high' 
                            ? 'bg-red-100 text-red-700' 
                            : issue.priority === 'medium'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {issue.priority}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Zap className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                    <p className="text-sm text-purple-600">
                      {loading ? 'Loading predictions...' : 'No predictions available yet'}
                    </p>
                    <p className="text-xs text-purple-500 mt-1">
                      {!loading && 'AI will analyze patterns as more issues are reported'}
                    </p>
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4 bg-white border-purple-200 text-purple-700 hover:bg-purple-50"
                size="sm"
              >
                View All Predictions
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h4 className="text-foreground mb-4">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={onViewAllIssues}>
                  <Clock className="w-4 h-4 mr-2" />
                  View All Issues
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={onViewAnalytics}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={onViewProfile}>
                  <User className="w-4 h-4 mr-2" />
                  Manage Staff
                </Button>
                {onViewDepartmentAdmin && (
                  <Button variant="outline" className="w-full justify-start" onClick={onViewDepartmentAdmin}>
                    <Settings className="w-4 h-4 mr-2" />
                    Department Admin
                  </Button>
                )}
              </div>
            </Card>

            {/* Workload Indicator */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
              <h4 className="text-green-900 mb-3">Your Workload</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-green-700">Assigned Issues</span>
                    <span className="text-green-900">8/15</span>
                  </div>
                  <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '53%' }} />
                  </div>
                </div>
                <p className="text-sm text-green-700">Good balance - accepting new issues</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}