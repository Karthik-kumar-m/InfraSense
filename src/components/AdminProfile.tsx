import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Eye,
  LogOut,
  Users,
  CheckCircle,
  AlertCircle,
  Settings,
  BarChart3,
  Target,
  Clock,
  TrendingUp,
  Award,
  Lock,
  Key,
  Activity
} from 'lucide-react';
import { getAnalytics, getIssues } from '../utils/api';
import { getAuth } from '../utils/api';
import { toast } from 'sonner';

interface AdminProfileProps {
  staffName: string;
  onBack: () => void;
  onLogout?: () => void;
}

export function AdminProfile({ staffName, onBack, onLogout }: AdminProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  const [profileData, setProfileData] = useState({
    fullName: auth?.profile?.name || 'Staff Member',
    email: auth?.profile?.email || 'staff@university.edu',
    phone: '+1 (555) 987-6543',
    role: auth?.profile?.role || 'staff',
    department: auth?.profile?.department || 'Facilities',
    position: 'Senior Technician',
    employeeId: 'EMP2024001',
    campus: 'Main Campus',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    urgentAlerts: true,
    assignmentAlerts: true,
    teamUpdates: true,
  });

  const [stats, setStats] = useState({
    assignedIssues: 0,
    resolvedThisMonth: 0,
    avgResponseTime: '0 hrs',
    teamSize: 0,
    activeDepartments: 0,
    satisfactionRate: 0,
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      console.log('[AdminProfile] Loading profile data...');
      
      // Load analytics data
      const analytics = await getAnalytics();
      console.log('[AdminProfile] Analytics:', analytics);
      
      // Load all issues
      const issues = await getIssues();
      console.log('[AdminProfile] All issues:', issues);
      
      const assignedCount = issues.filter((i: any) => i.status === 'assigned' || i.status === 'in-progress').length;
      const resolvedCount = issues.filter((i: any) => i.status === 'resolved').length;
      
      setStats({
        assignedIssues: assignedCount,
        resolvedThisMonth: resolvedCount,
        avgResponseTime: '2.4 hrs',
        teamSize: 12,
        activeDepartments: 5,
        satisfactionRate: 94,
      });
      
    } catch (error: any) {
      console.error('[AdminProfile] Error loading profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', profileData);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const recentActivity = [
    { id: 1, action: 'Assigned issue to John Williams', type: 'assignment', date: '15 minutes ago', icon: Users },
    { id: 2, action: 'Resolved critical HVAC issue in Building A', type: 'resolution', date: '1 hour ago', icon: CheckCircle },
    { id: 3, action: 'Updated department staff roster', type: 'admin', date: '3 hours ago', icon: Settings },
    { id: 4, action: 'Generated weekly analytics report', type: 'report', date: '5 hours ago', icon: BarChart3 },
    { id: 5, action: 'Escalated electrical issue to senior technician', type: 'escalation', date: '1 day ago', icon: AlertCircle },
    { id: 6, action: 'Approved maintenance request for Room 301', type: 'approval', date: '1 day ago', icon: CheckCircle },
    { id: 7, action: 'Conducted team training session', type: 'training', date: '2 days ago', icon: Users },
  ];

  const permissions = [
    { id: 1, name: 'Issue Management', description: 'Create, assign, and resolve issues', enabled: true },
    { id: 2, name: 'User Management', description: 'Manage staff and student accounts', enabled: true },
    { id: 3, name: 'Analytics Access', description: 'View and export analytics data', enabled: true },
    { id: 4, name: 'Department Administration', description: 'Manage department settings', enabled: true },
    { id: 5, name: 'System Configuration', description: 'Configure system settings', enabled: false },
    { id: 6, name: 'Report Generation', description: 'Generate custom reports', enabled: true },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'resolution': return 'text-green-600 bg-green-50';
      case 'assignment': return 'text-blue-600 bg-blue-50';
      case 'escalation': return 'text-orange-600 bg-orange-50';
      case 'admin': return 'text-purple-600 bg-purple-50';
      case 'report': return 'text-indigo-600 bg-indigo-50';
      case 'approval': return 'text-emerald-600 bg-emerald-50';
      case 'training': return 'text-pink-600 bg-pink-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

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
              <h2 className="text-foreground">Admin Profile</h2>
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
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-2xl">
                    {profileData.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-foreground mb-1">{profileData.fullName}</h3>
                <Badge className="mb-2 bg-purple-100 text-purple-700 hover:bg-purple-100">
                  <Shield className="w-3 h-3 mr-1" />
                  {profileData.role}
                </Badge>
                <p className="text-sm text-muted-foreground mb-4">{profileData.employeeId}</p>
                
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
                </div>
              </div>

              <Separator className="my-6" />

              {/* Quick Stats */}
              <div className="space-y-3">
                <h4 className="text-foreground mb-3">Performance Overview</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3">
                    <AlertCircle className="w-5 h-5 text-indigo-600 mb-1" />
                    <p className="text-sm text-muted-foreground">Assigned</p>
                    <p className="text-lg text-foreground">{stats.assignedIssues}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mb-1" />
                    <p className="text-sm text-muted-foreground">Resolved</p>
                    <p className="text-lg text-foreground">{stats.resolvedThisMonth}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3">
                    <Clock className="w-5 h-5 text-purple-600 mb-1" />
                    <p className="text-sm text-muted-foreground">Avg Time</p>
                    <p className="text-lg text-foreground">{stats.avgResponseTime}</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-3">
                    <Users className="w-5 h-5 text-yellow-600 mb-1" />
                    <p className="text-sm text-muted-foreground">Team</p>
                    <p className="text-lg text-foreground">{stats.teamSize}</p>
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
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
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
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input
                          id="employeeId"
                          value={profileData.employeeId}
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
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          value={profileData.role}
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
                  <h3 className="text-foreground mb-4">Department Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Resolved This Month</p>
                      <p className="text-2xl text-foreground">{stats.resolvedThisMonth}</p>
                      <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Active Departments</p>
                      <p className="text-2xl text-foreground">{stats.activeDepartments}</p>
                      <p className="text-xs text-muted-foreground mt-1">Across campus</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Satisfaction Rate</p>
                      <p className="text-2xl text-foreground">{stats.satisfactionRate}%</p>
                      <p className="text-xs text-green-600 mt-1">Above target</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card className="p-6">
                  <h3 className="text-foreground mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className={`w-10 h-10 rounded-lg ${getActivityColor(activity.type)} flex items-center justify-center flex-shrink-0`}>
                          <activity.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground mb-1">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Permissions Tab */}
              <TabsContent value="permissions">
                <Card className="p-6">
                  <h3 className="text-foreground mb-4">Role Permissions</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Your current role grants you the following permissions. Contact your system administrator to request changes.
                  </p>
                  <div className="space-y-3">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${permission.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {permission.enabled ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Lock className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-foreground mb-1">{permission.name}</h4>
                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                          </div>
                        </div>
                        <Badge variant={permission.enabled ? "default" : "secondary"}>
                          {permission.enabled ? "Granted" : "Restricted"}
                        </Badge>
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
                        <AlertCircle className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-foreground">Urgent Alerts</p>
                          <p className="text-sm text-muted-foreground">Immediate notification for urgent issues</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.urgentAlerts}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, urgentAlerts: checked })}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-foreground">Assignment Alerts</p>
                          <p className="text-sm text-muted-foreground">Notification for new assignments</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.assignmentAlerts}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, assignmentAlerts: checked })}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-foreground">Team Updates</p>
                          <p className="text-sm text-muted-foreground">Updates from team members</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.teamUpdates}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, teamUpdates: checked })}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-foreground mb-4">Security & Privacy</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Two-Factor Authentication
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="w-4 h-4 mr-2" />
                      Privacy Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="w-4 h-4 mr-2" />
                      Activity Log
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