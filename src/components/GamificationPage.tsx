import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Award, 
  TrendingUp,
  Medal,
  Target,
  Zap,
  Crown
} from 'lucide-react';

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  total?: number;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  badges: number;
  isCurrentUser?: boolean;
}

interface GamificationPageProps {
  onBack: () => void;
}

export function GamificationPage({ onBack }: GamificationPageProps) {
  const userStats = {
    points: 1250,
    rank: 42,
    totalBadges: 8,
    level: 5,
    nextLevelPoints: 1500,
  };

  const badges: BadgeItem[] = [
    {
      id: '1',
      name: 'First Reporter',
      description: 'Report your first issue',
      icon: '🎯',
      earned: true,
    },
    {
      id: '2',
      name: 'Quick Spotter',
      description: 'Report 10 issues',
      icon: '⚡',
      earned: true,
      progress: 10,
      total: 10,
    },
    {
      id: '3',
      name: 'Campus Guardian',
      description: 'Report 50 issues',
      icon: '🛡️',
      earned: true,
      progress: 50,
      total: 50,
    },
    {
      id: '4',
      name: 'Detail Master',
      description: 'Submit 5 reports with photos',
      icon: '📸',
      earned: true,
      progress: 5,
      total: 5,
    },
    {
      id: '5',
      name: 'Urgent Finder',
      description: 'Report 3 high-priority issues',
      icon: '🚨',
      earned: true,
      progress: 3,
      total: 3,
    },
    {
      id: '6',
      name: 'Week Warrior',
      description: 'Report issues for 7 consecutive days',
      icon: '🔥',
      earned: true,
      progress: 7,
      total: 7,
    },
    {
      id: '7',
      name: 'Team Player',
      description: 'Get 10 issues resolved',
      icon: '✅',
      earned: true,
      progress: 10,
      total: 10,
    },
    {
      id: '8',
      name: 'Safety First',
      description: 'Report 5 safety hazards',
      icon: '⚠️',
      earned: true,
      progress: 5,
      total: 5,
    },
    {
      id: '9',
      name: 'Century Club',
      description: 'Report 100 issues',
      icon: '💯',
      earned: false,
      progress: 52,
      total: 100,
    },
    {
      id: '10',
      name: 'Elite Contributor',
      description: 'Reach top 10 in leaderboard',
      icon: '👑',
      earned: false,
      progress: 42,
      total: 10,
    },
  ];

  const leaderboard: LeaderboardUser[] = [
    { rank: 1, name: 'Emma Wilson', points: 3420, badges: 15 },
    { rank: 2, name: 'Michael Chen', points: 3180, badges: 14 },
    { rank: 3, name: 'Sarah Johnson', points: 2950, badges: 13 },
    { rank: 4, name: 'James Rodriguez', points: 2750, badges: 12 },
    { rank: 5, name: 'Olivia Martinez', points: 2580, badges: 12 },
    { rank: 6, name: 'Daniel Kim', points: 2340, badges: 11 },
    { rank: 7, name: 'Sophia Anderson', points: 2120, badges: 10 },
    { rank: 8, name: 'Lucas Thompson', points: 1980, badges: 10 },
    { rank: 9, name: 'Ava Garcia', points: 1750, badges: 9 },
    { rank: 10, name: 'Ethan Brown', points: 1520, badges: 9 },
    { rank: 42, name: 'You', points: 1250, badges: 8, isCurrentUser: true },
  ];

  const progressToNextLevel = ((userStats.points / userStats.nextLevelPoints) * 100);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-foreground">Your Progress</h2>
              <p className="text-sm text-muted-foreground">Track your achievements and ranking</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl text-yellow-900">{userStats.points}</span>
            </div>
            <p className="text-sm text-yellow-700">Total Points</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <span className="text-2xl text-purple-900">#{userStats.rank}</span>
            </div>
            <p className="text-sm text-purple-700">Rank</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-blue-600" />
              <span className="text-2xl text-blue-900">{userStats.totalBadges}</span>
            </div>
            <p className="text-sm text-blue-700">Badges</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-green-600" />
              <span className="text-2xl text-green-900">{userStats.level}</span>
            </div>
            <p className="text-sm text-green-700">Level</p>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white mb-1">Level {userStats.level}</h3>
              <p className="text-indigo-100 text-sm">
                {userStats.nextLevelPoints - userStats.points} points to Level {userStats.level + 1}
              </p>
            </div>
            <Target className="w-8 h-8 text-white" />
          </div>
          <Progress value={progressToNextLevel} className="h-3 bg-indigo-400" />
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Badges Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-foreground mb-2">Achievements</h3>
              <p className="text-muted-foreground">Unlock badges by completing challenges</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map((badge) => (
                <Card 
                  key={badge.id} 
                  className={`p-6 ${badge.earned ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100' : 'opacity-60'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{badge.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-foreground">{badge.name}</h4>
                        {badge.earned && (
                          <Award className="w-5 h-5 text-green-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                      {badge.progress !== undefined && badge.total !== undefined && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className={badge.earned ? 'text-green-600' : 'text-muted-foreground'}>
                              {badge.progress}/{badge.total}
                            </span>
                          </div>
                          <Progress value={(badge.progress / badge.total) * 100} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <div className="mb-6">
              <h3 className="text-foreground mb-2">Leaderboard</h3>
              <p className="text-muted-foreground">Top contributors this month</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                {leaderboard.map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      user.isCurrentUser ? 'bg-primary/10 border border-primary/20' : ''
                    }`}
                  >
                    <div className="w-8 text-center shrink-0">
                      {getRankIcon(user.rank) || (
                        <span className="text-muted-foreground">#{user.rank}</span>
                      )}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className={user.isCurrentUser ? 'bg-primary text-primary-foreground' : ''}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className={`truncate ${user.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.badges} badges
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-foreground">{user.points}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
