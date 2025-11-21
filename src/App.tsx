import React, { useState } from 'react';
import { StudentLogin } from './components/StudentLogin';
import { StaffLogin } from './components/StaffLogin';
import { StudentDashboard } from './components/StudentDashboard';
import { ReportIssueForm } from './components/ReportIssueForm';
import { IssueDetails } from './components/IssueDetails';
import { GamificationPage } from './components/GamificationPage';
import { StaffDashboard } from './components/StaffDashboard';
import { IssueTable } from './components/IssueTable';
import { StaffIssueDetails } from './components/StaffIssueDetails';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { DepartmentAdmin } from './components/DepartmentAdmin';
import { UserProfile } from './components/UserProfile';
import { AdminProfile } from './components/AdminProfile';
import { Logo } from './components/Logo';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Toaster } from './components/ui/sonner';
import { 
  GraduationCap, 
  Shield, 
  Home, 
  FileText, 
  Trophy,
  BarChart3,
  Users,
  Settings
} from 'lucide-react';

type Screen = 
  | 'welcome'
  | 'student-login'
  | 'staff-login'
  | 'student-dashboard'
  | 'report-issue'
  | 'issue-details'
  | 'gamification'
  | 'staff-dashboard'
  | 'issue-table'
  | 'staff-issue-details'
  | 'analytics'
  | 'department-admin'
  | 'user-profile'
  | 'admin-profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userType, setUserType] = useState<'student' | 'staff' | null>(null);
  const [userName, setUserName] = useState('');

  const handleStudentLogin = (data: any) => {
    setUserType('student');
    setUserName(data.email?.split('@')[0] || 'Student');
    setCurrentScreen('student-dashboard');
  };

  const handleStaffLogin = (data: any) => {
    setUserType('staff');
    setUserName(data.email?.split('@')[0] || 'Staff Member');
    setCurrentScreen('staff-dashboard');
  };

  const resetToWelcome = () => {
    setCurrentScreen('welcome');
    setUserType(null);
    setUserName('');
  };

  // Welcome Screen
  if (currentScreen === 'welcome') {
    return (
      <>
        <Toaster />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col p-4">
          {/* Logo at top left */}
          <div className="absolute top-6 left-6">
            <Logo size="md" />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-2xl w-full">
              <Card className="p-12">
                <div className="text-center mb-8">
                  <h2 className="text-foreground mb-2">Welcome! Please Login</h2>
                  <p className="text-muted-foreground">
                    Choose your role to continue
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {/* Student Login Button */}
                  <Button 
                    className="w-full h-16 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" 
                    onClick={() => setCurrentScreen('student-login')}
                  >
                    <GraduationCap className="w-6 h-6 mr-3" />
                    Student Login
                  </Button>

                  {/* Admin Login Button */}
                  <Button 
                    className="w-full h-16 text-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700" 
                    onClick={() => setCurrentScreen('staff-login')}
                  >
                    <Shield className="w-6 h-6 mr-3" />
                    Admin Login
                  </Button>
                </div>

                <div className="pt-6 border-t">
                  <p className="text-center text-muted-foreground">
                    New user? Contact your administrator for access
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Student Login
  if (currentScreen === 'student-login') {
    return (
      <>
        <Toaster />
        <StudentLogin onLogin={handleStudentLogin} />
      </>
    );
  }

  // Staff Login
  if (currentScreen === 'staff-login') {
    return (
      <>
        <Toaster />
        <StaffLogin onLogin={handleStaffLogin} />
      </>
    );
  }

  // Student Dashboard
  if (currentScreen === 'student-dashboard') {
    return (
      <>
        <Toaster />
        <StudentDashboard
          studentName={userName || 'John Doe'}
          onReportIssue={() => setCurrentScreen('report-issue')}
          onViewIssue={(id) => setCurrentScreen('issue-details')}
          onViewGamification={() => setCurrentScreen('gamification')}
          onViewProfile={() => setCurrentScreen('user-profile')}
          onLogout={resetToWelcome}
        />
      </>
    );
  }

  // Report Issue Form
  if (currentScreen === 'report-issue') {
    return (
      <>
        <Toaster />
        <ReportIssueForm
          onSubmit={(data) => {
            console.log('Issue submitted:', data);
            setCurrentScreen('student-dashboard');
          }}
          onCancel={() => setCurrentScreen('student-dashboard')}
        />
      </>
    );
  }

  // Issue Details (Student View)
  if (currentScreen === 'issue-details') {
    return (
      <IssueDetails
        onBack={() => setCurrentScreen('student-dashboard')}
      />
    );
  }

  // Gamification Page
  if (currentScreen === 'gamification') {
    return (
      <GamificationPage
        onBack={() => setCurrentScreen('student-dashboard')}
      />
    );
  }

  // Staff Dashboard
  if (currentScreen === 'staff-dashboard') {
    return (
      <StaffDashboard
        staffName={userName || 'Mike Smith'}
        onViewIssue={(id) => setCurrentScreen('staff-issue-details')}
        onViewAllIssues={() => setCurrentScreen('issue-table')}
        onViewAnalytics={() => setCurrentScreen('analytics')}
        onViewDepartmentAdmin={() => setCurrentScreen('department-admin')}
        onViewProfile={() => setCurrentScreen('admin-profile')}
        onLogout={resetToWelcome}
      />
    );
  }

  // Issue Table (Staff View)
  if (currentScreen === 'issue-table') {
    return (
      <IssueTable
        onBack={() => setCurrentScreen('staff-dashboard')}
        onViewIssue={(id) => setCurrentScreen('staff-issue-details')}
      />
    );
  }

  // Staff Issue Details
  if (currentScreen === 'staff-issue-details') {
    return (
      <StaffIssueDetails
        onBack={() => setCurrentScreen('staff-dashboard')}
      />
    );
  }

  // Analytics Dashboard
  if (currentScreen === 'analytics') {
    return (
      <AnalyticsDashboard
        onBack={() => setCurrentScreen('staff-dashboard')}
      />
    );
  }

  // Department Admin Panel
  if (currentScreen === 'department-admin') {
    return (
      <DepartmentAdmin
        onBack={() => setCurrentScreen('staff-dashboard')}
      />
    );
  }

  // User Profile
  if (currentScreen === 'user-profile') {
    return (
      <UserProfile
        studentName={userName || 'John Doe'}
        onBack={() => setCurrentScreen('student-dashboard')}
        onLogout={resetToWelcome}
      />
    );
  }

  // Admin Profile
  if (currentScreen === 'admin-profile') {
    return (
      <AdminProfile
        staffName={userName || 'Mike Smith'}
        onBack={() => setCurrentScreen('staff-dashboard')}
        onLogout={resetToWelcome}
      />
    );
  }

  return null;
}