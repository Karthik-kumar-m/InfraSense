import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { StatCard } from './StatCard';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  BarChart3,
  Settings,
  Mail,
  Phone,
  CheckCircle,
  Clock
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  assignedIssues: number;
  resolvedIssues: number;
  avgResolutionTime: string;
  status: 'active' | 'inactive';
}

interface DepartmentAdminProps {
  onBack: () => void;
}

export function DepartmentAdmin({ onBack }: DepartmentAdminProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const departmentStats = {
    totalStaff: 12,
    activeIssues: 45,
    resolvedThisMonth: 156,
    avgResolutionTime: '2.5 hrs',
  };

  const staffMembers: StaffMember[] = [
    {
      id: '1',
      name: 'Mike Smith',
      email: 'mike.smith@university.edu',
      phone: '+1 (555) 123-4567',
      role: 'Maintenance Technician',
      department: 'Facilities',
      assignedIssues: 12,
      resolvedIssues: 45,
      avgResolutionTime: '2.1 hrs',
      status: 'active',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@university.edu',
      phone: '+1 (555) 234-5678',
      role: 'Facilities Coordinator',
      department: 'Facilities',
      assignedIssues: 8,
      resolvedIssues: 38,
      avgResolutionTime: '2.8 hrs',
      status: 'active',
    },
    {
      id: '3',
      name: 'Tom Davis',
      email: 'tom.davis@university.edu',
      phone: '+1 (555) 345-6789',
      role: 'Electrician',
      department: 'Facilities',
      assignedIssues: 10,
      resolvedIssues: 42,
      avgResolutionTime: '2.4 hrs',
      status: 'active',
    },
    {
      id: '4',
      name: 'Lisa Anderson',
      email: 'lisa.a@university.edu',
      phone: '+1 (555) 456-7890',
      role: 'Plumber',
      department: 'Facilities',
      assignedIssues: 9,
      resolvedIssues: 35,
      avgResolutionTime: '2.6 hrs',
      status: 'active',
    },
    {
      id: '5',
      name: 'Robert Wilson',
      email: 'robert.w@university.edu',
      phone: '+1 (555) 567-8901',
      role: 'HVAC Technician',
      department: 'Facilities',
      assignedIssues: 6,
      resolvedIssues: 28,
      avgResolutionTime: '3.2 hrs',
      status: 'inactive',
    },
  ];

  const filteredStaff = staffMembers.filter((staff) => {
    return staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           staff.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getWorkloadPercentage = (assigned: number) => {
    const max = 15;
    return (assigned / max) * 100;
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
                <h2 className="text-foreground">Department Management</h2>
                <p className="text-sm text-muted-foreground">Facilities Department</p>
              </div>
            </div>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Department Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Staff"
            value={departmentStats.totalStaff}
            icon={Users}
          />
          <StatCard
            title="Active Issues"
            value={departmentStats.activeIssues}
            icon={Clock}
            trend={{ value: '+3 from yesterday', isPositive: false }}
          />
          <StatCard
            title="Resolved (Month)"
            value={departmentStats.resolvedThisMonth}
            icon={CheckCircle}
            trend={{ value: '+12% from last month', isPositive: true }}
          />
          <StatCard
            title="Avg Resolution"
            value={departmentStats.avgResolutionTime}
            icon={BarChart3}
            trend={{ value: '-0.3 hrs', isPositive: true }}
          />
        </div>

        {/* Staff Management */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-foreground mb-2">Staff Members</h3>
              <p className="text-muted-foreground">Manage your department team</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-input-background"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredStaff.map((staff) => (
              <Card key={staff.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Staff Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-foreground">{staff.name}</h4>
                        <Badge 
                          variant={staff.status === 'active' ? 'default' : 'secondary'}
                          className={staff.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {staff.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{staff.role}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{staff.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{staff.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Assigned Issues</p>
                      <p className="text-2xl text-foreground mb-2">{staff.assignedIssues}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={getWorkloadPercentage(staff.assignedIssues)} className="h-2" />
                        <span className="text-xs text-muted-foreground">
                          {Math.round(getWorkloadPercentage(staff.assignedIssues))}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Resolved (Month)</p>
                      <p className="text-2xl text-foreground mb-2">{staff.resolvedIssues}</p>
                      <p className="text-sm text-muted-foreground">
                        Avg: {staff.avgResolutionTime}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:flex-col lg:justify-center">
                    <Button variant="outline" size="sm" className="flex-1 lg:flex-initial">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 lg:flex-initial">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Department Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-foreground mb-4">Top Performers This Month</h3>
            <div className="space-y-4">
              {staffMembers
                .filter(s => s.status === 'active')
                .sort((a, b) => b.resolvedIssues - a.resolvedIssues)
                .slice(0, 3)
                .map((staff, index) => (
                  <div key={staff.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white">
                      {index + 1}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-foreground">{staff.name}</p>
                      <p className="text-sm text-muted-foreground">{staff.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground">{staff.resolvedIssues}</p>
                      <p className="text-xs text-muted-foreground">resolved</p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-foreground mb-4">Workload Distribution</h3>
            <div className="space-y-4">
              {staffMembers
                .filter(s => s.status === 'active')
                .sort((a, b) => b.assignedIssues - a.assignedIssues)
                .map((staff) => (
                  <div key={staff.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-foreground">{staff.name}</p>
                      <p className="text-sm text-muted-foreground">{staff.assignedIssues} issues</p>
                    </div>
                    <Progress value={getWorkloadPercentage(staff.assignedIssues)} className="h-2" />
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
