import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { StatusBadge } from './StatusBadge';
import { SentimentIndicator } from './SentimentIndicator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Logo } from './Logo';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Clock,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'created' | 'assigned' | 'in-progress' | 'resolved' | 'comment';
  title: string;
  description?: string;
  user: string;
  timestamp: string;
}

interface IssueDetailsProps {
  onBack: () => void;
}

export function IssueDetails({ onBack }: IssueDetailsProps) {
  // Mock data
  const issue = {
    id: '1',
    title: 'Broken projector in classroom',
    category: 'Equipment',
    room: 'Room 301',
    building: 'Building A',
    floor: '3',
    status: 'in-progress' as const,
    sentiment: 'high' as const,
    description: 'The projector in Room 301 is not turning on. This is urgent as we have a presentation scheduled for tomorrow morning.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop',
    createdAt: '2024-11-20T10:30:00',
    assignedStaff: {
      name: 'John Smith',
      role: 'Maintenance Technician',
      department: 'Facilities',
    },
    expectedResolution: '2024-11-21T14:00:00',
  };

  const timeline: TimelineEvent[] = [
    {
      id: '1',
      type: 'created',
      title: 'Issue reported',
      description: 'Issue was submitted by student',
      user: 'You',
      timestamp: '2024-11-20T10:30:00',
    },
    {
      id: '2',
      type: 'assigned',
      title: 'Assigned to technician',
      description: 'Issue assigned to John Smith from Facilities',
      user: 'System',
      timestamp: '2024-11-20T10:45:00',
    },
    {
      id: '3',
      type: 'in-progress',
      title: 'Work started',
      description: 'Technician has started working on the issue',
      user: 'John Smith',
      timestamp: '2024-11-20T14:20:00',
    },
    {
      id: '4',
      type: 'comment',
      title: 'Status update',
      description: 'Ordered replacement parts. Will be installed tomorrow morning.',
      user: 'John Smith',
      timestamp: '2024-11-20T16:00:00',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimelineIcon = (type: TimelineEvent['type']) => {
    const icons = {
      created: Calendar,
      assigned: User,
      'in-progress': Clock,
      resolved: CheckCircle,
      comment: User,
    };
    return icons[type];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-6">
            <Logo size="sm" />
            <div className="flex items-center gap-3 flex-1">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <h2 className="text-foreground">Issue Details</h2>
                <p className="text-sm text-muted-foreground">Track the progress of your report</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Issue Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-foreground mb-3">{issue.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <StatusBadge status={issue.status} />
                    <SentimentIndicator level={issue.sentiment} />
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{issue.room}, {issue.building}, Floor {issue.floor}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Reported on {formatDate(issue.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Expected resolution: {formatDate(issue.expectedResolution)}</span>
                </div>
              </div>
            </div>

            {issue.imageUrl && (
              <div className="w-full md:w-64">
                <img 
                  src={issue.imageUrl} 
                  alt="Issue" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="p-6">
              <h4 className="text-foreground mb-3">Description</h4>
              <p className="text-muted-foreground">{issue.description}</p>
            </Card>

            {/* Timeline */}
            <Card className="p-6">
              <h4 className="text-foreground mb-6">Timeline</h4>
              <div className="space-y-6">
                {timeline.map((event, index) => {
                  const Icon = getTimelineIcon(event.type);
                  const isLast = index === timeline.length - 1;

                  return (
                    <div key={event.id} className="relative">
                      {!isLast && (
                        <div className="absolute left-5 top-10 w-0.5 h-full bg-border" />
                      )}
                      <div className="flex gap-4">
                        <div className="relative z-10 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <h4 className="text-foreground">{event.title}</h4>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatDate(event.timestamp)}
                            </span>
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mb-1">{event.description}</p>
                          )}
                          <p className="text-sm text-muted-foreground">by {event.user}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assigned Staff */}
            <Card className="p-6">
              <h4 className="text-foreground mb-4">Assigned To</h4>
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {issue.assignedStaff.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-foreground">{issue.assignedStaff.name}</p>
                  <p className="text-sm text-muted-foreground">{issue.assignedStaff.role}</p>
                  <p className="text-sm text-muted-foreground">{issue.assignedStaff.department}</p>
                </div>
              </div>
            </Card>

            {/* Issue Info */}
            <Card className="p-6">
              <h4 className="text-foreground mb-4">Issue Information</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Category</p>
                  <p className="text-foreground">{issue.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Issue ID</p>
                  <p className="text-foreground font-mono">#{issue.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Status</p>
                  <StatusBadge status={issue.status} />
                </div>
              </div>
            </Card>

            {/* Points Earned */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-green-900 mb-1">+50 Points</h4>
                <p className="text-sm text-green-700">Earned for reporting this issue</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}