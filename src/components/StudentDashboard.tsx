import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { StatusBadge } from './StatusBadge';
import { SentimentIndicator } from './SentimentIndicator';
import { EmptyState } from './EmptyState';
import { Logo } from './Logo';
import { getIssues, getGamification, getLeaderboard } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { 
  Plus, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Trophy, 
  Star,
  TrendingUp,
  Bell,
  User,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  category: string;
  room: string;
  location: string;
  status: 'open' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
  sentiment: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface StudentDashboardProps {
  studentName: string;
  onReportIssue: () => void;
  onViewIssue: (id: string) => void;
  onViewGamification: () => void;
  onViewProfile: () => void;
  onLogout?: () => void;
}

export function StudentDashboard({ 
  studentName, 
  onReportIssue, 
  onViewIssue,
  onViewGamification,
  onViewProfile,
  onLogout
}: StudentDashboardProps) {
  const [userStats, setUserStats] = useState({
    points: 0,
    rank: 0,
    badges: 0,
    level: 1,
  });
  const [currentIssues, setCurrentIssues] = useState<Issue[]>([]);
  const [pastIssues, setPastIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('[StudentDashboard] Loading dashboard data...');
      
      // Load user's issues
      const issues = await getIssues();
      console.log('[StudentDashboard] Loaded issues:', issues);
      console.log('[StudentDashboard] Issues type:', typeof issues, 'Is array:', Array.isArray(issues));
      
      // Handle case where issues might be null, undefined, or not an array
      const issuesArray = Array.isArray(issues) ? issues : [];
      console.log('[StudentDashboard] Issues array:', issuesArray);
      
      // Filter out null/undefined issues and separate by status
      const validIssues = issuesArray.filter((i: any) => i != null);
      console.log('[StudentDashboard] Valid issues:', validIssues);
      
      const current = validIssues.filter((i: any) => 
        i.status === 'open' || i.status === 'assigned' || i.status === 'in-progress'
      );
      const past = validIssues.filter((i: any) => 
        i.status === 'resolved' || i.status === 'closed'
      );
      
      console.log('[StudentDashboard] Current issues:', current.length, 'Past issues:', past.length);
      
      setCurrentIssues(current);
      setPastIssues(past);
      
      // Load gamification data
      try {
        const gamification = await getGamification();
        console.log('[StudentDashboard] Gamification data:', gamification);
        
        const leaderboard = await getLeaderboard(100);
        console.log('[StudentDashboard] Leaderboard:', leaderboard);
        
        // Find user rank
        const userRank = leaderboard.findIndex((entry: any) => 
          entry.name === studentName
        ) + 1;
        
        const stats = {
          points: gamification?.points || 0,
          rank: userRank || 0,
          badges: gamification?.badges?.length || 0,
          level: gamification?.level || 1,
        };
        
        console.log('[StudentDashboard] User stats:', stats);
        setUserStats(stats);
      } catch (gamificationError: any) {
        console.error('[StudentDashboard] Error loading gamification:', gamificationError);
        // Don't fail the whole dashboard if gamification fails
        toast.error('Could not load gamification data');
      }
      
    } catch (error: any) {
      console.error('[StudentDashboard] Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Logo size="sm" />
            </div>
            <div className="flex items-center gap-3">
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl text-indigo-900">{userStats.points}</span>
            </div>
            <p className="text-sm text-indigo-700">Total Points</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <span className="text-2xl text-purple-900">#{userStats.rank}</span>
            </div>
            <p className="text-sm text-purple-700">Leaderboard Rank</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl text-yellow-900">{userStats.badges}</span>
            </div>
            <p className="text-sm text-yellow-700">Badges Earned</p>
          </Card>

          <Card 
            className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 cursor-pointer hover:shadow-md transition-shadow"
            onClick={onViewGamification}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <Trophy className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-sm text-green-700">View Progress</p>
            </div>
          </Card>
        </div>

        {/* Report Issue CTA */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white mb-2">Found an Issue?</h3>
              <p className="text-indigo-100">Report it now and help improve our campus</p>
            </div>
            <Button 
              onClick={onReportIssue}
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </Card>

        {/* Current Issues */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Current Issues</h3>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setLoading(true);
                  loadDashboardData();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{currentIssues.length} active</span>
              </div>
            </div>
          </div>

          {currentIssues.length > 0 ? (
            <div className="space-y-4">
              {currentIssues.map((issue) => (
                <Card 
                  key={issue.id} 
                  className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onViewIssue(issue.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-foreground mb-1">{issue.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {issue.category} • {issue.room}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={issue.status} />
                            <SentimentIndicator level={issue.sentiment} showLabel={false} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{formatDate(issue.createdAt)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6">
              <EmptyState
                icon={CheckCircle}
                title="No Active Issues"
                description="You don't have any active issues. Report one if you find something that needs attention."
                actionLabel="Report Issue"
                onAction={onReportIssue}
              />
            </Card>
          )}
        </div>

        {/* Past Issues */}
        <div>
          <h3 className="text-foreground mb-4">Recently Resolved</h3>
          <div className="space-y-4">
            {pastIssues.map((issue) => (
              <Card 
                key={issue.id} 
                className="p-6 hover:shadow-md transition-shadow cursor-pointer opacity-75"
                onClick={() => onViewIssue(issue.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-foreground mb-1">{issue.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {issue.category} • {issue.room}
                        </p>
                        <StatusBadge status={issue.status} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{formatDate(issue.createdAt)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}