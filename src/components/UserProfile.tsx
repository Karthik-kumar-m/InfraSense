import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Trophy, 
  Star, 
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Bell,
  Shield,
  Eye,
  Award,
  Target,
  Zap,
  LogOut
} from 'lucide-react';
import { getGamification, getIssues } from '../utils/api';
import { getAuth } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface UserProfileProps {
  studentName: string;
  onBack: () => void;
  onLogout?: () => void;
}

export function UserProfile({ studentName, onBack, onLogout }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  
  const [profileData, setProfileData] = useState({
    fullName: auth?.profile?.name || 'Student',
    email: auth?.profile?.email || 'student@university.edu',
    phone: '+1 (555) 123-4567',
    studentId: auth?.profile?.studentId || 'N/A',
    department: auth?.profile?.department || 'N/A',
    year: 'Junior',
    enrollmentDate: 'September 2022',
    campus: 'Main Campus, Building A',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    issueUpdates: true,
    gamificationAlerts: true,
  });

  const [stats, setStats] = useState({
    totalPoints: 0,
    rank: 0,
    totalIssues: 0,
    resolvedIssues: 0,
    badges: 0,
    streak: 0,
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      console.log('[UserProfile] Loading profile data...');
      
      // Load gamification data
      const gamification = await getGamification();
      console.log('[UserProfile] Gamification:', gamification);
      
      // Load user's issues
      const issues = await getIssues();
      console.log('[UserProfile] User issues:', issues);
      
      // Handle null/undefined issues safely
      const issuesArray = Array.isArray(issues) ? issues : [];
      
      const resolvedCount = issuesArray.filter((i: any) => 
        i && (i.status === 'resolved' || i.status === 'closed')
      ).length;
      
      setStats({
        totalPoints: gamification?.points || 0,
        rank: 0, // We can calculate this from leaderboard if needed
        totalIssues: issuesArray.length,
        resolvedIssues: resolvedCount,
        badges: gamification?.badges?.length || 0,
        streak: gamification?.streak || 0,
      });
      
    } catch (error: any) {
      console.error('[UserProfile] Error loading profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save the profile data
    console.log('Profile saved:', profileData);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
  };

  const recentBadges = [
    { id: 1, name: 'First Report', icon: Star, color: 'from-yellow-400 to-orange-500', earnedDate: '2 weeks ago' },
    { id: 2, name: 'Quick Resolver', icon: Zap, color: 'from-blue-400 to-indigo-500', earnedDate: '1 week ago' },
    { id: 3, name: 'Campus Hero', icon: Award, color: 'from-purple-400 to-pink-500', earnedDate: '3 days ago' },
    { id: 4, name: '10 Reports', icon: Target, color: 'from-green-400 to-emerald-500', earnedDate: '1 day ago' },
  ];

  const activityHistory = [
    { id: 1, action: 'Reported broken projector', points: '+50', date: '2 hours ago' },
    { id: 2, action: 'Issue resolved: Air conditioning', points: '+100', date: '1 day ago' },
    { id: 3, action: 'Earned "Quick Resolver" badge', points: '+200', date: '1 week ago' },
    { id: 4, action: 'Reported furniture damage', points: '+50', date: '1 week ago' },
    { id: 5, action: 'Issue resolved: Broken chair', points: '+75', date: '2 weeks ago' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-foreground">Profile Settings</h2>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl">
                    {profileData.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-foreground mb-1">{profileData.fullName}</h3>
                <p className="text-sm text-muted-foreground mb-4">{profileData.studentId}</p>
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profileData.campus}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Since {profileData.enrollmentDate}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Quick Stats */}
              <div className="space-y-3">
                <h4 className="text-foreground mb-3">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3">
                    <Trophy className="w-5 h-5 text-indigo-600 mb-1" />
                    <p className="text-sm text-muted-foreground">Points</p>
                    <p className="text-lg text-foreground">{stats.totalPoints}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3">
                    <TrendingUp className="w-5 h-5 text-purple-600 mb-1" />
                    <p className="text-sm text-muted-foreground">Rank</p>
                    <p className="text-lg text-foreground">#{stats.rank}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3">
                    <Star className="w-5 h-5 text-green-600 mb-1" />
                    <p className="text-sm text-muted-foreground">Badges</p>
                    <p className="text-lg text-foreground">{stats.badges}</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-3">
                    <Zap className="w-5 h-5 text-yellow-600 mb-1" />
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="text-lg text-foreground">{stats.streak} days</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-foreground mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          value={profileData.studentId}
                          disabled
                          className="mt-1 bg-muted"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={profileData.department}
                          disabled
                          className="mt-1 bg-muted"
                        />
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          value={profileData.year}
                          disabled
                          className="mt-1 bg-muted"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="campus">Campus Location</Label>
                      <Input
                        id="campus"
                        value={profileData.campus}
                        onChange={(e) => setProfileData({ ...profileData, campus: e.target.value })}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-foreground mb-4">Issue Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Issues Reported</p>
                      <p className="text-2xl text-foreground">{stats.totalIssues}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Resolved Issues</p>
                      <p className="text-2xl text-foreground">{stats.resolvedIssues}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                      <p className="text-2xl text-foreground">
                        {stats.totalIssues > 0 ? Math.round((stats.resolvedIssues / stats.totalIssues) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card className="p-6">
                  <h3 className="text-foreground mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {activityHistory.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex-1">
                          <p className="text-foreground mb-1">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-700">
                            {activity.points}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Badges Tab */}
              <TabsContent value="badges">
                <Card className="p-6">
                  <h3 className="text-foreground mb-4">Achievement Badges</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentBadges.map((badge) => (
                      <div key={badge.id} className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
                            <badge.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-foreground mb-1">{badge.name}</h4>
                            <p className="text-sm text-muted-foreground">Earned {badge.earnedDate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-foreground mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-foreground">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-foreground">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">Get notified on your device</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.pushNotifications}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, pushNotifications: checked })}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-foreground">Weekly Digest</p>
                          <p className="text-sm text-muted-foreground">Weekly summary of your activity</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.weeklyDigest}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, weeklyDigest: checked })}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-foreground">Issue Status Updates</p>
                          <p className="text-sm text-muted-foreground">Notify when issue status changes</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.issueUpdates}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, issueUpdates: checked })}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-foreground">Gamification Alerts</p>
                          <p className="text-sm text-muted-foreground">Badges, points, and achievements</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.gamificationAlerts}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, gamificationAlerts: checked })}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-foreground mb-4">Privacy & Security</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="w-4 h-4 mr-2" />
                      Privacy Settings
                    </Button>
                    {onLogout && (
                      <Button variant="outline" className="w-full justify-start" onClick={onLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}